const fs = require("fs");
const path = require("path");

const schemas = fs.readFileSync(path.join(__dirname + "/schemas.graphql"));
const order = fs.readFileSync(path.join(__dirname + "/order.graphql"));

module.exports = `
    scalar DateTime
    
    ${order}

    ${schemas}
`;