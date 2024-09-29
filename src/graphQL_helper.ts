import { Client as GraphQLClient, cacheExchange, fetchExchange } from "@urql/core";

class GraphQlHelper {
    private static instance: GraphQlHelper;
    client!: GraphQLClient;

    private constructor() {}

    static getInstance(): GraphQlHelper {
        if (!GraphQlHelper.instance) {
            GraphQlHelper.instance = new GraphQlHelper();
        }
        return GraphQlHelper.instance;
    }

    init(url:string) {
        this.client = new GraphQLClient({
            url: url,
            exchanges: [cacheExchange, fetchExchange],
        });

    }
}

const graphQLHelper = GraphQlHelper.getInstance();

export default graphQLHelper;