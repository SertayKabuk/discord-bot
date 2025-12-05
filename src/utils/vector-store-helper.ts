// import {
//   PGVectorStore,
//   DistanceStrategy,
//   PGVectorStoreArgs,
// } from "@langchain/community/vectorstores/pgvector";

// import { OllamaEmbeddings } from "@langchain/ollama";
// import { PoolConfig } from "pg";
// class VectorStoreHelper {
//   private static instance: VectorStoreHelper;
//   youtube_vectorStore!: PGVectorStore;
//   x_vectorStore!: PGVectorStore;

//   private constructor() {}

//   static getInstance(): VectorStoreHelper {
//     if (!VectorStoreHelper.instance) {
//       VectorStoreHelper.instance = new VectorStoreHelper();
//     }
//     return VectorStoreHelper.instance;
//   }

//   async init() {
//     const config: PGVectorStoreArgs = {
//       postgresConnectionOptions: {
//         type: "postgres",
//         host: process.env.DB_HOST,
//         port: process.env.DB_PORT,
//         user: process.env.DB_USER,
//         password: process.env.DB_PASSWORD,
//         database: process.env.DB_NAME,
//       } as PoolConfig,
//       tableName: "vector_store",
//       collectionTableName: "vector_store_collection",
//       collectionName: "youtube",
//       columns: {
//         idColumnName: "id",
//         vectorColumnName: "vector",
//         contentColumnName: "content",
//         metadataColumnName: "metadata",
//       },
//       // supported distance strategies: cosine (default), innerProduct, or euclidean
//       distanceStrategy: "cosine" as DistanceStrategy,
//     };

//     const embeddings = new OllamaEmbeddings({
//       model: "mxbai-embed-large",
//       baseUrl: process.env.OLLAMA_URL,
//     });

//     this.youtube_vectorStore = await PGVectorStore.initialize(
//       embeddings,
//       config
//     );

//     //change config for x_vectorStore
//     config.collectionName = "x";

//     this.x_vectorStore = await PGVectorStore.initialize(embeddings, config);
//   }

//   async addDocument(
//     id: string,
//     externalId: string,
//     content: string,
//     source: string
//   ) {
//     if (content.length > 0) {
//       const document = {
//         pageContent: content,
//         metadata: { source: source, externalId: externalId },
//       };

//       await this.x_vectorStore.addDocuments([document], { ids: [id] });
//     }
//   }
// }

// const vectorStoreHelper = VectorStoreHelper.getInstance();

// export default vectorStoreHelper;
