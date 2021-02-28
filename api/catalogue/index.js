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

const i18n = require('./internationalization');

const server = new ApolloServer({
    schema: buildFederatedSchema({ typeDefs, resolvers }),
    context({ req }) {
        const mlmUser = req.headers.mlmuser ? parseInt(req.headers.mlmuser) : null;
        const context =  {
            lang: req.headers.lang,
            user: req.headers.user,
            i18n: i18n(req.headers.lang),
            mlmUser,
        };

        return context;
    }
});

server.listen(process.env.PORT).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});