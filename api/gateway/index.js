const { ApolloServer } = require('apollo-server');
const { ApolloGateway, RemoteGraphQLDataSource } = require('@apollo/gateway');
const jwt = require("jsonwebtoken");

if (process.env.NODE_ENV !== 'PROD')
    require('dotenv').config();

const gateway = new ApolloGateway({
    serviceList: [
        { name: "identity", url: "http://localhost:4001" },
        { name: "catalogue", url: "http://localhost:4002" },
        { name: "orders", url: "http://localhost:4003" },
        { name: "stats", url: "http://localhost:4005"},
    ],
    buildService: ({url}) => new RemoteGraphQLDataSource({
        url,
        willSendRequest: ({request, context}) => {
            request.http.headers.set("lang", context.lang);
            request.http.headers.set("user", context.user);
            request.http.headers.set("mlmUser", `${context.mlmUser}`);
        }
    })
});

const context = async ({ req }) => {
    let context = {};
    let lang = req.headers.lang;
    let token = req.headers.authentication;

    if(!lang)
        lang = "fr";
    context = { ...context, user: null, mlmUser: null, lang };

    try {
        if(token) {
            let source = "";
            const tokens = token.split(" ");
            if(tokens.length === 1)
                token = tokens[0];
            else {
                source = tokens[0];
                token = tokens[1];
            }
            const decoded = await jwt.verify(token, process.env.JWT_SECRET);
            if(source === "mlm")
                context.mlmUser = decoded.sub;
            else
                context.user = decoded.sub;
        }
    } catch {}
    return context;
};

const server = new ApolloServer({
    gateway,
    context,
    subscriptions: false,
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});