const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require('@apollo/federation');

const GraphqlDateTime = require('graphql-type-datetime');

if(process.env.NODE_ENV !== 'PROD')
    require('dotenv').config();

const typeDefs = gql`${require("./schemas")}`;

const resolvers = {
    DateTime: GraphqlDateTime,
    ...require("./resolvers"),
};

const server = new ApolloServer({
    schema: buildFederatedSchema({ typeDefs, resolvers }),
    context({ req }) {

    }
});

server.listen(process.env.PORT).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});