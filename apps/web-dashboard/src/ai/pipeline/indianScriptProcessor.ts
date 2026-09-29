/**
 * Deep Native Indian Script & Multilingual Intelligence Processor for HRKVoice
 * Provides native script self-corrections, filler removal, currency parsing,
 * script detection, and phonetic transliteration for Gujarati, Hindi, and Indian regional languages.
 */

export interface IndianScriptResult {
  text: string;
  detectedScript: 'gujarati' | 'devanagari' | 'bengali' | 'tamil' | 'telugu' | 'kannada' | 'malayalam' | 'gurmukhi' | 'latin';
  selfCorrectionsCount: number;
  fillersCount: number;
  currencyFormattedCount: number;
}

// Native Gujarati Fillers
const GUJARATI_FILLERS = [
  'એટલે કે',
  'એટલે',
  'મતલબ કે',
  'મતલબ',
  'સાંભળો',
  'જુઓ',
  'જો ભાઈ',
  'જો',
  'ભાઈ',
  'યાર',
  'હં',
  'ઉં'
];

// Native Hindi Fillers
const HINDI_FILLERS = [
  'वह क्या बोलते हैं',
  'वो क्या बोलते हैं',
  'मतलब की',
  'मतलब',
  'यानी की',
  'यानी',
  'अरे भाई',
  'अरे यार',
  'अरे',
  'देखो',
  'सुनो',
  'समझे'
];

// Native Gujarati Digits to Arabic
const GUJARATI_DIGITS_MAP: Record<string, string> = {
  '૦': '0', '૧': '1', '૨': '2', '૩': '3', '૪': '4',
  '૫': '5', '૬': '6', '૭': '7', '૮': '8', '૯': '9'
};

// Native Hindi Digits to Arabic
const HINDI_DIGITS_MAP: Record<string, string> = {
  '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
  '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
};

function normalizeDigits(text: string): string {
  return text
    .replace(/[૦-૯]/g, (d) => GUJARATI_DIGITS_MAP[d] || d)
    .replace(/[०-९]/g, (d) => HINDI_DIGITS_MAP[d] || d);
}

export class IndianScriptProcessor {
  /**
   * Detect dominant script of input string
   */
  public static detectScript(text: string): IndianScriptResult['detectedScript'] {
    if (!text) return 'latin';
    if (/[\u0A80-\u0AFF]/.test(text)) return 'gujarati';
    if (/[\u0900-\u097F]/.test(text)) return 'devanagari';
    if (/[\u0980-\u09FF]/.test(text)) return 'bengali';
    if (/[\u0B80-\u0BFF]/.test(text)) return 'tamil';
    if (/[\u0C00-\u0C7F]/.test(text)) return 'telugu';
    if (/[\u0C80-\u0CFF]/.test(text)) return 'kannada';
    if (/[\u0D00-\u0D7F]/.test(text)) return 'malayalam';
    if (/[\u0A00-\u0A7F]/.test(text)) return 'gurmukhi';
    return 'latin';
  }

