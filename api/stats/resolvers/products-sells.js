const { ApolloError } = require("apollo-server");

const db = require("../db");
const moment = require("../moments");

const getProductSellsByPeriod = async (parent, args, ctx) => {
    try {
        const { rows } = await db.pool.query(db.q.GET_PRODUCTS_SELLS_BY_PERIOD, [
            args.start, args.end
        ]);

        let labels = [], ordersCount = [], itemsCount = [], ids = [];
        for(const r of rows) {
            labels.push(r.pro_name);
            ordersCount.push(r.total_orders);
            itemsCount.push(r.total_items);
            ids.push(r.pro_id);
        }

        return { labels, ordersCount, itemsCount, ids };
    } catch {
        throw new ApolloError(ctx.i18n.internalError);
    }
};

const getTrends = async (_parent, args) => {
    try {
        let startDate = new Date(args.start), endDate = new Date(args.end);

        const { rows } = await db.pool.query(db.q.GET_PRODUCTS_TRENDS, [
            args.period, args.start, args.end
        ]);

        const keys = [];
        const products = {};

        let format = "";
        args.period = args.period.toLowerCase();
        format = momentFormat(args.period);

        for (const r of rows) {
            r.period = moment(r.period).format(format);

            // On ajoute le nom du produit
            if(!keys.includes(r.pro_name)) {
                keys.push(r.pro_name);
                products[r.pro_name] = {
                    label: r.pro_name,
                    id: r.pro_id,
                    periods: [r.period],
                    data: [{ ordersCount: r.total_orders, itemsCount: r.total_items }]
                }
            } else {
                products[r.pro_name].periods.push(r.period);
                products[r.pro_name].data.push({ ordersCount: r.total_orders, itemsCount: r.total_items });
            }
        }
        const range = moment.range(startDate, endDate);
        let labels = [];
        const data = Object.keys(products).map(k => {
            let dataset = products[k];
            const periods = [];
            const data = [];
            // On met à jour les dates qui ne sont pas présentes.
            for(let d of range.by(args.period)) {
                const date = d.format(format);

                if(dataset.periods.includes(date)) {
                    const id = dataset.periods.indexOf(date);
                    data.push(dataset.data[id]);
                } else {
                    data.push({ ordersCount: 0, itemsCount: 0 });
                }

                periods.push(date);
            }
            if(!labels.length)
                labels = periods;

            return {...dataset, periods, data};
        });

        return { labels, datasets: data };
    } catch {
        throw new ApolloError(ctx.i18n.internalError)
    }
};

const getProductStats = async (_parent, args, ctx) => {
    try {
        if(!args.period)
            args.period = 'MONTH';

        const { rows, rowCount } = await db.pool.query(db.q.GET_PRODUCT_STATS,
            [args.period, args.start, args.end, args.product]
        );

        if(!rowCount)
            return { labels: [], datasets: [] };

        const productData = {};
        for (let r of rows) {
            const period = moment(r.period).format(momentFormat(args.period));
            const values = {ordersCount: r.total_orders, itemsCount: r.total_items};

            if(!productData.labels) {
                productData.labels = [period];
                productData.id = r.pro_id;
                productData.periods = [period];
                productData.data = [values];
            } else {
                productData.data.push(values)
            }
        }

        let dataset = {};
        const periods = [];
        const data = [];
        // On met à jour les dates qui ne sont pas présentes.
        for(let d of moment.range(args.start, args.end).by(args.period)) {
            const date = d.format(momentFormat(args.period));

            if(dataset.periods.includes(date)) {
                const id = dataset.periods.indexOf(date);
                data.push(dataset.data[id]);
            } else {
                data.push({ ordersCount: 0, itemsCount: 0 });
            }

            periods.push(date);
        }

        return {...dataset, periods, data, labels: periods};
    } catch {
        throw new ApolloError(ctx.i18n.internalError);
    }
};

const momentFormat = d => {
    let format = "";
    switch (d) {
        case "year":
            format = "YYYY"
            break;
        case "month":
            format = "YYYY-MMMM";
            break;
        case "week":
            format = "ww";
            break;
        case "day":
            format = "dddd";
            break;
        case "hour":
            format = "HH:mm";
            break;
    }
    return format;
}

const getProductsPercentage = async (_parent, args, ctx) => {
    try {
        let totalProducts = 0, totalItems = 0;
        const totalOrdersQuery = await db.pool.query(`
            select
                count(ord_id) as total_orders,
                sum(quantity) as total_items
            from tj_order_product
        `);
        if(!totalOrdersQuery.rowCount)
            return { labels: [], totalOrders: 0, totalItems: 0, datasets: { itemsCount: [], ordersCount: []} };

        totalProducts = totalOrdersQuery.rows[0].total_orders;
        totalItems = totalOrdersQuery.rows[0].total_items;

        const { rows, rowCount } = await db.pool.query(
            db.q.GET_PRODUCTS_PERCENTAGE,
            [args.start, args.end]
        );
        if(!rowCount) return { labels: [], totalOrders: 0, totalItems: 0, datasets: { itemsCount: [], ordersCount: []} };

        let itemsCount = [],
            ordersCount = [],
            labels = [];

        for(const r of rows) {
            itemsCount.push(r.total_items);
            ordersCount.push(Number.parseFloat((r.total_orders * 100) / totalProducts).toPrecision(3));
            labels.push(r.pro_name);
        }

        return {
            labels,
            totalItems,
            totalProducts,
            datasets: { itemsCount, ordersCount }
        }

    } catch {
        throw new ApolloError(ctx.i18n.internalError);
    }
}

module.exports = {
    Query: {
        getProductSellsByPeriod,
        getTrends,
        getProductsPercentage
    },
    Mutation: {

    }
}