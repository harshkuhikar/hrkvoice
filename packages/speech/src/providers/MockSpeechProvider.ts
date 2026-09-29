/**
 * Mock & Offline Speech Provider for HRKVoice
 * Enables immediate local offline development, testing, and verified Demo Mode
 */

import { SpeechProvider, TranscribeOptions, TranscriptionResponse } from '../SpeechProvider';
import { SpeechProviderType, INDIAN_LANGUAGE_REGISTRY, getLanguageByCode } from '@hrkvoice/shared';

export class MockSpeechProvider implements SpeechProvider {
  public readonly id: SpeechProviderType = 'mock';
  public readonly displayName = 'Demo / Offline Engine';
  public readonly isLocal = true;

  private mockPhrases: Record<string, string[]> = {
    en: [
      'Hey um can you send Rahul the invoice actually not Rahul send it to Rohit tomorrow morning',
      'Please create a React component called UserProfileCard with Tailwind styling',
      'Meeting at five, no sorry six in the evening',
      'Hi team, just following up on the proposal. Can you send me the updated quotation by tomorrow?'
    ],
    hi: [
      'नमस्ते भाई कल क्लाइंट को वेबसाइट का डेमो सेंड कर देना एक्चुअली राहुल को नहीं रोहित को भेजना',
      'कल मुझे React प्रोजेक्ट का डिप्लॉयमेंट करना है और API टेस्ट करनी है',
      'कृपया कल सुबह 10 बजे तक नया कोटेशन तैयार करके सेंड कर दीजिए'
    ],
    gu: [
      'કાલે client ને website નો demo send કરજો અને React component ચેક કરજો',
      'કાલે ક્લાયન્ટને નવી દરખાસ્ત મોકલવાની છે, ના રોહિતને નહીં રાહુલને',
      'નવા ફીચર માટે TypeScript નો ઉપયોગ કરવામાં આવ્યો છે'
    ],
    bn: [
      'কালকে website deploy করতে হবে এবং API server টা চেক করে নিতে হবে',
      'নমস্কার, ক্লায়েন্টকে ইনভয়েসটি কাল সকাল দশটার মধ্যে পাঠিয়ে দেবেন'
    ],
    mr: [
      'उद्या team meeting मध्ये नवीन project चा demo द्यायचा आहे आणि API तपासणी करायची आहे'
    ],
    ta: [
      'நாளைக்கு client project demo ready பண்ணனும் மற்றும் React code review செய்ய வேண்டும்'
    ],
    te: [
      'రేపు client కి new feature demo ఇవ్వాలి మరియు Node.js backend verify చేయాలి'
    ]
  };

  public isConfigured(): boolean {
    return true; // Always available offline
  }

  public supportsLanguage(languageCode: string): boolean {
    if (!languageCode || languageCode === 'auto') return true;
    return !!INDIAN_LANGUAGE_REGISTRY[languageCode.toLowerCase()];
  }

  public async transcribe(
    audioData: Buffer | Uint8Array,
    options?: TranscribeOptions
  ): Promise<TranscriptionResponse> {
    const lang = options?.language && options.language !== 'auto' ? options.language.toLowerCase() : 'hi';
    const phrases = this.mockPhrases[lang] || this.mockPhrases['en'];
    const chosenPhrase = phrases[Math.floor(Math.random() * phrases.length)];

    // Simulate streaming partial tokens if callback provided
    if (options?.onPartialTranscript) {
      const words = chosenPhrase.split(' ');
      let current = '';
      for (let i = 0; i < words.length; i++) {
        current += (i > 0 ? ' ' : '') + words[i];
        options.onPartialTranscript(current);
        await new Promise((r) => setTimeout(r, 40));
      }
    } else {
      // Simulate realistic transcription latency
      await new Promise((r) => setTimeout(r, 220));
    }

    return {
      transcript: chosenPhrase,
      detectedLanguage: lang,
      confidence: 0.96,
      durationSeconds: 3.5,
      provider: 'mock',
      model: 'hrkvoice-offline-demo-v1',
      isStreaming: !!options?.onPartialTranscript
    };
  }

  public async testConnection(): Promise<{ success: boolean; message: string; latencyMs: number }> {
    const start = Date.now();
    await new Promise((r) => setTimeout(r, 10));
    return {
      success: true,
      message: 'Local Offline Engine is ready and operational.',
      latencyMs: Date.now() - start
    };
  }
}
