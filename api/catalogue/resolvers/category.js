const { ApolloError, UserInputError } = require("apollo-server");
const slugify = require("slugify");

const db = require("../db");
const utils = require("../utils");

const getCategories = async (parent, args) => {
    const { rows } = await db.pool.query(db.queries.GET_ALL_CATEGORIES, [args.start, args.count]);
    return rows.map(r => utils.makeCategory(r));
};

const getCategory = async (parent, args) => {
    const { rows } = await db.pool.query(db.queries.GET_CATEGORY, [args.id]);
    if(!rows.length)
        throw new ApolloError("La catégorie n'existe pas");
    return utils.makeCategory(rows[0]);
};

const createCategory = async (parent, args) => {
    if(!utils.isValidCategoryName(args.name))
        throw new UserInputError("Le nom de la catégorie est incorrect");
    if(!utils.isValidCategoryDescription(args.description))
        throw new UserInputError("La description de la catégorie est incorrecte");

    try {
        const slug = slugify(args.name);
        const { rows } = await db.pool.query(
            db.queries.CREATE_CATEGORY, [
            args.name, slug,
            args.description
        ]);

        return utils.makeCategory(rows[0]);
    } catch {
        throw new ApolloError("Une erreur s'est produite en interne");
    }
};

const getCategoryProducts = async (parent, args) => {
    const { rows } = await db.pool.query(db.queries.GET_ALL_CATEGORY_PRODUCTS, [parent.id, args.start, args.count]);
    return rows.map(r => utils.makeProduct(r));
};

module.exports = {
    Query: {
        getCategories,
        getCategory,
    },
    Mutation: {
        createCategory,
    },
    Category: {
        products: getCategoryProducts,
    }
};
