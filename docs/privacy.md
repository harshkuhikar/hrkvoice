# HRKVoice — Privacy Architecture & Policy

Privacy is a non-negotiable core foundation of HRKVoice.

---

## 1. Zero Raw Audio Retention

- **Memory-Only Audio Buffers**: Spoken audio recorded via the microphone is held exclusively in memory buffers during the transcription request.
- **Immediate Discard**: Once the transcription response is received, the audio buffer is zeroed out and garbage collected.
- **No Audio Disk Writing**: Raw `.wav` or `.webm` files are never written to permanent disk storage under normal operation.

---

## 2. Transcription History Controls

- **Optional Local History**: Users can disable history entirely under `Settings > Privacy & Context`.
- **Complete Deletion**: The Privacy Center provides a one-click "Purge All Data" button that completely clears all stored transcripts.
- **Export Formats**: Users can export their history anytime in JSON, CSV, or Plain Text format.

---

## 3. Context Awareness Privacy

- When Context Awareness is enabled, HRKVoice queries only the foreground window process name (e.g., `code.exe`, `slack.exe`) to select the appropriate writing mode.
- Window titles (which might contain document or website names) are only collected if the user explicitly turns on the "Collect Window Titles" toggle.
- Context data is never transmitted to analytics or third-party servers.

---

## 4. Telemetry

- Telemetry is **opt-in only**.
- When enabled, only product engagement metrics (e.g. `session_completed`, `mode_selected`) are counted. Private transcript text or audio recordings are NEVER included in telemetry payloads.