  /**
   * Deep Indian Language Cleaning & Formatting
   */
  public static process(text: string): IndianScriptResult {
    if (!text) {
      return {
        text: '',
        detectedScript: 'latin',
        selfCorrectionsCount: 0,
        fillersCount: 0,
        currencyFormattedCount: 0
      };
    }

    let current = text;
    const script = this.detectScript(current);
    let selfCorrectionsCount = 0;
    let fillersCount = 0;
    let currencyFormattedCount = 0;

    // 1. GUJARATI NATIVE PROCESSING
    if (script === 'gujarati') {
      // Self-corrections: "X નહીં Y" / "X ના Y" (e.g. "પાંચ વાગે નહીં છ વાગે" -> "છ વાગે")
      const gujRepairRegex = /([\u0A80-\u0AFF0-9a-zA-Z]+(?:\s+ને)?)[,\s]+(?:નહીં|નહિ|ના\s*સોરી|ના)[,\s]+([\u0A80-\u0AFF0-9a-zA-Z]+(?:\s+ને)?)/g;
      current = current.replace(gujRepairRegex, (_, wrong, right) => {
        selfCorrectionsCount++;
        return right;
      });

      // Fillers removal
      for (const filler of GUJARATI_FILLERS) {
        const regex = new RegExp(`(^|[\\s,])${filler}([\\s,]|$)`, 'g');
        if (regex.test(current)) {
          current = current.replace(regex, ' ');
          fillersCount++;
        }
      }

      // Currency Formatting (રૂપિયા / હજાર / લાખ / કરોડ)
      current = normalizeDigits(current);
      current = current.replace(/(\d+)\s*(?:હજાર)\s*(?:રૂપિયા)?/g, (_, num) => {
        currencyFormattedCount++;
        const val = parseInt(num, 10) * 1000;
        return `₹${val.toLocaleString('en-IN')}`;
      });
      current = current.replace(/(\d+)\s*(?:લાખ)\s*(?:રૂપિયા)?/g, (_, num) => {
        currencyFormattedCount++;
        return `₹${num},00,000`;
      });
      current = current.replace(/(\d+)\s*(?:કરોડ)\s*(?:રૂપિયા)?/g, (_, num) => {
        currencyFormattedCount++;
        return `₹${num},00,00,000`;
      });
      current = current.replace(/(\d+)\s*(?:રૂપિયા|રૂ\.)/g, (_, num) => {
        currencyFormattedCount++;
        return `₹${num}`;
      });
    }

    // 2. HINDI / DEVANAGARI NATIVE PROCESSING
    if (script === 'devanagari') {
      // Self-corrections: "X नहीं Y" / "X ना Y" (e.g. "राहुल को नहीं रोहित को" -> "रोहित को")
      const hiRepairRegex = /([\u0900-\u097F0-9a-zA-Z]+(?:\s+को)?)[,\s]+(?:नहीं|नहि|ना\s*सॉरी|ना)[,\s]+([\u0900-\u097F0-9a-zA-Z]+(?:\s+को)?)/g;
      current = current.replace(hiRepairRegex, (_, wrong, right) => {
        selfCorrectionsCount++;
        return right;
      });

      // Fillers removal
      for (const filler of HINDI_FILLERS) {
        const regex = new RegExp(`(^|[\\s,])${filler}([\\s,]|$)`, 'g');
        if (regex.test(current)) {
          current = current.replace(regex, ' ');
          fillersCount++;
        }
      }

      // Currency Formatting (रुपये / हजार / लाख / करोड़)
      current = normalizeDigits(current);
      current = current.replace(/(\d+)\s*(?:हजार)\s*(?:रुपये|रुपए)?/g, (_, num) => {
        currencyFormattedCount++;
        const val = parseInt(num, 10) * 1000;
        return `₹${val.toLocaleString('en-IN')}`;
      });
      current = current.replace(/(\d+)\s*(?:लाख)\s*(?:रुपये|रुपए)?/g, (_, num) => {
        currencyFormattedCount++;
        return `₹${num},00,000`;
      });
      current = current.replace(/(\d+)\s*(?:करोड़)\s*(?:रुपये|रुपए)?/g, (_, num) => {
        currencyFormattedCount++;
        return `₹${num},00,00,000`;
      });
      current = current.replace(/(\d+)\s*(?:रुपये|रुपए|रु\.)/g, (_, num) => {
        currencyFormattedCount++;
        return `₹${num}`;
      });
    }

    // 3. LATIN / HINGLISH CURRENCY & REPAIRS
    if (script === 'latin') {
      current = current.replace(/(\d+)\s*(?:thousand)\s*(?:rupees|rs\.?|inr)?/gi, (_, num) => {
        currencyFormattedCount++;
        const val = parseInt(num, 10) * 1000;
        return `₹${val.toLocaleString('en-IN')}`;
      });
      current = current.replace(/(\d+)\s*(?:lakh|lac|lakhs)\s*(?:rupees|rs\.?|inr)?/gi, (_, num) => {
        currencyFormattedCount++;
        return `₹${num},00,000`;
      });
      current = current.replace(/(\d+)\s*(?:crore|crores)\s*(?:rupees|rs\.?|inr)?/gi, (_, num) => {
        currencyFormattedCount++;
        return `₹${num},00,00,000`;
      });
      current = current.replace(/(\d+)\s*(?:rupees|rs\.?|inr)/gi, (_, num) => {
        currencyFormattedCount++;
        return `₹${num}`;
      });
    }

    // Clean multiple spaces
    current = current.replace(/\s{2,}/g, ' ').trim();

    return {
      text: current,
      detectedScript: script,
      selfCorrectionsCount,
      fillersCount,
      currencyFormattedCount
    };
  }

