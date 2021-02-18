const { ApolloError, AuthenticationError, UserInputError } = require('apollo-server');
const randomstring = require("randomstring");
const jwt = require("jsonwebtoken");

const db = require("../db");
const utils = require("../utils");

const getMemberById = async (id) => {
    let error = null;
    try {
        const { rows } = await db.pool.query(db.queries.GET_MEMBER_BY_ID, [id]);
        if(!rows.length){
            error = true;
            throw new ApolloError("L'utilisateur n'existe pas");
        }
        return utils.makeMember(rows[0]);
    } catch (ex) {
        if(error)
            throw ex;
        throw new ApolloError("Une erreur est survenue lors de la récupération de l'utilisateur");
    }
};

const getOrderValidators = async (orderId, type) => {
  try {
      let query = db.queries.GET_ORDER_ACCEPTED_BY;
      if(type === 'PREPARATION')
          query = db.queries.GET_PREPARATION_BY;
      else if(type === 'PREPARATION_DONE')
          query = db.queries.GET_PREPARATION_DONE_BY;
      else if(type === 'DISPATCHED')
          query = db.queries.GET_DISPATCHED_BY;

      const { rows } = await db.pool.query(
          query,
          [parseInt(orderId)]);
      if(!rows.length)
          return null;
      return utils.makeMember(rows[0]);
  } catch {
      throw new ApolloError("Une erreur s'est produite lors de la récupération de l'utilisateur");
  }
};

const authenticateMember = async (_, args) => {
    if(args.accessCode.toString().length !== 6)
        throw new UserInputError("Le code d'acces doit comporter 6 chiffres");
    if(args.accessPassword.toString().length !== 6)
        throw new UserInputError("Le mot de passe doit comporter 6 chiffres");

    let error = null;
    try {
        const { rows } = await db.pool.query(db.queries.AUTHENTICATE_MEMBER, [
            args.accessCode
        ]);
        if(!rows.length) {
            error = true;
            throw new ApolloError("Le code d'acces est incorrect");
        }
        if(args.accessPassword !== rows[0].mem_access_pwd) {
            error = true;
            throw new ApolloError("Le mot de passe est incorrect");
        }

        const token = jwt.sign(
            { sub: rows[0].mem_key, iat: Date.now() },
            process.env.JWT_SECRET
            );

        return {
            type: "ADMINISTRATION",
          token,
        };
    } catch (ex) {
        if(error) throw ex;
        throw ex;
        throw new ApolloError("Une erreur interne est survenue");
    }
}

const createMember = async (_, args) => {
    if(!utils.isValidEmail(args.email))
        throw new UserInputError("L'adresse email n'est pas valide");
    if(!args.fullName.trim().length)
        throw new UserInputError("Le nom complet est incorrect");

    args.fullName = args.fullName.trim();
    args.email = args.email.trim();

    const memberKey = randomstring.generate({ length: 6, charset: 'numeric' });
    const d = new Date();

    let memberAccessCode = [
        d.getFullYear().toString().substring(2),
        d.getMinutes(),
        d.getSeconds()
    ].map(v => v.toString().length < 2 ? "0"+v : v).join("");
    memberAccessCode = parseInt(memberAccessCode);

    try {
        await db.pool.query(db.queries.CREATE_MEMBER, [
            memberKey,
            args.fullName,
            memberAccessCode,
            memberAccessCode,
            args.email, args.role
        ]);

        return {
            accessCode: memberAccessCode,
            accessPassword: memberAccessCode
        }
    } catch {
        throw new ApolloError("Une erreur est survenue lors de l'ajout du membre");
    }
}


module.exports  = {
    Query: {
        authenticateMember
    },
    Mutation: {
        createMember,
        authenticateMember,
    },
    Order: {
        acceptedBy: (order) => {
            return getOrderValidators(order.id, 'ACCEPTED');
        },
        preparationBeganBy: (order) => {
            return getOrderValidators(order.id, 'PREPARATION');
        },
        preparationDoneBy: (order) => {
            return getOrderValidators(order.id, 'PREPARATION_DONE');
        },
        dispatchedBy: (order) => {
            return getOrderValidators(order.id, 'DISPATCHED');
        }
    }
}