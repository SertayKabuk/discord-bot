import { Client as GraphQLClient, cacheExchange, fetchExchange } from "@urql/core";

class GraphQlHelper {
    client!: GraphQLClient;

    init(url:string) {
        this.client = new GraphQLClient({
            url: url,
            exchanges: [cacheExchange, fetchExchange],
        });

    }
}

const graphQLHelper = new GraphQlHelper();

export default graphQLHelper;