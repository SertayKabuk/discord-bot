import express, { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import healthRoutes from './routes/health.js';
import discordRoutes from './routes/discord.js';
import swaggerjsdoc from 'swagger-jsdoc';
import { swaggerOptions } from './swaggerOptions.js';

export class APIServer {
    port: number;

    constructor(port: number = 80) {
        this.port = port;
    }

    CreateServer(): void {
        const app: Express = express();
        const router = express.Router();

        const swaggerDocs = swaggerjsdoc(swaggerOptions)
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

        // CORS middleware
        router.use((_req, res, next) => {
            res.header('Access-Control-Allow-Methods', 'GET');
            res.header('Access-Control-Allow-Headers', 'X-API-Key');
            next();
        });

        // Mount routes
        router.use('/health', healthRoutes);
        router.use('/discord', discordRoutes);

        // Apply base path
        app.use('/api/v1', router);

        app.listen(this.port, () => {
            console.log(`[server]: Server is running at http://localhost:${this.port}`);
            console.log(`[server]: API documentation available at http://localhost:${this.port}/api-docs`);
        });
    }
}
