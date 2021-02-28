const productsSells = require("./products-sells");

module.exports = {
    Query: {
        ...productsSells.Query,
    },
    Mutation: {
        ...productsSells.Mutation,
    }
}