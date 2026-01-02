import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { Readable } from 'stream';

class ElevenLabsHelper {
    private static instance: ElevenLabsHelper;
    client!: ElevenLabsClient;

    private constructor() {
        const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

        if (!ELEVENLABS_API_KEY) {
            throw new Error('Missing ELEVENLABS_API_KEY in environment variables');
        }

        this.client = new ElevenLabsClient({
            apiKey: ELEVENLABS_API_KEY,
        });
    }

    static getInstance(): ElevenLabsHelper {
        if (!ElevenLabsHelper.instance) {
            ElevenLabsHelper.instance = new ElevenLabsHelper();
        }
        return ElevenLabsHelper.instance;
    }

    async createAudioStreamFromText(text: string): Promise<Buffer> {

        const audioStream = await ElevenLabsHelper.instance.client.textToSpeech.stream('JBFqnCBsd6RMkjVDRZzb', {
            modelId: 'eleven_multilingual_v2',
            text,
            outputFormat: 'mp3_44100_128',
            // Optional voice settings that allow you to customize the output
            voiceSettings: {
                stability: 0,
                similarityBoost: 1.0,
                useSpeakerBoost: true,
                speed: 1.0,
            },
        });

        const chunks: Buffer[] = [];

        // Convert to Node.js Readable stream for async iteration
        // Type assertion needed due to Web Streams vs Node.js Streams type mismatch
        for await (const chunk of Readable.from(audioStream as unknown as AsyncIterable<Buffer>)) {
            chunks.push(chunk);
        }

        const content = Buffer.concat(chunks);
        return content;
    }
}

const elevenLabs = ElevenLabsHelper.getInstance();

export default elevenLabs;