const { ApolloError, UserInputError, ForbiddenError } = require("apollo-server");
const slugify = require("slugify");

const db = require("../db");
const utils = require("../utils");

const addFormation = async (parent, args, ctx) => {

    if(!args.required && args.required !== false)
        args.required = false;

    const slug = slugify(args.name, { lower: true, });

    try {
        const { rows } = await db.pool.query(
            db.queries.CREATE_FORMATION,
            [
                args.name, args.price, args.locale, args.cover,
                args.required, args.description, slug
            ]
        );
        return utils.makeFormation(rows[0]);
    } catch {
        throw new ApolloError(ctx.i18n.internalError);
    }
};

const getFormation = async (parent, args, ctx) => {
 if(!ctx.user) throw new ForbiddenError(ctx.i18n.forbidden);
 // TODO: Vérifier que le membre mlm a cette formation avant de l'afficher
  try {
      const { rows, rowCount } = await db.pool.query(db.queries.GET_FORMATION, [args.id]);
      if(!rowCount)
          throw new ApolloError(ctx.i18n.notExists);

      return utils.makeFormation(rows[0]);
  } catch {
      throw new ApolloError(ctx.i18n.internalError);
  }
};

const getAllFormations = async (parent, args, ctx) => {
    if(!ctx.user)
        throw new ApolloError(ctx.i18n.forbidden);
    try {
        const { rows } = await db.pool.query(db.queries.GET_ALL_FORMATIONS);
        return rows.map(utils.makeFormation);
    } catch {
        throw new ApolloError(ctx.i18n.internalError);
    }
};

const getMlmMemberFormations = async (parent, args, ctx) => {
    if(!ctx.mlmUser)
        throw new ApolloError(ctx.i18n.notAuthenticated);

    try {
        const { rows } = await db.pool.query(db.queries.GET_MLM_MEMBER_FORMATIONS, [args.id]);
        return rows.map(utils.makeFormation);
    } catch (ex) {
        return [];
    }
}

const getMlmFormations = async (parent, args, ctx) => {
    if(!ctx.mlmUser)
        throw new ApolloError(ctx.i18n.notAuthenticated);

    try {
        const { rows } = await db.pool.query(db.queries.GET_MLM_FORMATIONS, [ctx.mlmUser]);
        return rows.map(utils.makeFormation);
    } catch {
        throw new ApolloError(ctx.i18n.internalError);
    }
}

const addFormationContent = async (parent, args, ctx) => {
    if(!ctx.user)
        throw new ForbiddenError(ctx.i18n.forbidden);

    if(!args.name || args.name < 5)
        throw new ApolloError("Le nom de la formation doit dépasser 5 caractères");

    const slug = slugify(args.name, { lower: true });
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        const { rows } = await client.query(db.queries.INSERT_FORMATION_CONTENT, [
            args.name, args.duration, args.url, args.cover, args.isPreview, args.formationType,
            args.formationId, slug,
        ]);

        await client.query(`
            UPDATE t_formation_for
            SET for_content_count = for_content_count + 1
            WHERE for_id = $1
        `, [args.formationId]
        );
        await client.query('COMMIT');

        return utils.makeFormationContent(rows[0]);
    } catch {
        try {
            await client.query('ROLLBACK');
        } catch {}
        throw new ApolloError(ctx.i18n.internalError);
    }
};

const getAllFormationContent = async (parent, _args, ctx) => {
    if(!ctx.user)
        return [];
    try {
        const { rows } =
            await db.pool.query(db.queries.GET_ALL_FORMATION_CONTENT, [parent.id]);
        return rows.map(utils.makeFormationContent);
    } catch {
        return [];
    }
};

const switchFormationVisible = async (_parent, args, ctx) => {

    const verifyFormationHasContentQuery = await db.pool.query(
        "SELECT COUNT(for_id) as total FROM t_formation_content_fco WHERE for_id = $1", [args.id]);
    if(verifyFormationHasContentQuery.rows[0].total === '0')
        throw new ApolloError("Cette formation n'a aucun contenu, impossible de la mettre en ligne");

    try {
        const { rows } = await db.pool.query(`
            UPDATE t_formation_for
            SET for_visible = not for_visible
            WHERE for_id = $1
            RETURNING *
        `, [args.id]);
        return utils.makeFormation(rows[0]);
    } catch {
        throw new ApolloError(ctx.i18n.internalError);
    }
}

const subscribeToFormation = async (_parent, args, ctx) => {
    if(!ctx.mlmUser)
        throw new ApolloError(ctx.i18n.notAuthenticated);


    let error = false;
    const client = await db.pool.connect();
    try {
        // On vérifie que l'utilisateur n'a pas souscrit à cette formation.
        const verifyQuery = await
            client.query(`
                SELECT COUNT(for_id) as total
                FROM mlm_identity_formation
                WHERE mid_id = $1 AND for_id = $2
            `, [ctx.mlmUser, args.formationId]
            );
        const total = parseInt(verifyQuery.rows[0].total);

        if(total) {
            error = true;
            throw new Error(ctx.i18n.formation.alreadySubscribed);
        }

        await client.query('BEGIN');
        await client.query(`
            INSERT INTO mlm_identity_formation (for_id, mid_id)
            VALUES ($1, $2)
            RETURNING *
        `, [args.formationId, ctx.mlmUser]
        );
        const { rows } = await client.query(`
            UPDATE t_formation_for
            SET for_total_subscriptions = for_total_subscriptions + 1
            WHERE for_id = $1
            RETURNING *
        `, [args.formationId]);
        await client.query('COMMIT');

        return utils.makeFormation(rows[0]);
    } catch (ex) {
        try {
            await client.query('ROLLBACK');
        } catch {}
        if(error)
            throw new ApolloError(ex.message);
        throw new ApolloError(ctx.i18n.internalError);
    }
};

const formationsInfos = async (parent) => {
    try {
        const { rows } = await db.pool.query(db.queries.GET_MLM_MEMBER_FORMATIONS, [parent.id]);
        const formations = rows.map(utils.makeFormation);

        let hasAllRequiredFormations = true, remainingRequiredFormations = [];
        const requiredFormationsQuery = await db.pool.query(`SELECT for_id FROM t_formation_for WHERE for_required = true`);
        const formationsId = formations.map(f => f.id);

        for(let r of requiredFormationsQuery.rows) {
            if(!formationsId.includes(r.for_id)) {
                hasAllRequiredFormations = false;
                remainingRequiredFormations.push(r.for_id);
            }
        }

        return {
              formations,
              remainingRequiredFormations,
              hasAllRequiredFormations,
        };
    } catch {
        return {
            formations: [],
            hasAllRequiredFormations: false,
            remainingRequiredFormations: []
        }
    }
}

module.exports = {
    Query: {
        getFormation,
        getAllFormations,
        getMlmFormations,
        getMlmMemberFormations,
    },
    Mutation: {
        addFormation,
        addFormationContent,
        switchFormationVisible,
        subscribeToFormation,
    },
    Formation: {
        allContent: getAllFormationContent,
        content: () => []
    },
    MlmMember: {
        formationsInfos,
    }
}