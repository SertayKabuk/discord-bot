import { RequestHandler } from 'express';

export const validateApiKey: RequestHandler = (req, res, next) => {
    const apiKey = req.header('X-API-Key');
    
    if (!apiKey || apiKey !== process.env.API_KEY) {
        res.status(401).json({ error: 'Unauthorized - Invalid API Key' });
        return;
    }
    
    next();
};