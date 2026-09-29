# HRKVoice — Speech Provider Architecture

HRKVoice provides an extensible multi-provider abstraction layer for speech-to-text transcription.

---

## 1. Provider Implementations

### 1.1 Groq Whisper (`GroqSpeechProvider`)
- **Model**: `whisper-large-v3` / `whisper-large-v3-turbo`
- **Latency**: Sub-400ms typical processing speed.
- **Indian Languages**: High accuracy on Hindi, Gujarati, Bengali, Tamil, Telugu, Marathi, Punjabi, and English.
- **Biasing**: Supports prompt-biasing with personal dictionary keywords.

### 1.2 OpenAI Whisper (`OpenAISpeechProvider`)
- **Model**: `whisper-1`
- **Capabilities**: Robust multilingual recognition, timestamps, verbose JSON response with confidence metrics.

### 1.3 Deepgram Nova-2 (`DeepgramSpeechProvider`)
- **Model**: `nova-2`
- **Capabilities**: Real-time streaming transcription, keyword boosting, smart formatting.

### 1.4 Google Cloud Speech-to-Text (`GoogleSpeechProvider`)
- **Model**: Cloud Speech v1/v2
- **Capabilities**: Broad regional dialect recognition with `hi-IN`, `gu-IN`, `bn-IN`, `ta-IN`, `te-IN`, `mr-IN`, etc.

### 1.5 Local / Offline Demo Provider (`MockSpeechProvider`)
- **Capabilities**: 100% offline, zero network dependencies, simulated streaming tokens, authentic regional sample phrases.

---

## 2. Dynamic Fallback Chain

When transcribing speech:
```
1. Verify Primary Provider API key & network connectivity.
2. Confirm language compatibility in Central Language Registry.
3. If error (e.g. 401 Invalid Key, 429 Rate Limit, or Network Timeout):
   -> Shift automatically to next active configured cloud provider.
4. If all remote services fail:
   -> Fall back seamlessly to Local Offline Engine.
```
