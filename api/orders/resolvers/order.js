const { ApolloError, UserInputError, ForbiddenError } = require("apollo-server");

const randomstring = require("randomstring");
const db = require("../db");
const utils = require("../utils");
const i18n = require("../internalization");

const getOrdersWithStatus = async (_, args) => {
    try {
        const { rows } = await db.pool.query(db.queries.GET_ORDERS_WITH_STATUS, [args.status, args.count]);
        return rows.map(r => utils.makeOrder(r));
    } catch {
        throw new ApolloError("Une erreur est survenue lors de la récupération des commandes");
    }
};

const getNonClosedOrders = async (_, args) => {
    try {
        const { rows } = await db.pool.query(db.queries.GET_NON_CLOSED_ORDERS,
            [args.count]);
        return rows.map(r => utils.makeOrder(r));
    } catch (ex){ throw ex;
        throw new ApolloError("Une erreur est survenue lors de la récupération des commandes");
    }
};

const getOrder = async (_, args) => {
    let error = null;
    try {
      const { rows } = await db.pool.query(db.queries.GET_ORDER, [args.id]);
      if(!rows.length) {
          error = true;
          throw new ApolloError("La commande n'existe pas");
      }
      return utils.makeOrder(rows[0]);
    } catch (ex) {
        if(error)
            throw ex;
        throw new ApolloError("Une erreur interne est survenue");
    }
};

const createOrder = async (_, args, ctx) => {
    const $t = i18n(ctx.lang);
    const order = utils.isOrderValid(args);

    let errorMessage = null;
    const client = await db.pool.connect();
    try {
        const date = new Date();
        let orderPrice = 0;

        let numOrder = [
            date.getFullYear(),
            (date.getMonth() + 1),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds()
        ].map(v => v < 10 ? "0" + v : v).join("");
        numOrder +=
            randomstring.generate({ length: 17 - numOrder.length, capitalization: 'lowercase',charset: 'alphabetic' });

        // TODO: Gérer les précommandes
        const quantities = {};
        const wantedOptions = args.products.map(({optionId, quantity}) => {
            quantities[optionId] = parseInt(quantity);
            return parseInt(optionId);
        });

        await client.query('BEGIN');
        // Vérifie si tous les produits sont en quantité suffisante.
        const optionsList = await client.query(db.queries.GET_OPTIONS(wantedOptions.join(', ')));

        // On s'assure que les produits que l'utilisateur veut acheter existent dans la
        // base de données
        if(optionsList.rowCount !== args.products.length) {
            errorMessage = i18n(ctx.lang).invalidOrderProductsList;
            throw new UserInputError(errorMessage);
        }
        let unavailableQuantity = false;
        // On parcourt chaque option de la commande
        for(let option of optionsList.rows) {
            // Si un produit n'est plus disponible.
            if(option.pop_quantity < quantities[option.pop_id])
                unavailableQuantity = true;

            // Mise à jour du prix.
            const productPrice = ((option.pro_price * option.pro_margin) / 100) + option.pop_plus_value;
            orderPrice += productPrice * quantities[option.pop_id];
        }

        if(unavailableQuantity) {
            errorMessage = i18n(ctx.lang).outOfStock;
            throw new ApolloError(errorMessage);
        }

        // Ajout de la commande.
        const orderQuery = await client.query(db.queries.INSERT_ORDER, [
            numOrder, args.customerId,
            orderPrice, args.firstName, args.lastName,
            args.address
        ]);

        // Ajout des produits de la commande.
        const orderId = orderQuery.rows[0].ord_id;
        const orderProducts = optionsList.rows.map(op => {
            const price = (((op.pro_price * op.pro_margin) / 100) + op.pop_plus_value) * quantities[op.pop_id];
            const values = `(${orderId}, ${op.pro_id}, ${op.pop_id}, ${quantities[op.pop_id]}, ${price})`;
            return values;
        }).join(', ');
        await client.query(db.queries.INSERT_ORDER_PRODUCT(orderProducts));

        // Mise à jour des quantités.
        for (const key of Object.keys(quantities)) {
            await client.query(db.queries.UPDATE_PRODUCT_QUANTITY, [parseInt(quantities[key]), key]);
            // TODO: Si le produit est en quantité insuffisante, on désactive l'option.
        }
        await client.query('COMMIT');

        return { id: orderId, price: orderPrice, num: numOrder };

    } catch (ex) {
        try {
            await client.query('ROLLBACK');
        } catch {}

        if(errorMessage)
            throw ex;

        throw ex;
        throw new ApolloError($t.internalError);
    }
};

const updateOrderStatus = async (_, args, ctx) => {
    if(!ctx.user)
        throw new ForbiddenError("Vous devez être connecté pour mettre à jour le statut");

    const { rows } = await db.pool.query(db.queries.UPDATE_ORDER_STATUS(args.status, ctx.user), [args.id, args.status]);
    return utils.makeOrder(rows[0]);
};

const getOrderProducts = async (parent) => {

};

const getOrdersResume = async (_, args) => {
    try {
        const [
            unpaidOrders,
            waitingOrders,
            acceptedOrders,
            preparationOrders,
            preparationDoneOrders,
            dispatchedOrders
        ] = [
            await db.pool.query(db.queries.COUNT_UNPAID_ORDERS),
            await db.pool.query(db.queries.COUNT_WAITING_ORDERS),
            await db.pool.query(db.queries.COUNT_ACCEPTED_ORDERS),
            await db.pool.query(db.queries.COUNT_PREPARATION_ORDERS),
            await db.pool.query(db.queries.COUNT_PREPRATION_DONE_ORDERS),
            await db.pool.query(db.queries.COUNT_DISPATCHED_ORDERS),
        ];

        return {
            unpaidOrders: unpaidOrders.rows[0].total,
            waitingOrders: waitingOrders.rows[0].total,
            acceptedOrders: acceptedOrders.rows[0].total,
            preparationBeganOrders: preparationOrders.rows[0].total,
            preparationDoneOrders: preparationDoneOrders.rows[0].total,
            dispatchedOrders: dispatchedOrders.rows[0].total,
        };
    } catch {
        throw new ApolloError("Une erreur interne est survenue");
    }
}

module.exports = {
    Query: {
        getNonClosedOrders,
        getOrdersWithStatus,
        getOrder,
        getOrdersResume
    },
    Mutation: {
        createOrder,
        updateOrderStatus,
    },
    Order: {
        product: getOrderProducts,
    }
}