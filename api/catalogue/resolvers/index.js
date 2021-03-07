const gamme = require("./gamme");
const category = require("./category");
const product = require("./product");
const formation = require("./formation");

module.exports = {
  Query: {
    ...gamme.Query,
    ...category.Query,
    ...product.Query,
    ...formation.Query,
  },
  Mutation: {
    ...gamme.Mutation,
    ...category.Mutation,
    ...product.Mutation,
    ...formation.Mutation,
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
  },
  Formation: {
    ...formation.Formation,
  },
  MlmMember: {
    ...formation.MlmMember,
  }
};