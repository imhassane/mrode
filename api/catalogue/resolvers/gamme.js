const { ApolloError, UserInputError } = require("apollo-server");
const slugify = require("slugify");

const db = require("../db");
const utils = require("../utils");

const createGamme = async (parent, args) => {
    if(!utils.verifyGammeName(args.name))
        throw new UserInputError("Le nom de la gamme est incorrect");
    if(!utils.verifyGammeDescription(args.description))
        throw new UserInputError("La description est incorrecte");
    if(!args.products.length)
        throw new UserInputError("Aucun produit n'a été défini");

    const slug = slugify(args.name);
    const client = await db.pool.connect();
    try {
        await client.query("BEGIN");
        const gammeResult = await client.query(db.queries.CREATE_GAMME, [args.name, slug, args.description]);

        const gamme = gammeResult.rows[0];
        const gammeProducts = args.products.map(p => `(${gamme.gam_id}, ${p})`);
        await client.query(db.queries.INSERT_GAMME_PRODUCTS(gammeProducts.join(', ')));
        await client.query("COMMIT");

        return utils.makeGamme(gamme);
    } catch {
        try {
            await client.query('ROLLBACK');
        } catch {}
        throw new ApolloError("Une erreur s'est produite lors de l'ajout de la gamme");
    }
};

const getGammes = async (parent, args) => {
    const { rows } = await db.pool.query(db.queries.GET_ALL_GAMMES, [args.start, args.count]);
    return rows.map(r => utils.makeGamme(r));
};

const getGamme = async (parent, args) => {
    const { rows } = await db.pool.query(db.queries.GET_GAMME, [args.id]);
    if(!rows.length)
        throw new ApolloError("La gamme n'existe pas");
    return utils.makeGamme(rows[0]);
};

const getGammeProducts = async (parent, args) => {
    const { rows } = await db.pool.query(
        db.queries.GET_ALL_GAMME_PRODUCTS,
        [parent.id, args.start, args.count]
    );
    return rows.map(r => utils.makeProduct(r));
};

module.exports = {
    Query: {
        getGammes,
        getGamme
    },
    Mutation: {
        createGamme,
    },
    Gamme: {
        products: getGammeProducts,
    }
}