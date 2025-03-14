import { ElevenLabsClient } from 'elevenlabs';
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

    async createAudioStreamFromText(text: string): Promise<Readable> {

        const audioStream = await ElevenLabsHelper.instance.client.textToSpeech.convert('JBFqnCBsd6RMkjVDRZzb', {
            model_id: 'eleven_multilingual_v2',
            text,
            output_format: 'mp3_44100_128',
            // Optional voice settings that allow you to customize the output
            voice_settings: {
                stability: 0,
                similarity_boost: 1.0,
                use_speaker_boost: true,
                speed: 1.0,
            },
        });

        return audioStream;
    };
}

const elevenLabs = ElevenLabsHelper.getInstance();

export default elevenLabs;