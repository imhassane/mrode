const { ApolloError, AuthenticationError, UserInputError } = require('apollo-server');
const randomstring = require("randomstring");

const db = require("../db");
const utils = require("../utils");

const me = async (parent, args, ctx) => {

};

const createIdentity = async (parent, args) => {
    if(!utils.isValidEmail(args.email))
        throw new UserInputError("L'adresse email n'est pas correcte");
    if(!utils.isValidPassword(args.password))
        throw new UserInputError("Le mot de passe n'est pas défini");

    let role = null;
    switch (args.role) {
        case "DEV": role = "D"; break;
        case "SUPER_USER": role = "S"; break;
        case "EMPLOYEE": role = "E"; break;
    }

    const randomCode = randomstring.generate({ charset: "numeric", length: 5 });
    const [accessCode, password] = [role + randomCode, randomCode];

    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');

        await client.query('COMMIT');
    } catch {
        try {
            await client.query('ROLLBACK');
        } catch {}
        throw new ApolloError("Une erreur s'est produite");
    }
};

module.exports = {
    Query: {
        me,
    },
    Mutation: {
        createIdentity,
    }
}