import { formatNumberAsGroupedDigits } from "../../base/format-values.ts";
import { getRandomGenerator } from "../../base/get-random-generator.ts";
import { getRandomShuffler } from "../../base/get-random-shuffler.ts";
import { keepUnique } from "../../base/keep-unique.ts";
import { evaluateFormula } from "../calculation/evaluate-formula.ts";
import { fillTemplate } from "../calculation/fill-template.ts";

const MRJT_DEFAULT_VALUES: Record<string, number> = {
  adultMass: 84,
  childMass: 35,
  paxMale: 0,
  paxFemale: 0,
  paxChildren: 0,
  paxInfants: 0,
  baggage1: 0,
  baggage4: 0,
  cargo1: 0,
  cargo4: 0,
};

const MRJT_LABELS: Record<string, string> = {
  dryOperatingMass: "Dry Operating Mass",
  takeOffFuel: "Take-Off Fuel",
  tripFuel: "Trip Fuel",
  maxZeroFuelMass: "Maximum Zero Fuel Mass",
  maxTakeOffMass: "Maximum Take-Off Mass",
  maxLandingMass: "Maximum Landing Mass",
  adultMass: "standard adult mass",
  childMass: "standard child mass",
  paxMale: "males",
  paxFemale: "females",
  paxChildren: "children",
  paxInfants: "infants",
  baggage1: "baggage in hold 1",
  baggage4: "baggage in hold 4",
  cargo1: "cargo in hold 1",
  cargo4: "cargo in hold 4",
  operatingMass: "Operating Mass",
  allowedTakeOffMassA: "Allowed Take-Off Mass (a)",
  allowedTakeOffMassC: "Allowed Take-Off Mass (c)",
  allowedTakeOffMass: "Allowed Mass for Take-Off",
  allowedTrafficLoad: "Allowed Traffic Load",
  passengerMass: "Passenger Mass",
  distribution1: "Hold 1 load",
  distribution4: "Hold 4 load",
  holdTotal: "Total hold load",
  totalTrafficLoad: "Total Traffic Load",
  underload: "Underload",
  zeroFuelMass: "Zero Fuel Mass",
  takeOffMass: "Take-Off Mass",
  landingMass: "Landing Mass",
};

