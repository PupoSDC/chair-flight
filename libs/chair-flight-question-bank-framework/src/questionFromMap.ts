import { Question } from './types';
import { getRandomShuffler } from '@chair-flight/js-utils';

type Option = {
  key: string;
  value: string;
  why?: string;
};

export const questionFromMap = ({
  id,
  version,
  learningObjectives,
  questionKeyToValue,
  questionValueToKey,
  options,
  explanation,
  externalIds,
}: {
  id: string;
  version: number;
  learningObjectives: string[];
  questionKeyToValue: (key: string) => string;
  questionValueToKey: (value: string) => string;
  options: Option[];
  explanation: (key: string, options: Option[]) => string;
  externalIds: string[];
}): Question[] =>
  options.reduce<Question[]>((sum, option) => {
    const shuffle = getRandomShuffler(id);
    const wrongOptionsForKey = shuffle(options)
      .filter((opt) => opt.key !== option.key)
      .slice(0, 3)
      .map((opt, i) => ({
        id: `${id}-${i + 1}`,
        text: opt.value,
        correct: false as const,
        why: opt.why ?? `${opt.key} ==> ${opt.value}`,
      }));
    const wrongOptionsForValue = shuffle(options)
      .filter((opt) => opt.key !== option.key)
      .slice(0, 3)
      .map((opt, i) => ({
        id: `${id}-${i + 1}`,
        text: opt.key,
        correct: false as const,
        why: opt.why ?? `${opt.key} ==> ${opt.value}`,
      }));
    sum.push({
      id: id,
      version: version,
      variant: sum.length,
      question: questionKeyToValue(option.key),
      learningObjectives: learningObjectives,
      correct: `${id}-0`,
      options: [
        {
          id: `${id}-0`,
          text: option.value,
          correct: true as const,
          why: option.why ?? `${option.key} ==> ${option.value}`,
        },
        wrongOptionsForKey[0],
        wrongOptionsForKey[1],
        wrongOptionsForKey[2],
      ],
      explanation: explanation(option.key, options),
      annexes: [],
      externalIds,
    });
    sum.push({
      id: id,
      version: version,
      variant: sum.length,
      question: questionValueToKey(option.value),
      learningObjectives: learningObjectives,
      correct: `${id}-0`,
      options: [
        {
          id: `${id}-0`,
          text: option.key,
          correct: true as const,
          why: option.why ?? `${option.key} ==> ${option.value}`,
        },
        wrongOptionsForValue[0],
        wrongOptionsForValue[1],
        wrongOptionsForValue[2],
      ],
      explanation: explanation(option.key, options),
      annexes: [],
      externalIds,
    });

    return sum;
  }, []);
