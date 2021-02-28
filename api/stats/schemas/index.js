const fs = require("fs");
const  path = require("path");

const schemas = fs.readFileSync(path.join(__dirname + "/schemas.graphql"));

module.exports = `
    scalar DateTime
    
    ${schemas}
`;