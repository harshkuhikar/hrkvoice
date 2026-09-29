/**
 * Audio Processing Utilities for HRKVoice
 * Handles audio levels, RMS, and WAV format conversions
 */

export class AudioUtils {
  /**
   * Calculates Root Mean Square (RMS) volume and normalizes to [0, 1]
   */
  public static calculateRMS(samples: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < samples.length; i++) {
      sum += samples[i] * samples[i];
    }
    const rms = Math.sqrt(sum / samples.length);
    // Normalize to range 0.0 - 1.0 with a soft curve
    return Math.min(1.0, Math.max(0.0, rms * 4.5));
  }

  /**
   * Convert Float32 audio samples to 16-bit PCM WAV format
   */
  public static floatTo16BitPCM(samples: Float32Array): Int16Array {
    const output = new Int16Array(samples.length);
    for (let i = 0; i < samples.length; i++) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return output;
  }

  /**
   * Creates a valid WAV file header and returns Uint8Array
   */
  public static encodeWAV(
    samples: Float32Array,
    sampleRate = 16000,
    numChannels = 1
  ): Uint8Array {
    const pcm = this.floatTo16BitPCM(samples);
    const dataByteCount = pcm.length * 2;
    const buffer = new ArrayBuffer(44 + dataByteCount);
    const view = new DataView(buffer);

    // RIFF chunk descriptor
    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataByteCount, true);
    this.writeString(view, 8, 'WAVE');

    // fmt sub-chunk
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // SubChunk1Size (16 for PCM)
    view.setUint16(20, 1, true);  // AudioFormat (1 for PCM)
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * 2, true); // ByteRate
    view.setUint16(32, numChannels * 2, true); // BlockAlign
    view.setUint16(34, 16, true); // BitsPerSample

    // data sub-chunk
    this.writeString(view, 36, 'data');
    view.setUint32(40, dataByteCount, true);

    // Write PCM samples
    let offset = 44;
    for (let i = 0; i < pcm.length; i++, offset += 2) {
      view.setInt16(offset, pcm[i], true);
    }

    return new Uint8Array(buffer);
  }

  private static writeString(view: DataView, offset: number, string: string): void {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  /**
   * Converts Uint8Array to base64
   */
  public static bufferToBase64(buffer: Uint8Array): string {
    return Buffer.from(buffer).toString('base64');
  }
}
