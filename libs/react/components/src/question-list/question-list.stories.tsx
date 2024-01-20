import { QuestionList } from "./question-list";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof QuestionList>;

export const Playground: Story = {};

const meta: Meta<typeof QuestionList> = {
  title: "Components/QuestionList",
  component: QuestionList,
  tags: ["autodocs"],
  args: {
    loading: false,
    error: false,
    forceMode: undefined,
    questions: [
      {
        id: "gdjhd",
        questionId: "26mpt",
        variantId: "gdjhd",
        text: "With bleed air supplied from the APU (APU bleed value open or same pack operation) the pack flow is  automatically selected to:\n\n- :white_check_mark: High\n- :x: Normal\n- :x: Low\n- :x: ECON",
        learningObjectives: [
          {
            name: "A320.01",
            href: "/modules/type/learning-objectives/A320.01",
          },
        ],
        externalIds: [],
        href: "/modules/type/questions/26mpt?variantId=gdjhd",
      },
      {
        id: "tsz4e",
        questionId: "tlxkb",
        variantId: "tsz4e",
        text: "The zone controller or the air conditioning system controllers (ACSC) optimize temperature by acting on  the?\n\n- :white_check_mark: Trim air valves\n- :x: Skin air valves\n- :x: Isolation valves\n- :x: Pack valves",
        learningObjectives: [
          {
            name: "A320.01",
            href: "/modules/type/learning-objectives/A320.01",
          },
        ],
        externalIds: [],
        href: "/modules/type/questions/tlxkb?variantId=tsz4e",
      },
      {
        id: "bjx1i",
        questionId: "8ai7y",
        variantId: "bjx1i",
        text: "What would cause an amber PACK FAULT light on the PACK pb-sw to illuminate?\n\n- :x: Pack outlet overheat\n- :x: Compressor outlet overheat\n- :x: Switch position disagreement in comparison to the pack flow control valve\n- :white_check_mark: All answers are correct",
        learningObjectives: [
          {
            name: "A320.01",
            href: "/modules/type/learning-objectives/A320.01",
          },
        ],
        externalIds: [],
        href: "/modules/type/questions/8ai7y?variantId=bjx1i",
      },
      {
        id: "g7gea",
        questionId: "yaqc4",
        variantId: "g7gea",
        text: "The two cabin pressure controllers receive signals from:\n\n- :x: ADIRS only\n- :x: ADIRS and FMGC only\n- :white_check_mark: ADIRS, FMGC, LGCIU and EIU\n- :x: ADIRS, FMGC and EIU only",
        learningObjectives: [
          {
            name: "A320.01",
            href: "/modules/type/learning-objectives/A320.01",
          },
        ],
        externalIds: [],
        href: "/modules/type/questions/yaqc4?variantId=g7gea",
      },
      {
        id: "7d7lv",
        questionId: "ns2wdk",
        variantId: "7d7lv",
        text: "Under what conditions should the pack flow controller on an A319 be set to HI?\n\n- :x: In cold conditions to achieve a higher cabin temperature range\n- :x: If the number of Passengers is below 115\n- :white_check_mark: For abnormal hot and humid conditions\n- :x: If the number of occupants is above 138",
        learningObjectives: [
          {
            name: "A320.01",
            href: "/modules/type/learning-objectives/A320.01",
          },
        ],
        externalIds: [],
        href: "/modules/type/questions/ns2wdk?variantId=7d7lv",
      },
      {
        id: "bfwrh",
        questionId: "ukrp6",
        variantId: "bfwrh",
        text: "With both the BLOWER and EXTRACT pushbutton switches in OVRD, what happens to the ventilation  system?\n\n- :x: The system goes into open configuration and the blower fan stops\n- :white_check_mark: The system goes into smoke configuration and the blower fan stops\n- :x: The system goes into open configuration and the extract fan stops\n- :x: The system goes into intermediate configuration and the extract fan stops",
        learningObjectives: [
          {
            name: "A320.01",
            href: "/modules/type/learning-objectives/A320.01",
          },
        ],
        externalIds: [],
        href: "/modules/type/questions/ukrp6?variantId=bfwrh",
      },
      {
        id: "g2udk",
        questionId: "k4cum",
        variantId: "g2udk",
        text: "The pack flow control valve closes automatically in case of:\n\n- :white_check_mark: Pack overheat, engine fire push button operation, engine start, ditching push button pressed\n- :x: Bleed valve failure, pack outlet pressure increase\n- :x: All Answers are correct\n- :x: Takeoff when takeoff power is set and the main landing gear struts are compressed",
        learningObjectives: [
          {
            name: "A320.01",
            href: "/modules/type/learning-objectives/A320.01",
          },
        ],
        externalIds: [],
        href: "/modules/type/questions/k4cum?variantId=g2udk",
      },
      {
        id: "hec5l",
        questionId: "6rpyu",
        variantId: "hec5l",
        text: "The cabin pressure during lift-off and at touchdown is ________ ambient pressure\n\n- :white_check_mark: Higher than\n- :x: Lower than\n- :x: Equal to\n- :x: Irrespective to",
        learningObjectives: [
          {
            name: "A320.01",
            href: "/modules/type/learning-objectives/A320.01",
          },
        ],
        externalIds: [],
        href: "/modules/type/questions/6rpyu?variantId=hec5l",
      },
      {
        id: "037r8",
        questionId: "qi743",
        variantId: "037r8",
        text: "Having manually set the LDG ELEV the cabin altitude is&hellip;\n\n- :x: Only controllable manually through the MAN V/S CTL\n- :white_check_mark: Still controlled automatically through the outflow valve\n- :x: Still controlled normally through the safety valve\n- :x: Only controllable manually through the LDG ELEV selector",
        learningObjectives: [
          {
            name: "A320.01",
            href: "/modules/type/learning-objectives/A320.01",
          },
        ],
        externalIds: [],
        href: "/modules/type/questions/qi743?variantId=037r8",
      },
      {
        id: "em1ms",
        questionId: "11tl3",
        variantId: "em1ms",
        text: "The PACK FLOW selector on an A320 is in LO position. Which statement is correct?\n\n- :x: The pack valve flow selection is 80%\n- :x: The pack flow can be automatically selected up to 100% when the cooling demand cannot be satisfied\n- :x: With APU bleed supply or single Pack operation, HI pack valve flow is automatically selected\n- :white_check_mark: All answers are correct",
        learningObjectives: [
          {
            name: "A320.01",
            href: "/modules/type/learning-objectives/A320.01",
          },
        ],
        externalIds: [],
        href: "/modules/type/questions/11tl3?variantId=em1ms",
      },
      {
        id: "t67q9",
        questionId: "9a944",
        variantId: "t67q9",
        text: "The RAM AIR INLET is powered via&hellip;\n\n- :x: AC BUS 1\n- :x: AC BUS 2\n- :white_check_mark: DC ESS BUS\n- :x: DC BUS 1",
        learningObjectives: [
          {
            name: "A320.01",
            href: "/modules/type/learning-objectives/A320.01",
          },
        ],
        externalIds: [],
        href: "/modules/type/questions/9a944?variantId=t67q9",
      },
      {
        id: "6dgpsi",
        questionId: "gqqbm",
        variantId: "6dgpsi",
        text: "The PACK FLOW controller is set to NORM and yet the ECAM display shows PACK FLOW to be high. How is  this possible?\n\n- :x: As the engines are not running the PACK FLOW indicators are at the position they were selected to at the last  shut down\n- :x: As no bleed air is available the PACK FLOW valves are spring loaded to the fully open position\n- :white_check_mark: HI flow is automatically selected regardless of PACK FLOW selector position because air is only being supplied  by the APU\n- :x: With cold outside air conditions the PACK FLOW is automatically increased to help increase the cabin  temperature",
        learningObjectives: [
          {
            name: "A320.01",
            href: "/modules/type/learning-objectives/A320.01",
          },
        ],
        externalIds: [],
        href: "/modules/type/questions/gqqbm?variantId=6dgpsi",
      },
      {
        id: "kfw5s",
        questionId: "fdodfi",
        variantId: "kfw5s",
        text: "Emergency evacuation checklist. Why do you have to check &Delta;p = 0 if MAN CAB PR has been used?\n\n- :white_check_mark: Because the outflow valve does not open automatically at touchdown\n- :x: To facilitate the opening of the cargo doors by fire brigad\n- :x: Because the safety valves are closed\n- :x: Because of an possible non indicated failure of the Residual Pressure Control Unit (RPCU)",
        learningObjectives: [
          {
            name: "A320.01",
            href: "/modules/type/learning-objectives/A320.01",
          },
        ],
        externalIds: [],
        href: "/modules/type/questions/fdodfi?variantId=kfw5s",
      },
      {
        id: "65xza",
        questionId: "e4fr1",
        variantId: "65xza",
        text: "When the BLOWER pb is on OVRD:\n\n- :x: The system goes to open circuit configuration\n- :white_check_mark: The system goes to closed circuit configuration\n- :x: The blower fan will continue to run\n- :x: The blower fan is de-energized for the remainder of the flight",
        learningObjectives: [
          {
            name: "A320.01",
            href: "/modules/type/learning-objectives/A320.01",
          },
        ],
        externalIds: [],
        href: "/modules/type/questions/e4fr1?variantId=65xza",
      },
      {
        id: "k216y",
        questionId: "kggt3",
        variantId: "k216y",
        text: "The avionics ventilation system is fully automatic. The normal operation configurations are:\n\n- :x: Open-circuit configuration, close-circuit configuration, smoke configuration\n- :x: Open-circuit configuration, close-circuit configuration\n- :white_check_mark: Open-circuit configuration, intermediate configuration, close-circuit configuration\n- :x: Open-circuit configuration, partially-open configuration, bypass-circuit configuration",
        learningObjectives: [
          {
            name: "A320.01",
            href: "/modules/type/learning-objectives/A320.01",
          },
        ],
        externalIds: [],
        href: "/modules/type/questions/kggt3?variantId=k216y",
      },
      {
        id: "459qv",
        questionId: "htb5m",
        variantId: "459qv",
        text: "The temperature of each aircraft zone is optimized by means of &hellip;?\n\n- :x: A hot air valve\n- :x: A zone control valve\n- :x: A pack valve\n- :white_check_mark: A trim air valve",
        learningObjectives: [
          {
            name: "A320.01",
            href: "/modules/type/learning-objectives/A320.01",
          },
        ],
        externalIds: [],
        href: "/modules/type/questions/htb5m?variantId=459qv",
      },
      {
        id: "76a26",
        questionId: "ggz8",
        variantId: "76a26",
        text: "The cabin pressurization system consists, among others, of:\n\n- :x: One outflow valve, one cabin pressure controller and two safety valves\n- :x: One outflow valve, two cabin pressure controllers and one safety valve\n- :white_check_mark: One outflow valve, two cabin pressure controllers and two safety valves\n- :x: Two outflow valves, one cabin pressure controller and two safety valves",
        learningObjectives: [
          {
            name: "A320.01",
            href: "/modules/type/learning-objectives/A320.01",
          },
        ],
        externalIds: [],
        href: "/modules/type/questions/ggz8?variantId=76a26",
      },
      {
        id: "fql2i",
        questionId: "ou9i2",
        variantId: "fql2i",
        text: "Which answer about the two zone controller or ACSC (Air Conditioning System Controller) of the air  conditioning system is correct?\n\n- :white_check_mark: Controller 1 regulates the cockpit temperature, controller 2 the temperature in the two cabin zones\n- :x: Controller 1 regulates the temperature in the two cabin zones, controller 2 the cockpit temperature\n- :x: Controller 1 regulates the cockpit temperature, controller 2 the temperature in the three cabin zones\n- :x: Controller 1 regulates the temperature in the the three cabin zones, controller 2 the cockpit temperature",
        learningObjectives: [
          {
            name: "A320.01",
            href: "/modules/type/learning-objectives/A320.01",
          },
        ],
        externalIds: [],
        href: "/modules/type/questions/ou9i2?variantId=fql2i",
      },
      {
        id: "buw18k",
        questionId: "4m7d0j",
        variantId: "buw18k",
        text: "The MODE SEL pb sw in MAN mode allows you to use the MAN V/S CTL in order to&hellip;\n\n- :x: Manually alter the air inlet valve setting\n- :x: Manually adjust the pack flow valve\n- :white_check_mark: Manually adjust the outflow valve\n- :x: Manually alter the pack outflow valve setting",
        learningObjectives: [
          {
            name: "A320.01",
            href: "/modules/type/learning-objectives/A320.01",
          },
        ],
        externalIds: [],
        href: "/modules/type/questions/4m7d0j?variantId=buw18k",
      },
      {
        id: "ozwn3",
        questionId: "dloyb",
        variantId: "ozwn3",
        text: "What is the limiting factor for opening the RAM AIR valve?\n\n- :x: Aircraft at or below 10&rsquo;000ft\n- :white_check_mark: Cabin differential pressure below 1 PSI\n- :x: Aircraft must be on ground\n- :x: Aircraft must be fully depressurized",
        learningObjectives: [
          {
            name: "A320.01",
            href: "/modules/type/learning-objectives/A320.01",
          },
        ],
        externalIds: [],
        href: "/modules/type/questions/dloyb?variantId=ozwn3",
      },
      {
        id: "290a1",
        questionId: "ygjsu",
        variantId: "290a1",
        text: "The ram air inlet flap of the air conditioning pack:\n\n- :x: Closes during takeoffwhen takeoff power is set and the main landing gear struts are compressed\n- :x: Opens during landing they closes as soon as the main landing gear struts are compressed, as long as speed is at  or above 70 knots\n- :x: It opens 20 seconds after the speed drops below 70 knot\n- :white_check_mark: All answers are correct",
        learningObjectives: [
          {
            name: "A320.01",
            href: "/modules/type/learning-objectives/A320.01",
          },
        ],
        externalIds: [],
        href: "/modules/type/questions/ygjsu?variantId=290a1",
      },
      {
        id: "rrgbd",
        questionId: "t5t1cj",
        variantId: "rrgbd",
        text: "The input of the QNH in the FMGS for the approach influences, among others&hellip;.\n\n- :x: The GS mini\n- :white_check_mark: The pressurization schedule of the CPC Cabin Pressure Controllers\n- :x: The pressurization schedule and the GS mini\n- :x: The BARO minimum for NON-PROC. Appr",
        learningObjectives: [
          {
            name: "A320.01",
            href: "/modules/type/learning-objectives/A320.01",
          },
        ],
        externalIds: [],
        href: "/modules/type/questions/t5t1cj?variantId=rrgbd",
      },
      {
        id: "55yct",
        questionId: "ze2ak",
        variantId: "55yct",
        text: "On ECAM CAB PRESS page, the outflow valve indicator changes to amber when the valve\n\n- :x: is fully closed\n- :white_check_mark: open more than 95% during flight\n- :x: is fully closed\n- :x: is in transit",
        learningObjectives: [
          {
            name: "A320.01",
            href: "/modules/type/learning-objectives/A320.01",
          },
        ],
        externalIds: [],
        href: "/modules/type/questions/ze2ak?variantId=55yct",
      },
      {
        id: "hi5df",
        questionId: "lcl4a",
        variantId: "hi5df",
        text: "What is the maximum negative differential pressure for the cabin:\n\n- :x: 0 PSI\n- :white_check_mark: - 1 PSI\n- :x: - 2 PSI\n- :x: + 1 PSI",
        learningObjectives: [
          {
            name: "A320.01",
            href: "/modules/type/learning-objectives/A320.01",
          },
        ],
        externalIds: [],
        href: "/modules/type/questions/lcl4a?variantId=hi5df",
      },
    ],
    sx: {
      height: "500px",
      overflow: "hidden",
    },
  },
  argTypes: {},
};

export default meta;
