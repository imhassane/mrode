const gamme = require("./gamme");
const category = require("./category");
const product = require("./product");

module.exports = {
  Query: {
    ...gamme.Query,
    ...category.Query,
    ...product.Query,
  },
  Mutation: {
    ...gamme.Mutation,
    ...category.Mutation,
    ...product.Mutation
  },
  Product: {
    ...product.Product,
  },
  Gamme: {
    ...gamme.Gamme,
  },
  Category: {
    ...category.Category
  },
  Order: {
    ...product.Order,
  }
};