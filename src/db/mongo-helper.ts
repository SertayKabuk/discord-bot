import * as mongoDB from "mongodb";

class MongoHelper {
  private static instance: MongoHelper;
  private client: mongoDB.MongoClient;
  private dbName: string = process.env.MONGO_DB_NAME;
  private isConnected: boolean = false;

  private constructor() {
    this.client = new mongoDB.MongoClient(process.env.MONGO_URL);
    console.log(`Initialized mongo client for database: ${this.dbName}`);
  }

  static getInstance(): MongoHelper {
    if (!MongoHelper.instance) {
      MongoHelper.instance = new MongoHelper();
    }
    return MongoHelper.instance;
  }

  async connect(): Promise<void> {
    if (this.isConnected) return;
    await this.client.connect();
    this.isConnected = true;
    console.log(
      `Successfully connected to mongo database: ${this.client.db(this.dbName).databaseName}`
    );
    return;
  }

  async ensureConnected(): Promise<void> {
    try {
      // Ping the database to verify the connection.
      await this.client.db(this.dbName).command({ ping: 1 });
    } catch (error) {
      console.warn("Active connection lost, reconnecting...");
      this.isConnected = false;
      await this.connect();
    }
  }

  // Updated to pass id explicitly as a parameter.
  async insertOne(collectionName: string, id: string, data: any): Promise<void> {
    await this.ensureConnected();
    await this.client
      .db(this.dbName)
      .collection(collectionName)
      .updateOne(
        { id: id }, // using passed id instead of data.id
        { $set: data },
        { upsert: true }
      );
  }

  async findOne(collectionName: string, query: mongoDB.Filter<mongoDB.BSON.Document>, options?: mongoDB.FindOptions): Promise<any> {
    await this.ensureConnected();
    return await this.client
      .db(this.dbName)
      .collection(collectionName)
      .findOne(query, options);
  }

  async *find(collectionName: string, query: mongoDB.Filter<mongoDB.BSON.Document>, options?: mongoDB.FindOptions): AsyncGenerator<any> {
    await this.ensureConnected();
    const cursor = this.client
      .db(this.dbName)
      .collection(collectionName)
      .find(query, options);

    for await (const doc of cursor) {
      yield doc;
    }
  }

  // Updated to accept an idField indicating which property to use for filtering.
  async insertMany(collectionName: string, idField: string, data: any[]): Promise<void> {
    await this.ensureConnected();
    const operations = data.map(doc => ({
      updateOne: {
        filter: { [idField]: doc[idField] },
        update: { $set: doc },
        upsert: true
      }
    }));
    await this.client
      .db(this.dbName)
      .collection(collectionName)
      .bulkWrite(operations);
  }
}

const mongoHelper = MongoHelper.getInstance();

export default mongoHelper;