const MRJT_STEPS: {
  id: string;
  formula: string;
  mistakes: {
    formula: string;
    why: string;
  }[];
}[] = [
  {
    id: "operatingMass",
    formula: "dryOperatingMass + takeOffFuel",
    mistakes: [
      {
        formula: "dryOperatingMass + tripFuel",
        why: "Trip fuel was added instead of take-off fuel.",
      },
      {
        formula: "dryOperatingMass + takeOffFuel - tripFuel",
        why: "Trip fuel is not subtracted from the Operating Mass.",
      },
      {
        formula: "dryOperatingMass",
        why: "This is the Dry Operating Mass, without take-off fuel.",
      },
    ],
  },
  {
    id: "allowedTakeOffMassA",
    formula: "maxZeroFuelMass + takeOffFuel",
    mistakes: [
      {
        formula: "maxZeroFuelMass + tripFuel",
        why: "Trip fuel was added instead of take-off fuel.",
      },
      {
        formula: "maxZeroFuelMass",
        why: "Take-off fuel was not added to the zero fuel limit.",
      },
    ],
  },
  {
    id: "allowedTakeOffMassC",
    formula: "maxLandingMass + tripFuel",
    mistakes: [
      {
        formula: "maxLandingMass + takeOffFuel",
        why: "Take-off fuel was added instead of trip fuel.",
      },
      {
        formula: "maxLandingMass",
        why: "Trip fuel was not added to the landing limit.",
      },
    ],
  },
  {
    id: "allowedTakeOffMass",
    formula: "min(allowedTakeOffMassA, maxTakeOffMass, allowedTakeOffMassC)",
    mistakes: [
      {
        formula:
          "max(allowedTakeOffMassA, maxTakeOffMass, allowedTakeOffMassC)",
        why: "The highest of a, b and c was used instead of the lowest.",
      },
      {
        formula: "allowedTakeOffMassA",
        why: "Column a is not the lowest of a, b and c.",
      },
      {
        formula: "maxTakeOffMass",
        why: "Column b is not the lowest of a, b and c.",
      },
      {
        formula: "allowedTakeOffMassC",
        why: "Column c is not the lowest of a, b and c.",
      },
    ],
  },
  {
    id: "allowedTrafficLoad",
    formula: "allowedTakeOffMass - operatingMass",
    mistakes: [
      {
        formula: "allowedTakeOffMass - dryOperatingMass",
        why: "Take-off fuel was not included in the Operating Mass.",
      },
      {
        formula: "allowedTakeOffMassA - operatingMass",
        why: "Column a is not the lowest of a, b and c.",
      },
      {
        formula: "maxTakeOffMass - operatingMass",
        why: "Column b is not the lowest of a, b and c.",
      },
      {
        formula: "allowedTakeOffMassC - operatingMass",
        why: "Column c is not the lowest of a, b and c.",
      },
    ],
  },
  {
    id: "passengerMass",
    formula: "(paxMale + paxFemale) * adultMass + paxChildren * childMass",
    mistakes: [
      {
        formula: "(paxMale + paxFemale + paxChildren) * adultMass",
        why: "Children were counted at the adult standard mass.",
      },
      {
        formula: "(paxMale + paxFemale) * adultMass",
        why: "Children were left out.",
      },
    ],
  },
  {
    id: "distribution1",
    formula: "baggage1 + cargo1",
    mistakes: [],
  },
  {
    id: "distribution4",
    formula: "baggage4 + cargo4",
    mistakes: [],
  },
  {
    id: "holdTotal",
    formula: "distribution1 + distribution4",
    mistakes: [],
  },
  {
    id: "totalTrafficLoad",
    formula: "passengerMass + holdTotal",
    mistakes: [
      {
        formula: "passengerMass",
        why: "Baggage and cargo were left out.",
      },
      {
        formula: "passengerMass + distribution1",
        why: "The load in hold 4 was left out.",
      },
      {
        formula: "passengerMass + distribution4",
        why: "The load in hold 1 was left out.",
      },
    ],
  },
  {
    id: "underload",
    formula: "allowedTrafficLoad - totalTrafficLoad",
    mistakes: [
      {
        formula: "allowedTakeOffMassA - operatingMass - totalTrafficLoad",
        why: "Column a is not the lowest of a, b and c.",
      },
      {
        formula: "maxTakeOffMass - operatingMass - totalTrafficLoad",
        why: "Column b is not the lowest of a, b and c.",
      },
      {
        formula: "allowedTakeOffMassC - operatingMass - totalTrafficLoad",
        why: "Column c is not the lowest of a, b and c.",
      },
      {
        formula: "allowedTrafficLoad - passengerMass",
        why: "Baggage and cargo were left out of the traffic load.",
      },
    ],
  },
  {
    id: "zeroFuelMass",
    formula: "dryOperatingMass + totalTrafficLoad",
    mistakes: [
      {
        formula: "dryOperatingMass + passengerMass",
        why: "Baggage and cargo were left out of the traffic load.",
      },
      {
        formula: "dryOperatingMass + totalTrafficLoad + takeOffFuel",
        why: "This is the Take-Off Mass.",
      },
      {
        formula: "dryOperatingMass + totalTrafficLoad + takeOffFuel - tripFuel",
        why: "This is the Landing Mass.",
      },
    ],
  },
  {
    id: "takeOffMass",
    formula: "zeroFuelMass + takeOffFuel",
    mistakes: [
      {
        formula: "zeroFuelMass",
        why: "This is the Zero Fuel Mass.",
      },
      {
        formula: "zeroFuelMass + tripFuel",
        why: "Trip fuel was added instead of take-off fuel.",
      },
      {
        formula: "zeroFuelMass + takeOffFuel - tripFuel",
        why: "This is the Landing Mass.",
      },
    ],
  },
  {
    id: "landingMass",
    formula: "takeOffMass - tripFuel",
    mistakes: [
      {
        formula: "takeOffMass",
        why: "This is the Take-Off Mass.",
      },
      {
        formula: "takeOffMass - takeOffFuel",
        why: "This is the Zero Fuel Mass.",
      },
      {
        formula: "takeOffMass + tripFuel",
        why: "Trip fuel was added instead of subtracted.",
      },
    ],
  },
];

