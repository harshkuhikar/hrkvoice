import { describe, it, expect } from 'vitest';
import { SafeClipboardService } from '../../packages/utilities/src/clipboard';

describe('Text Insertion & Multilingual Clipboard Tests', () => {
  it('should preserve previous clipboard content after insertion action', async () => {
    let mockClipboardStorage = 'Original User Copied Password';

    const mockAdapter = {
      readText: () => mockClipboardStorage,
      writeText: (t: string) => { mockClipboardStorage = t; }
    };

    const service = new SafeClipboardService(mockAdapter);

    let pastedContent = '';
    const mockPasteAction = () => {
      pastedContent = mockAdapter.readText();
    };

    const result = await service.insertWithClipboardPreservation(
      'New dictated text from HRKVoice',
      mockPasteAction,
      50 // 50ms delay for fast test
    );

    expect(result.success).toBe(true);
    expect(pastedContent).toBe('New dictated text from HRKVoice');

    // Wait for restore delay
    await new Promise(r => setTimeout(r, 80));

    // Verify original clipboard content was restored!
    expect(mockAdapter.readText()).toBe('Original User Copied Password');
  });

  it('should verify Unicode integrity across all major Indian scripts (Section 27)', () => {
    const multilingualSamples = [
      { lang: 'English', text: 'Good morning, welcome to HRKVoice.' },
      { lang: 'Hindi', text: 'नमस्ते, राहुल को कल सुबह कोटेशन भेज दीजिए।' },
      { lang: 'Gujarati', text: 'કાલે ક્લાયન્ટને નવી દરખાસ્ત મોકલવાની છે.' },
      { lang: 'Bengali', text: 'আগামীকাল ক্লায়েন্টকে ইনভয়েস পাঠিয়ে দেবেন।' },
      { lang: 'Punjabi', text: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ, ਕੱਲ੍ਹ ਸਵੇਰੇ ਗਾਹਕ ਨੂੰ ਪ੍ਰਪੋਜ਼ਲ ਭੇਜ ਦਿਓ।' },
      { lang: 'Tamil', text: 'நாளை காலைக்குள் கிளையண்டிற்கு இன்வாய்ஸ் அனுப்பவும்.' },
      { lang: 'Telugu', text: 'రేపు ఉదయానికల్లా క్లయింట్‌కు కొటేషన్ పంపండి.' },
      { lang: 'Marathi', text: 'कृपया उद्या सकाळपर्यंत राहुलला नवीन कोटेशन पाठवा.' },
      { lang: 'Kannada', text: 'ದಯವಿಟ್ಟು ನಾಳೆ ಸಂಜೆಯೊಳಗೆ ಕ್ಲೈಂಟ್‌ಗೆ ಬಿಲ್ ಕಳುಹಿಸಿ.' },
      { lang: 'Malayalam', text: 'ദയവായി നാളെ രാവിലെയോടെ പുതിയ ഇൻവോയ്സ് അയക്കുക.' },
      { lang: 'Odia', text: 'ଦୟାକରି ଆସନ୍ତାକାଲି ସୁଦ୍ଧା ଗ୍ରାହକଙ୍କୁ ବିଲ୍ ପଠାନ୍ତୁ।' },
      { lang: 'Assamese', text: 'অনুগ্ৰহ কৰি কাইলৈ পুৱালৈকে ক্লায়েণ্টক নথি-পত্ৰ প্ৰেৰণ কৰক।' },
      { lang: 'Nepali', text: 'कृपया भोलि बिहानसम्म ग्राहकलाई नयाँ प्रस्ताव पठाउनुहोस्।' },
      { lang: 'Urdu', text: 'براہ کرم کل صبح تک کلائنٹ کو نیا کوٹیشن بھیج دیں۔' }
    ];

    for (const sample of multilingualSamples) {
      const isValid = SafeClipboardService.verifyUnicodeIntegrity(sample.text);
      expect(isValid).toBe(true);
      expect(sample.text.length).toBeGreaterThan(0);
    }
  });
});
