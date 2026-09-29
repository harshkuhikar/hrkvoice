import { HrkVoiceBridge } from '../../preload/preload';

declare global {
  interface Window {
    hrkVoice?: HrkVoiceBridge;
  }
}

export {};
