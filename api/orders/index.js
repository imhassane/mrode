const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require('@apollo/federation');

const GraphqlDateTime = require('graphql-type-datetime');

const db = require('./db');

if(process.env.NODE_ENV !== 'PROD')
    require('dotenv').config();

const typeDefs = gql`${require("./schemas")}`;

const resolvers = {
    DateTime: GraphqlDateTime,
    ...require("./resolvers"),
};

const server = new ApolloServer({
    schema: buildFederatedSchema({ typeDefs, resolvers }),
    async context({ req }) {
        let user = null;
        if(req.headers.user) {
            try {
                const { rows } = await db.pool.query(db.queries.GET_USER_ID, [req.headers.user]);
                if(rows.length)
                    user = rows[0].mem_id;
            } catch {}
        }

        return {
            lang: req.headers.lang,
            user,
        }
    }
});

server.listen(process.env.PORT).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});