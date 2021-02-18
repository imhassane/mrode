const { ApolloError, UserInputError } = require("apollo-server");

const db = require("../db");
const utils = require("../utils");
const i18n = require("../internationalization");

const getCustomer = async (_, args, ctx) => {
    const { rows } = await db.pool.query(db.queries.GET_CUSTOMER_WITH_ID, [args.id]);
    if(!rows.length)
        throw new ApolloError(i18n(ctx.lang).customerDoesNotExist)
    return utils.makeCustomer(rows[0]);
};

const createCustomerWithAddress = async (_, args, ctx) => {
    args = utils.verifyCustomerWithAddress(args, ctx.lang);

    let message = null;
    try {
        const { rows } = await db.pool.query(db.queries.GET_CUSTOMER_WITH_EMAIL, [args.email]);
        if(rows.length)
            return utils.makeCustomer(rows[0]);
    } catch {
        throw new ApolloError(i18n(ctx.lang).internalError);
    }

    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        const customer = await client.query(db.queries.INSERT_CUSTOMER, [
            args.email, args.firstName, args.lastName
        ]);

        await client.query(db.queries.INSERT_CUSTOMER_ADDRESS, [
            customer.rows[0].cus_id, args.address,
            args.postalCode, args.city, args.country
        ]);
        await client.query('COMMIT');

        return utils.makeCustomer(customer.rows[0]);
    } catch {
        try {
            await client.query('ROLLBACK');
        } catch {}
        throw new ApolloError(i18n(ctx.lang).internalError);
    }
};

const addresses = async (parent, _, ctx) => {
    try {
        const { rows } = await db.pool.query(db.queries.GET_CUSTOMER_ADDRESSES, [parent.id]);
        return rows.map(r => utils.makeCustomerAddress(r));
    } catch {
        throw new ApolloError(i18n(ctx.lang).internalError);
    }
};

const lastAddress = async (parent, _, ctx) => {
    try {
        const { rows } = await db.pool.query(db.queries.GET_CUSTOMER_LAST_ADDRESS, [parent.id]);
        if(!rows.length)
            return null;
        return utils.makeCustomerAddress(rows[0]);
    } catch {
        throw new ApolloError(i18n(ctx.lang).internalError);
    }
};

module.exports = {
    Query: {
        getCustomer,
    },
    Mutation: {
        createCustomerWithAddress,
    },
    Customer: {
        addresses,
        lastAddress,
    }
};