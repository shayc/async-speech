export const DEFAULT_PITCH = 1;
export const DEFAULT_RATE = 1;
export const DEFAULT_VOLUME = 1;
export const MAX_PITCH = 2;
export const MAX_RATE = 10;
export const MAX_VOLUME = 1;
export const MIN_PITCH = 0;
export const MIN_RATE = 0.1;
export const MIN_VOLUME = 0;

export function createAsyncSpeech(speechSynthesis: SpeechSynthesis) {
  function getVoices(): Promise<SpeechSynthesisVoice[]> {
    return new Promise((resolve) => {
      const voices = speechSynthesis.getVoices();

      if (voices.length) {
        resolve(voices);
      } else {
        speechSynthesis.onvoiceschanged = () => {
          const voices = speechSynthesis.getVoices();
          resolve(voices);
        };
      }
    });
  }

  function cancel(): void {
    speechSynthesis.cancel();
  }

  function pause(): void {
    speechSynthesis.pause();
  }

  function resume(): void {
    speechSynthesis.resume();
  }

  function speak(
    text: string,
    options: Omit<
      SpeechSynthesisUtterance,
      'addEventListener' | 'removeEventListener' | 'dispatchEvent'
    >
  ): Promise<SpeechSynthesisEvent> {
    return new Promise((resolve, reject) => {
      const utterance = new window.SpeechSynthesisUtterance(text);

      const eventHandlers: Partial<SpeechSynthesisUtterance> = {
        onend(event) {
          resolve(event);

          if (options.onend) {
            options.onend.call(utterance, event);
          }
        },
        onerror(event) {
          reject(event);

          if (options.onerror) {
            options.onerror.call(utterance, event);
          }
        },
        onboundary(event) {
          // let _event = { ...event };

          // // Polyfill 'charLength'
          // if (!('charLength' in event)) {
          //   const { charIndex, target } = event;
          //   const spaceIndex = target.text.indexOf(' ', charIndex);
          //   const charLength =
          //     (spaceIndex !== -1 ? spaceIndex : target.text.length) - charIndex;

          //   _event.charLength = charLength;
          // }

          if (options.onboundary) {
            options.onboundary.call(utterance, event);
          }
        },
      };

      Object.assign(utterance, options, eventHandlers);

      speechSynthesis.speak(utterance);
    });
  }

  const asyncSpeech = {
    cancel,
    getVoices,
    pause,
    resume,
    speak,
  };

  return asyncSpeech;
}
