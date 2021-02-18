const order = require("./order");

module.exports = {
    Query: {
        ...order.Query,
    },
    Mutation: {
        ...order.Mutation,
    },
    Order: {
        ...order.Order,
    }
};