import express, { Express } from 'express';

export class HttpServer {
port : number;

    constructor(port: number = 80) {
        this.port = port;
    };

    CreateServer() : void {
    
        const app: Express  = express();
        const router = express.Router();

        router.use((_req, res, next) => {
            res.header('Access-Control-Allow-Methods', 'GET');
            next();
        });

        router.get('/health', (_req, res) => {
            const data = {
                uptime: process.uptime(),
                message: 'Ok',
                date: new Date(),
            };

            res.status(200).send(data);
        });

        app.use('/api/v1', router);

        app.listen(this.port, () => {
            console.log(`[server]: Server is running at http://localhost:${this.port}`);
        });
    }
}