const IDENTIFIER_MATCH = /[A-Za-z_][A-Za-z0-9_]*/g;
const FORMULA_FUNCTION_NAMES = ["min", "max"];

const listRequiredStepIds = (id: string, knownIds: string[]): string[] => {
  if (knownIds.includes(id)) return [];
  const step = MRJT_STEPS.find((candidate) => candidate.id === id);
  if (!step) throw new Error(`Missing MRJT value "${id}"`);
  const dependencies = (step.formula.match(IDENTIFIER_MATCH) ?? []).filter(
    (name) => !FORMULA_FUNCTION_NAMES.includes(name),
  );
  return [
    ...dependencies.flatMap((name) => listRequiredStepIds(name, knownIds)),
    id,
  ];
};

const calculateMrjtLoadSheet = (
  presetValues: Record<string, number>,
  targetIds: string[],
) => {
  const knownValues = { ...MRJT_DEFAULT_VALUES, ...presetValues };
  const requiredStepIds = keepUnique(
    targetIds.flatMap((id) =>
      listRequiredStepIds(id, Object.keys(knownValues)),
    ),
  );
  const steps = MRJT_STEPS.filter(({ id }) => requiredStepIds.includes(id));
  const values = steps.reduce<Record<string, number>>(
    (calculated, { id, formula }) => {
      calculated[id] = evaluateFormula(formula, calculated);
      return calculated;
    },
    { ...knownValues },
  );
  return { values, steps };
};

const FIELD_COPIES: Record<string, string[]> = {
  maxZeroFuelMass: ["maxZeroFuelMassLimit"],
  maxTakeOffMass: ["maxTakeOffMassLimit"],
  maxLandingMass: ["maxLandingMassLimit"],
  passengerMass: ["distribution0"],
};
const FIELD_SUMS = [
  { id: "baggageTotal", partIds: ["baggage1", "baggage4"] },
  { id: "cargoTotal", partIds: ["cargo1", "cargo4"] },
];
const LOWEST_COLUMN_IDS = [
  "operatingMass",
  "allowedTrafficLoad",
  "totalTrafficLoad",
  "underload",
];
const FIELDLESS_IDS = ["allowedTakeOffMass", "adultMass", "childMass"];

const getMrjtAnnexFields = (values: Record<string, number>, ids: string[]) => {
  const lowestColumn = [
    { column: "A", mass: values.allowedTakeOffMassA },
    { column: "B", mass: values.maxTakeOffMass },
    { column: "C", mass: values.allowedTakeOffMassC },
  ].reduce((lowest, candidate) =>
    candidate.mass < lowest.mass ? candidate : lowest,
  ).column;
  const columnIds = ids.includes("allowedTakeOffMass") ? LOWEST_COLUMN_IDS : [];
  const fields = ids
    .filter((id) => !FIELDLESS_IDS.includes(id))
    .flatMap((id) => [
      { id, value: values[id] },
      ...(FIELD_COPIES[id] ?? []).map((copy) => ({
        id: copy,
        value: values[id],
      })),
      ...(columnIds.includes(id)
        ? [{ id: `${id}${lowestColumn}`, value: values[id] }]
        : []),
    ]);
  const sums = FIELD_SUMS.filter(({ partIds }) =>
    partIds.some((partId) => ids.includes(partId)),
  ).map(({ id, partIds }) => ({
    id,
    value: partIds.reduce((sum, partId) => sum + values[partId], 0),
  }));
  return Object.fromEntries(
    [...fields, ...sums].map(({ id, value }) => [
      id,
      String(Math.round(value)),
    ]),
  );
};

const FUNCTION_LABELS: Record<string, string> = {
  min: "lowest of ",
  max: "highest of ",
};

