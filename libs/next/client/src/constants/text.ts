import { dedent } from "ts-dedent";

export const APP_NAME = "Chair Flight";
export const APP_DESC = dedent`
  Chair Flight is a community driven Aviation Question Bank built by students for students.
  Now available for Alpha testing. 
`;

export const FLASH_CARDS_DESC = dedent`
  Use these flash cards to practice for your interview. You can review
  all flash cards at once, or get 10 random cards to review. Try to
  answer the question outloud as you would in an interview. Consider
  recording your answer and playing it back to see how you sound.

  Once you are satisfied with the answer, Flip the card to see if you
  are close enough".
`;

export const BASE_URL =
  process.env["NEXT_PUBLIC_BASE_URL"] || "http://chair-flight.com";

export const SUBJECTS = [
  {
    id: "010",
    title: "Air Law",
    shortTile: "Air Law",
  },
  {
    id: "021",
    title: "Aircraft General Knowledge",
    shortTile: "AGK",
  },
  {
    id: "022",
    title: "Instrumentation",
    shortTile: "Instrumentation",
  },
  {
    id: "031",
    title: "Mass and Balance",
    shortTile: "Mass and Balance",
  },
  {
    id: "032",
    title: "Performance - Aeroplanes",
    shortTile: "Performance - Aeroplanes",
  },
  {
    id: "033",
    title: "Flight Planning and Monitoring",
    shortTile: "FPM",
  },
  {
    id: "034",
    title: "Performance - Helicopters",
    shortTile: "Performance - Helicopters",
  },
  {
    id: "040",
    title: "Human Performance and Limitations",
    shortTile: "HPL",
  },
  {
    id: "050",
    title: "Meteorology",
    shortTile: "Meteorology",
  },
  {
    id: "061",
    title: "General Navigation",
    shortTile: "GNAV",
  },
  {
    id: "062",
    title: "Radio Navigation",
    shortTile: "RNAV",
  },
  {
    id: "071", // TODO should be 0710"0
    title: "Operational Procedures",
    shortTile: "Ops",
  },
  {
    id: "081",
    title: "Principles of Flight - Aeroplanes",
    shortTile: "PoF - Aeroplanes",
  },
  {
    id: "082",
    title: "Principles of Flight - Helicopters",
    shortTile: "PoF - Helicopters",
  },
  {
    id: "090",
    title: "Communications",
    shortTile: "Communications",
  },
];
