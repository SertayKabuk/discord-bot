import { Client as GraphQLClient, cacheExchange, fetchExchange } from "@urql/core";

class GraphQlHelper {
    client!: GraphQLClient;

    init() {
        this.client = new GraphQLClient({
            url: process.env.TARKOV_GRAPHQL_CLIENT,
            exchanges: [cacheExchange, fetchExchange],
        });

    }
}

const graphQLHelper = new GraphQlHelper();

export default graphQLHelper;