const fs = require("fs");
const path = require("path");

const category = fs.readFileSync(path.join(__dirname + "/category.graphql"));
const product = fs.readFileSync(path.join(__dirname + "/product.graphql"));
const gamme = fs.readFileSync(path.join(__dirname + "/gamme.graphql"));
const cover = fs.readFileSync(path.join(__dirname + "/cover.graphql"));
const schema = fs.readFileSync(path.join(__dirname + "/schemas.graphql"));

module.exports = `
    scalar DateTime
   
    ${cover}
    ${category}
    ${product}
    ${gamme}
    ${schema}
`;