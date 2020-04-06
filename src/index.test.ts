import { createAsyncSpeech } from '.';

describe('async speech', () => {
  let speechSynthesisMock: Partial<SpeechSynthesis>;

  beforeEach(() => {
    speechSynthesisMock = {
      cancel: jest.fn(),
      getVoices: jest.fn(() => [{ lang: 'he-IL' } as SpeechSynthesisVoice]),
      pause: jest.fn(),
      resume: jest.fn(),
      speak: jest.fn(),
    };
  });

  it('should get voices', async () => {
    const { getVoices } = createAsyncSpeech(
      speechSynthesisMock as SpeechSynthesis
    );
    const voices = await getVoices();

    expect(voices).toEqual([{ lang: 'he-IL' }]);
  });

  it('should call cancel', () => {
    const { cancel } = createAsyncSpeech(
      speechSynthesisMock as SpeechSynthesis
    );

    cancel();

    expect(speechSynthesisMock.cancel).toHaveBeenCalled();
  });

  it('should call resume', () => {
    const { resume } = createAsyncSpeech(
      speechSynthesisMock as SpeechSynthesis
    );

    resume();

    expect(speechSynthesisMock.resume).toHaveBeenCalled();
  });

  it('should call pause', () => {
    const { pause } = createAsyncSpeech(speechSynthesisMock as SpeechSynthesis);

    pause();

    expect(speechSynthesisMock.pause).toHaveBeenCalled();
  });
});
