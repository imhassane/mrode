const fs = require("fs");
const path = require("path");

const identity = fs.readFileSync(path.join(__dirname + "/identity.graphql"));
const mlmMember = fs.readFileSync(path.join(__dirname + "/mlm.graphql"));
const member = fs.readFileSync(path.join(__dirname + "/member.graphql"));
const customer = fs.readFileSync(path.join(__dirname + "/customer.graphql"));
const schemas = fs.readFileSync(path.join(__dirname + "/schemas.graphql"));

module.exports = `
    scalar DateTime
    
    ${identity}
    ${member}
    ${mlmMember}
    ${customer}
    
    ${schemas}
`;