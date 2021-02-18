const { ApolloError, AuthenticationError, UserInputError } = require('apollo-server');
const jwt = require("jsonwebtoken");

const db = require("../db");
const utils = require("../utils");
const i18n = require("../internationalization");
const randomstring = require("randomstring");

const verifyMlmAccessCode = async (parent, args, ctx) => {
  try {
      const { rows } = await db.pool.query(db.queries.VERIFY_MLM_ACCESS_CODE, [args.code]);
      return rows.length === 1 && rows[0].active;
  } catch {
      throw new ApolloError(ctx.i18n.internalError);
  }
};

// Invite MLM member is for the Admins
const inviteMlmMember = async (parent, args, ctx) => {
    let error = null;
    try {
        const accessCode = randomstring.generate({ length: 8 }).toString().toUpperCase();
        const params = [args.email, accessCode];
        if(ctx.mlmUser)
            params.push(ctx.mlmUser);

        await db.pool.query(
            ctx.mlmUser ? db.queries.INVITE_MLM_MEMBER_WITH_MEMBER : db.queries.INVITE_MLM_MEMBER,
            params
        );
        // TODO: send mail with the access coe
        return accessCode;
    } catch (ex) {
        if(error)
            throw new ApolloError(error);
        throw new ApolloError("Une erreur interne est survenue");
    }
};

const createMlmMember = async (parent, args, ctx) => {
    let error = null;

    if(!args.firstName || args.firstName.length < 3)
        throw new UserInputError(ctx.i18n.incorrectFirstName);
    if(!args.lastName || args.lastName.length < 3)
        throw new UserInputError(ctx.i18n.incorrectLastName);
    if(!args.password || args.password.length < 8)
        throw new UserInputError(ctx.i18n.incorrectPassword);
    if(!args.siret || args.siret.length !== 14)
        throw new UserInputError(ctx.i18n.incorrectSiret);
    try {
        // Checking that the access code exists.
        const verifyExists = await db.pool.query(db.queries.VERIFY_MLM_ACCESS_CODE, [args.code]);
        if(!verifyExists.rowCount)
            throw new ApolloError(ctx.i18n.accessCodeNotFound);

        const { added_by, email, active } = verifyExists.rows[0];
        if(!active)
            throw new ApolloError(ctx.i18n.accessCodeNotActive);

        const client = await db.pool.connect();
        try {
            // If the member has not been added by the company member
            // we get the hierarchy of the member who added him
            // and we add him on it
            let hierarchy = "";
            let query = db.queries.INSERT_MLM_MEMBER;

            const hash = utils.hashPassword(args.password);
            let params =
                [email, args.firstName, args.lastName, hash, hierarchy, args.code, args.avatar, args.avatarUrl];
            if(added_by) {
                const { rows } = await client.query(db.queries.GET_MLM_HIERARCHY, [added_by]);
                if(rows.length)
                    hierarchy = rows[0].mid_hierarchy;
                let splits = hierarchy.split(";").filter(x => x.length > 0);
                splits.push(`${added_by}`);
                hierarchy = splits.join(";");
                params = [...params, added_by];
                params[4] = hierarchy;
                query = db.queries.INSERT_MLM_MEMBER_WITH_ADDED;
            };

            await client.query('BEGIN');
            // Adding the new member.
            const memberQuery = await client.query(query, params);

            // Adding the documents
            await client.query(
                db.queries.INSERT_MLM_DOCUMENTS,
                [memberQuery.rows[0].mid_id, args.siret]
            );
            // Desactivation of the invitation link.
            await client.query(db.queries.DESACTIVATE_MLM_INVITATION, [args.code]);
            await client.query('COMMIT');

            return utils.makeMlmMember(memberQuery.rows[0]);
        } catch (ex) {
            try {
                await client.query('ROLLBACK');
            } catch {}
            throw ex;
            error = ctx.i18n.internalError;
            throw new ApolloError(error);
        }
    } catch (ex) {
        throw ex;
        if(error)
            throw new ApolloError(error);
        throw new ApolloError(ctx.i18n.internalError);
    }
};

const authenticateMlmMember = async (parent, args, ctx) => {
    if(!args.code || args.code.trim().length !== 8)
        throw new UserInputError(ctx.i18n.incorrectAccessCode);
    if(!args.password || args.password.trim().length < 8)
        throw new UserInputError(ctx.i18n.incorrectPassword);

    let error = null;
    try {
        const credentialsQuery = await db.pool.query(db.queries.GET_MLM_MEMBER_CREDENTIALS, [args.code]);
        if(!credentialsQuery.rowCount) {
            error = ctx.i18n.customerDoesNotExist;
            throw new Error;
        }

        const {
            mid_status: mlm_status,
            mid_hash: mlm_hash,
            mid_id: mlm_id
        } = credentialsQuery.rows[0];
        if(mlm_status !== "ACTIVE") {
            if(mlm_status === "INACTIVE")
                error = ctx.i18n.inactiveCustomer;
            else if (mlm_status === "WAITING_VALIDATION")
                error = ctx.i18n.waitingForValidationCustomer;
            else if (mlm_status === "BLOCKED")
                error = ctx.i18n.blockedCustomer;
            else if(mlm_status === "DELETED")
                error = ctx.i18n.deletedCustomer;
            throw new Error(error);
        }

        if(!utils.comparePassword(args.password, mlm_hash)) {
            error = ctx.i18n.invalidPassword;
            throw new Error;
        }

        const payload = {
            sub: mlm_id,
            iat: Date.now(),
            aud: "mlm",
        };
        const token = await jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "2h",
        });
        return {
            type: "mlm",
            token,
        };
    } catch (ex) {
        if(error) throw new ApolloError(error);
        throw new ApolloError(ctx.i18n.internalError);
    }
};

