import client, { Connection, Channel } from "amqplib";
import { randomUUID } from "crypto";

class RabbitMQConnection {
  private static instance: RabbitMQConnection;
  connection!: Connection;
  channel!: Channel;
  private connected!: Boolean;

  private constructor() {}

  static getInstance(): RabbitMQConnection {
    if (!RabbitMQConnection.instance) {
      RabbitMQConnection.instance = new RabbitMQConnection();
    }
    return RabbitMQConnection.instance;
  }

  async connect() {
    if (this.connected && this.channel) return;
    else this.connected = true;

    try {
      console.log(`⌛️ Connecting to Rabbit-MQ Server`);
      this.connection = await client.connect(
        `amqp://${process.env.RABBITMQ_HOST}:5672`
      );

      this.connection.on("close", () => {
        console.error(`❌ Rabbit MQ Connection closed.`);
        this.connected = false;
      });

      console.log(`✅ Rabbit MQ Connection is ready`);

      this.channel = await this.connection.createChannel();

      console.log(`🛸 Created RabbitMQ Channel successfully`);
    } catch (error) {
      console.error(error);
      console.error(`Not connected to MQ Server`);
    }
  }

  async sendToQueue(queue: string, message: string) {
    try {
      if (!this.connected) {
        await this.connect();
      }

      const replyQueue = await this.channel.assertQueue("", {
        exclusive: true,
      });

      const correlationId = randomUUID();

      this.channel.sendToQueue(queue, Buffer.from(message), {
        correlationId: correlationId,
        replyTo: replyQueue.queue,
      });

      // Consume responses from the temporary queue
      return new Promise<string>((resolve) => {
        this.channel.consume(replyQueue.queue, (msg) => {
          if (msg && msg.properties.correlationId === correlationId) {
            this.channel.ack(msg);
            resolve(msg.content.toString());
          }
        });
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

const rabbitMQConnection = RabbitMQConnection.getInstance();

export default rabbitMQConnection;