const getMrjtExplanation = (
  values: Record<string, number>,
  steps: {
    id: string;
    formula: string;
  }[],
) =>
  steps
    .map(({ id, formula }, position) => {
      const readable = formula.replaceAll("*", "×").replaceAll(" - ", " − ");
      const labelled = readable.replace(
        IDENTIFIER_MATCH,
        (name) => FUNCTION_LABELS[name] ?? MRJT_LABELS[name] ?? name,
      );
      const numbered = readable.replace(
        IDENTIFIER_MATCH,
        (name) =>
          FUNCTION_LABELS[name] ?? formatNumberAsGroupedDigits(values[name]),
      );
      const result = formatNumberAsGroupedDigits(values[id]);
      return [
        `${position + 1}. **${MRJT_LABELS[id] ?? id}**`,
        `= ${labelled}`,
        `= ${numbered}`,
        `= **${result} kg**`,
      ].join(" ");
    })
    .join("\n");

const MAX_WRONG_OPTIONS = 3;
const FALLBACK_OFFSETS = [-1000, 1000, -500, 500, -2000, 2000];

const evaluateMistake = (
  formula: string,
  presetValues: Record<string, number>,
) => {
  try {
    const targetIds = MRJT_STEPS.map(({ id }) => id).filter((id) =>
      formula.includes(id),
    );
    const { values } = calculateMrjtLoadSheet(presetValues, targetIds);
    return evaluateFormula(formula, values);
  } catch {
    return Number.NaN;
  }
};

export const getMultipleChoiceQuestionForVariantMrjt = (
  variant: {
    question: string;
    explanation: string;
    given: string[];
    answer: string;
    presets: {
      id: string;
      values: Record<string, number>;
    }[];
  },
  seed: string,
) => {
  const random = getRandomGenerator(seed);
  const shuffle = getRandomShuffler(seed);
  const preset = variant.presets[Math.floor(random() * variant.presets.length)];
  const mistakes =
    MRJT_STEPS.find(({ id }) => id === variant.answer)?.mistakes ?? [];
  const { values } = calculateMrjtLoadSheet(preset.values, [
    variant.answer,
    ...variant.given,
  ]);
  const givenValues = Object.fromEntries(
    variant.given.map((id) => [id, values[id]]),
  );
  const answerSteps = calculateMrjtLoadSheet(
    { ...preset.values, ...givenValues },
    [variant.answer],
  ).steps;
  const answerValue = values[variant.answer];
  const formatOption = (value: number) =>
    `${formatNumberAsGroupedDigits(value)} kg`;

  const wrongOptions = [
    ...shuffle(
      mistakes.map(({ formula, why }, position) => ({
        id: `mistake-${position}`,
        value: evaluateMistake(formula, preset.values),
        why,
      })),
    ),
    ...FALLBACK_OFFSETS.map((offset) => ({
      id: `offset-${offset}`,
      value: answerValue + offset,
      why: "",
    })),
  ]
    .filter(({ value }) => Number.isFinite(value) && value > 0)
    .filter(({ value }, position, all) => {
      const firstPosition = all.findIndex((other) => other.value === value);
      return value !== answerValue && firstPosition === position;
    })
    .slice(0, MAX_WRONG_OPTIONS);

  const fill = (text: string) =>
    fillTemplate(text, {
      values: {},
      results: values,
      decimals: 0,
      formatResult: formatNumberAsGroupedDigits,
    });
  const authorExplanation = fill(variant.explanation);

  return {
    question: fill(variant.question),
    explanation: [authorExplanation, getMrjtExplanation(values, answerSteps)]
      .filter(Boolean)
      .join("\n\n"),
    correctOptionId: "answer",
    options: shuffle([
      { id: "answer", text: formatOption(answerValue), why: "" },
      ...wrongOptions.map(({ id, value, why }) => ({
        id,
        text: formatOption(value),
        why,
      })),
    ]),
    annexFields: getMrjtAnnexFields(values, variant.given),
    explanationAnnexFields: getMrjtAnnexFields(values, [
      ...variant.given,
      ...Object.keys(preset.values),
      ...answerSteps.map(({ id }) => id),
    ]),
  };
};
