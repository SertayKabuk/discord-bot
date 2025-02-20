import { Request, Response, Router } from 'express';
import { validateApiKey } from '../middleware/auth.js';
import mongoHelper from '../../db/mongo-helper.js';
import { MongoCollectionNames } from '../../constants/mongo-collection-names.js';
import { PubgMatchResponse } from '../../utils/pubg-helper.js';

const router = Router();

router.get('/match-detail/filter/matchId/:matchId', validateApiKey, async (req: Request, res: Response) => {
    const { matchId } = req.params;

    if (!matchId) {
        res.status(400).json({ error: 'matchId is required' });
        return;
    }

    try {
        // Query MongoDB for matches with the specified matchId
        const match : PubgMatchResponse = await mongoHelper.findOne(MongoCollectionNames.MATCH_COLLECTION, { id: matchId });

        res.status(200).json(match);
    } catch (error) {
        console.error('Error fetching PUBG match details:', error);
        res.status(500).json({ error: 'Failed to fetch PUBG match details' });
    }
});

router.get('/matches/filter/playerName/:playerName/startDate/:startDate/endDate/:endDate', validateApiKey, async (req: Request, res: Response) => {
    const { playerName, startDate, endDate } = req.params;

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
        res.status(400).json({
            error: 'Invalid date format. Expected format: YYYY-MM-DDThh:mm:ss.sssZ (e.g. 2025-02-13T18:01:27.495Z)'
        });
        return;
    }

    try {
        // Query MongoDB for matches where this player participated within the date range
        const matches = mongoHelper.find(MongoCollectionNames.MATCH_COLLECTION,
            {
                "included": {
                    $elemMatch: {
                        "attributes.stats.name": playerName,
                    }
                },
                "data.attributes.createdAt": {
                    $gte: startDate,
                    $lte: endDate
                }
            },
            {
                sort: { "data.attributes.createdAt": -1 },
                projection: {
                    "data": 1,
                    "included.$": 1  // This will only return the matched element in the included array
                }
            }
        );

        const matchDataList: PubgMatchResponse[] = [];

        for await (const match of matches) {
            matchDataList.push(match);
        }

        res.status(200).json(matchDataList);
    } catch (error) {
        console.error('Error fetching PUBG match details:', error);
        res.status(500).json({ error: 'Failed to fetch PUBG match details' });
    }
});

export default router;