const authenticatedMlmMember = async (_p, _a, ctx) => {
    let error = null;
    if(!ctx.mlmUser)
        throw new AuthenticationError(ctx.i18n.notAuthenticated);
    try {
        const memberQuery = await db.pool.query(db.queries.GET_MLM_MEMBER, [ctx.mlmUser]);
        if(!memberQuery.rowCount)
            throw new AuthenticationError(ctx.i18n.notAuthenticated);
        return utils.makeMlmMember(memberQuery.rows[0]);
    } catch (ex) {
        if(error) throw new ApolloError(error);
        throw ex;
        throw new ApolloError(ctx.i18n.internalError);
    }
};

const getMlmMemberCollaborators = async (parent, args, ctx) => {
    try {
        const { rows: [{added_by}]} = await db.pool.query(db.queries.GET_MLM_HIERARCHY, [args.id])

        let adder = null, hierarchy = [];

        if(added_by) {
            const { rows: [member] } =
                await db.pool.query(db.queries.GET_MLM_MEMBER, [added_by]);
            adder = utils.makeMlmMember(member);
        }

        const { rows } = await db.pool.query(db.queries.GET_MLM_MEMBER_HIERARCHY, [args.id]);
        hierarchy = rows.map(utils.makeMlmMember);

        return { adder, hierarchy };
    } catch {
        throw new ApolloError(ctx.i18n.internalError);
    }
};

const collaborators = async (parent, _, ctx) => {
    return getMlmMemberCollaborators(parent, { id: parent.id }, ctx);
}

const getMlmMemberAddresses = async (parent, args, ctx) => {
    try {
        const { rows } = await db.pool.query(db.queries.GET_MLM_ADDRESSES, [args.id]);
        return rows.map(r => utils.makeAddress(r));
    } catch {
        throw new ApolloError(ctx.i18n.internalError);
    }
}

const addresses = async (parent, _, ctx) => {
    return await getMlmMemberAddresses(parent, { id: parent.id } , ctx);
};

const addAddress = async (parent, args, ctx) => {
    if(!ctx.mlmUser)
        throw new AuthenticationError(ctx.i18n.notAuthenticated);

    if(!args.streetName || args.streetName.trim().length < 2)
        throw new UserInputError(ctx.i18n.invalidData);
    if(!args.streetNumber)
        throw new UserInputError(ctx.i18n.invalidData);
    if(!args.country || args.country.trim().length < 2)
        throw new UserInputError(ctx.i18n.invalidData);
    if(!args.city || args.city.trim().length < 2)
        throw new UserInputError(ctx.i18n.invalidData);

    try {
        const params = [
            args.streetName, args.postalCode, args.country,
            args.streetNumber, args.city, ctx.mlmUser
        ];
        const { rows } = await db.pool.query(db.queries.INSERT_ADDRESS, params);
        return utils.makeAddress(rows[0]);
    } catch (ex) {
        throw new ApolloError(ctx.i18n.internalError);
    }
};

const deleteAddress = async (parent, args, ctx) => {
    if(!ctx.mlmUser)
        throw new AuthenticationError(ctx.i18n.notAuthenticated);

    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        // On passe l'identifiant de l'utilisateur connecté
        // pour ne supprimer que les adresses que nous avons ajoutées.
        const { rows } = await client.query(db.queries.DELETE_ADDRESS, [args.id, ctx.mlmUser]);
        if(rows[0].mia_main_address)
            await client.query(`
                UPDATE mlm_identity_mid
                    SET mia_id = NULL
                WHERE mid_id = $1
            `, [ctx.mlmUser]);
        await client.query('COMMIT');
        client.release();

        return utils.makeAddress(rows[0]);
    } catch {
        try {
            await client.query('ROLLBACK');
            client.release();

        } catch {}
        throw new ApolloError(ctx.i18n.internalError);
    }
};

const setCurrentAddress = async (parent, args, ctx) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        await client.query(`
            UPDATE mlm_identity_mid
                SET mia_id = $1
            WHERE mid_id = $2
        `, [args.id, ctx.mlmUser]
        );
        // On désactive les précedentes adresses principales et on met à jour la nouvelle.
        await client.query(`UPDATE mlm_identity_address_mia SET mia_main_address = false WHERE mid_id = $1`, [ctx.mlmUser]);
        const { rows } = await client.query('UPDATE mlm_identity_address_mia SET mia_main_address = true WHERE mia_id = $1 AND mid_id = $2 RETURNING *', [args.id, ctx.mlmUser]);
        await client.query('COMMIT');
        client.release();

        return utils.makeAddress(rows[0]);
    } catch {
        try {
            await client.query('ROLLBACK');
            client.release();
        } catch {}
        throw new ApolloError(ctx.i18n.internalError);
    }
};

module.exports = {
  Query: {
      getMlmMember: () => { id: 1 },
      authenticatedMlmMember,
      getMlmMemberCollaborators,
      getMlmMemberAddresses
  },
  Mutation: {
      inviteMlmMember,
      createMlmMember,
      verifyMlmAccessCode,
      authenticateMlmMember,
      addAddress,
      deleteAddress,
      setCurrentAddress,
  },
    MlmMember: {
        collaborators,
        addresses,
    }
};