  /**
   * Fast Phonetic Transliteration from English (Hinglish/Gujlish) into Native Gujarati Script
   * Deterministic client-side engine with 0 external API calls
   */
  public static transliterateToGujarati(romanText: string): string {
    if (!romanText) return '';
    let t = romanText.toLowerCase();

    // High frequency common Gujarati words dictionary
    const dict: Record<string, string> = {
      'kem': 'કેમ',
      'cho': 'છો',
      'chho': 'છો',
      'bhai': 'ભાઈ',
      'aaje': 'આજે',
      'kale': 'કાલે',
      'pachi': 'પછી',
      'shu': 'શું',
      'karo': 'કરો',
      'chho?': 'છો?',
      'ha': 'હા',
      'na': 'ના',
      'nathi': 'નથી',
      'aavjo': 'આવજો',
      'namaste': 'નમસ્તે',
      'tamaro': 'તમારો',
      'maro': 'મારો',
      'tamare': 'તમારે',
      'mare': 'મારે',
      'hu': 'હું',
      'tame': 'તમે',
      'aapne': 'આપણે',
      'kaam': 'કામ',
      'project': 'Project',
      'client': 'Client',
      'website': 'Website',
      'demo': 'Demo',
      'component': 'Component',
      'send': 'Send',
      'check': 'Check',
      'meeting': 'Meeting',
      'invoice': 'Invoice',
      'quotation': 'Quotation',
      'rupya': 'રૂપિયા',
      'rupiya': 'રૂપિયા',
      'hajar': 'હજાર',
      'lakh': 'લાખ',
      'karod': 'કરોડ',
      'sarash': 'સરસ',
      'saras': 'સરસ',
      'abhar': 'આભાર',
      'dhanyawad': 'ધન્યવાદ',
      'dhanyavad': 'ધન્યવાદ'
    };

    const words = t.split(/\s+/);
    const converted = words.map(w => {
      const cleanW = w.replace(/[.,!?:;]/g, '');
      const punct = w.slice(cleanW.length);
      if (dict[cleanW]) {
        return dict[cleanW] + punct;
      }
      return w;
    });

    return converted.join(' ');
  }

  /**
   * Fast Phonetic Transliteration from English (Hinglish) into Native Devanagari Hindi Script
   */
  public static transliterateToHindi(romanText: string): string {
    if (!romanText) return '';
    let t = romanText.toLowerCase();

    const dict: Record<string, string> = {
      'namaste': 'नमस्ते',
      'kaise': 'कैसे',
      'ho': 'हो',
      'kya': 'क्या',
      'haal': 'हाल',
      'hai': 'है',
      'hain': 'हैं',
      'bhai': 'भाई',
      'aaj': 'आज',
      'kal': 'कल',
      'baad': 'बाद',
      'karo': 'करो',
      'karna': 'करना',
      'haan': 'हाँ',
      'ha': 'हाँ',
      'nahi': 'नहीं',
      'nahin': 'नहीं',
      'mera': 'मेरा',
      'aapka': 'आपका',
      'mujhe': 'मुझे',
      'aapko': 'आपको',
      'hum': 'हम',
      'main': 'मैं',
      'kaam': 'काम',
      'shukriya': 'शुक्रिया',
      'dhanyawad': 'धन्यवाद',
      'dhanyavad': 'धन्यवाद',
      'rupaye': 'रुपये',
      'hazar': 'हज़ार',
      'lakh': 'लाख',
      'crore': 'करोड़',
      'karod': 'करोड़'
    };

    const words = t.split(/\s+/);
    const converted = words.map(w => {
      const cleanW = w.replace(/[.,!?:;]/g, '');
      const punct = w.slice(cleanW.length);
      if (dict[cleanW]) {
        return dict[cleanW] + punct;
      }
      return w;
    });

    return converted.join(' ');
  }
}
