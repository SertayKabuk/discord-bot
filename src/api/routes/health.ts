import { Request, Response, Router } from 'express';

/**
 * @swagger
 * /health:
 *   get:
 *     tags:
 *       - System
 *     summary: Health check endpoint
 *     description: Returns the API's health status, uptime, and current server time
 *     responses:
 *       200:
 *         description: System is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uptime:
 *                   type: number
 *                   description: System uptime in seconds
 *                 message:
 *                   type: string
 *                   example: "Ok"
 *                 date:
 *                   type: string
 *                   format: date-time
 *                   description: Current server timestamp
 */
const router: Router = Router();

router.get('/', (_req: Request, res: Response) => {
    const data = {
        uptime: process.uptime(),
        message: 'Ok',
        date: new Date(),
    };
    res.status(200).send(data);
});

export default router;