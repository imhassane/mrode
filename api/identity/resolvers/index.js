const identity = require("./identity");
const member = require("./member");
const customer = require("./customer");
const mlm = require("./mlm");

module.exports = {
  Query: {
      ...identity.Query,
      ...member.Query,
      ...customer.Query,
      ...mlm.Query,
  },

  Mutation: {
      ...identity.Mutation,
      ...member.Mutation,
      ...customer.Mutation,
      ...mlm.Mutation,
  },
    MlmMember: {
      ...mlm.MlmMember,
    },

  Customer: {
      ...customer.Customer,
  },
  Order: {
      ...member.Order,
  }
};