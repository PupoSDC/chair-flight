import type { Test } from "@chair-flight/core/question-bank";

export const testProgressMock: {
  tests: Record<string, Test>;
} = {
  tests: {
    "7FKTcy55": {
      id: "7FKTcy55",
      questionBank: "type",
      title: "B737 exam",
      status: "started",
      mode: "exam",
      currentQuestionIndex: 0,
      timeSpentInMs: 4002,
      durationInMs: 2400000,
      questions: [
        {
          questionId: "gXkMCwJo",
          templateId: "48roz",
          seed: "hHjzsdzu",
          type: "multiple-choice",
          question:
            "The amber fuel IMBAL alert will remain displayed until the imbalance is reduced to:-",
          annexes: [],
          correctOptionId: "xc3ka",
          options: [
            {
              id: "xc3ka",
              text: "91 kgs",
              why: "",
            },
            {
              id: "0g8od",
              text: "453 kgs",
              why: "",
            },
            {
              id: "w5k1m",
              text: "363 kgs",
              why: "",
            },
            {
              id: "86mdik",
              text: "726 kgs",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "0mVouNJs",
          templateId: "l0sw2",
          seed: "JG1Qj6xH",
          type: "multiple-choice",
          question:
            "The engines have both Overheat and Fire warnings, the APU, cargo holds and wheel well have ONLY Fire warnings.",
          annexes: [],
          correctOptionId: "true",
          options: [
            {
              id: "true",
              text: "True",

              why: "",
            },
            {
              id: "false",
              text: "False",

              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "5Z5ykVSI",
          templateId: "wlmtb",
          seed: "qH1HoPwh",
          type: "multiple-choice",
          question:
            "How many fire extinguisher bottles are fitted for the Cargo compartments?",
          annexes: [],
          correctOptionId: "3lrxj",
          options: [
            {
              id: "3lrxj",
              text: "1 fire extinguisher bottle, that can be selected to be discharged into either cargo hold.",
              why: "",
            },
            {
              id: "vvmdl",
              text: "1 fire extinguisher bottle that can only be discharged into forward cargo hold.",
              why: "",
            },
            {
              id: "6ry3",
              text: "2 fire extinguisher bottles, 1 rapid discharge bottle and one smaller slow discharge bottle.",
              why: "",
            },
            {
              id: "5zej2",
              text: "2 fire extinguisher bottles, one for forward cargo hold, and one for rear cargo hold.",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "Op5ggLVw",
          templateId: "de4vt",
          seed: "xeYfzOE5",
          type: "multiple-choice",
          question:
            "The amber annunciation &quot;INSTR SWITCH&quot; indicates what?",
          annexes: [],
          correctOptionId: "03kse",
          options: [
            {
              id: "zzxlji",
              text: "Captain's and First Officer's displays are using the same source of IRU data with the IRS switch selected to OFF.",
              why: "",
            },
            {
              id: "03kse",
              text: "The IRS switch on the Forward Overhead panel is not selected to NORMAL",
              why: "",
            },
            {
              id: "bu7kk",
              text: "Captain's and First Officer's displays are using separate sources of IRU data.",
              why: "",
            },
            {
              id: "6lb02",
              text: "The IRS switch on the Aft Overhead panel is not selected to NORMAL.",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "LMbQdpSd",
          templateId: "hxiga",
          seed: "A0RWfeEw",
          type: "multiple-choice",
          question:
            "Where on the FMC CDU are the GPS latitude and longitude displayed?",
          annexes: [],
          correctOptionId: "7tjb9",
          options: [
            {
              id: "kxdiy",
              text: "POS INIT page 1",
              why: "",
            },
            {
              id: "u0kdd",
              text: "INIT REF",
              why: "",
            },
            {
              id: "7tjb9",
              text: "POS REF page 2",
              why: "",
            },
            {
              id: "xa11u",
              text: "NAV DATA",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "EfVO2eVo",
          templateId: "crlab",
          seed: "YlHvqz5K",
          type: "multiple-choice",
          question:
            "The flap slat electronic unit (FSEU) will close the trailing edge bypass valve if it detects trailing edge flap asymmetry, skew or uncommanded motion; thus stopping the movement of the flaps via the normal system.  However, the flaps can still be moved by means of electric motors.",
          annexes: [],
          correctOptionId: "true",
          options: [
            {
              id: "true",
              text: "True",

              why: "",
            },
            {
              id: "false",
              text: "False",

              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "SyFR5KnK",
          templateId: "02rxd",
          seed: "NgkYwuni",
          type: "multiple-choice",
          question:
            "What colour is the route on the Nav display when you activate a route by pressing the R6 switch?",
          annexes: [],
          correctOptionId: "qen4z",
          options: [
            {
              id: "gjg2d",
              text: "Dashed Magenta",
              why: "",
            },
            {
              id: "xgz7w",
              text: "Magenta.",
              why: "",
            },
            {
              id: "qen4z",
              text: "Dashed Cyan",
              why: "",
            },
            {
              id: "9af3d",
              text: "White",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "n3yK9wrd",
          templateId: "gzp14",
          seed: "9H9zYRzM",
          type: "multiple-choice",
          question:
            "When GRD is selected and the eng start switch is selected to either 1 or 2, how are the crew alerted to the start valve opening?",
          annexes: [],
          correctOptionId: "3oh2y",
          options: [
            {
              id: "572ir",
              text: "An amber START VALVE OPEN alert is displayed on the lower DU.",
              why: "",
            },
            {
              id: "2t7w6",
              text: "The blue START VALVE light illuminates bright blue then goes dim blue once the start valve is fully open.",
              why: "",
            },
            {
              id: "5id1e",
              text: "The only indication is the N2 gauge increasing to Max Motoring (25%).",
              why: "",
            },
            {
              id: "3oh2y",
              text: "A START VALVE OPEN alert is displayed on the upper DU.",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "yExSK91U",
          templateId: "65w58",
          seed: "Bs7aNYD9",
          type: "multiple-choice",
          question:
            "The Engine Fire DISCH switches are mechanically locked in the Down position and can only be pulled Up when an Overheat or Fire is detected and the switch has illuminated.",
          annexes: [],
          correctOptionId: "false",
          options: [
            {
              id: "true",
              text: "True",

              why: "",
            },
            {
              id: "false",
              text: "False",

              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "3ZUqaghv",
          templateId: "4znt2",
          seed: "gwjNYeSq",
          type: "multiple-choice",
          question: "How can the Fire Warning Bell be silenced?",
          annexes: [],
          correctOptionId: "9acpi",
          options: [
            {
              id: "9acpi",
              text: "Pushing Master FIRE WARN light or pushing the BELL CUTOUT switch located on the Overheat/Fire Protection panel.",
              why: "",
            },
            {
              id: "jm79",
              text: "Pushing the Master FIRE WARN light, or pushing the bell mute button located next to the speaker on the flight deck ceiling.",
              why: "",
            },
            {
              id: "v0dwy",
              text: "Only by pushing the Master FIRE WARN light",
              why: "",
            },
            {
              id: "4qypt",
              text: "The fire warning bell is only silenced once the condition causing the Overheat or Fire warning has been removed.",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "14eQokIF",
          templateId: "u97g9",
          seed: "q6uD9Ead",
          type: "multiple-choice",
          question:
            "On later aircraft YW059 through YW164, what is the default Vertical Required Navigational Performance (VRNP) used by the FMC for oceanic, en route, and terminal phases of flight?",
          annexes: [],
          correctOptionId: "4dl7a",
          options: [
            {
              id: "4dl7a",
              text: "400 feet.",
              why: "",
            },
            {
              id: "ygdyel",
              text: "400 feet below, 250 feet above the aircraft planned altitude.",
              why: "",
            },
            {
              id: "v6k26",
              text: "250 feet below, 400 feet above the aircraft planned altitude.",
              why: "",
            },
            {
              id: "wr9gp",
              text: "250 feet.",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "LDOhQKKv",
          templateId: "d4tte",
          seed: "ZjbMdcNY",
          type: "multiple-choice",
          question: "What will cause the STBY RUDDER ON light to illuminate?",
          annexes: [],
          correctOptionId: "ll04d",
          options: [
            {
              id: "ll04d",
              text: "Standby rudder system is commanded on, either manually or automatically, to pressurise the standby rudder PCU.",
              why: "",
            },
            {
              id: "ouvuzh",
              text: "Only illuminated when the standby rudder system has been automatically commanded on - not illuminated when standby rudder system has been manually commanded on by selecting the FLT CONTROL switch to STBY RUD.",
              why: "",
            },
            {
              id: "zymsn",
              text: "Only illuminated when the standby rudder system has been manually commanded on by selecting a FLT CONTROL switch to STBY RUD - not illuminated when standby rudder system automatically commanded on.",
              why: "",
            },
            {
              id: "op46k",
              text: "Standby rudder system is commanded on, to pressurise the standby rudder PCU, by selecting YAW DAMPER switch to OFF.",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "EPT0QE7P",
          templateId: "jipos",
          seed: "RcpXb2Ai",
          type: "multiple-choice",
          question:
            "How does the Stall Identification system help the pilot identify and prevent further movement into a stalled condition?",
          annexes: [],
          correctOptionId: "dchh5l",
          options: [
            {
              id: "qw2ao",
              text: "The elevator feel shift module prevents the yaw damper from making any rudder movement, and the stick shaker activates.",
              why: "",
            },
            {
              id: "dchh5l",
              text: "Elevator Feel Shift Module increase, hydraulic system A pressure to the Elevator Feel and Centering Unit, significantly increasing the force required to move the control column rearwards to continue into a stalled condition.",
              why: "",
            },
            {
              id: "qxyem",
              text: "Elevator Feel Shift Module increase, hydraulic system A pressure to the Elevator Feel and Centering Unit, moving the elevator to provide at least 15 degrees of nose down pitch.",
              why: "",
            },
            {
              id: "gd664",
              text: "The yaw damper provides 2 degrees of rudder movement, and the speed trim system automatically pushes the control column forward to warn the pilot that a stall condition was being approached.",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "rKpxIC1X",
          templateId: "l3ecl",
          seed: "lBdn22w2",
          type: "multiple-choice",
          question:
            "On short field performance aircraft the leading edge slats do not move from the extended to the fully extended position until the Flap lever is moved beyond the Flap 25 position.",
          annexes: [],
          correctOptionId: "true",
          options: [
            {
              id: "true",
              text: "True",

              why: "",
            },
            {
              id: "false",
              text: "False",

              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "WwCS7wD0",
          templateId: "cuipf",
          seed: "Fw8OyDuR",
          type: "multiple-choice",
          question:
            "What happens to the speed brakes if the SPEED BRAKE lever is left in the DOWN position during landing.",
          annexes: [],
          correctOptionId: "05l1nl",
          options: [
            {
              id: "xpf5v",
              text: "The flight spoilers will deploy on landing if all other conditions are met, but ground spoilers will not deploy.",
              why: "",
            },
            {
              id: "wrovt",
              text: "The spoilers will not deploy regardless of all other required conditions being met.",
              why: "",
            },
            {
              id: "05l1nl",
              text: "The speed brake lever will automatically move to the up position and the spoilers will deploy as normal if all other required conditions are met.",
              why: "",
            },
            {
              id: "j4wsh",
              text: "The ground spoilers will deploy on landing if all other conditions are met, but flight spoilers will not deploy.",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "pR6hs0Mo",
          templateId: "u4itx",
          seed: "RHecQQ7W",
          type: "multiple-choice",
          question:
            "After the Centre Tank has emptied the auto shutoff logic stops the pumps, how do the pumps then function?",
          annexes: [],
          correctOptionId: "amkco",
          options: [
            {
              id: "amkco",
              text: "Switching the pumps to OFF and then back to ON recycles the auto shutoff logic and the pumps will again activate.",
              why: "",
            },
            {
              id: "qmy87",
              text: "The pumps will not funtion again until the Centre tank has been refueled above 453 kg.",
              why: "",
            },
            {
              id: "xoun2",
              text: "There is no shutoff logic, the pumps continue to run with the amber LOW PRESSURE light illuminated until the Flight Crew switch the pumps to OFF.",
              why: "",
            },
            {
              id: "ffvg1",
              text: "The pumps can be activated if necessary by tripping the auto shutoff circuit breaker on Panel P6-1 behind the First Officer.",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "9zU3VSDy",
          templateId: "lt4x1",
          seed: "T3NIqJQp",
          type: "multiple-choice",
          question:
            "A total of 99 numbered waypoints cannot be exceeded for any single route.",
          annexes: [],
          correctOptionId: "false",
          options: [
            {
              id: "true",
              text: "True",

              why: "",
            },
            {
              id: "false",
              text: "False",

              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "LLmlDhVJ",
          templateId: "ios1q",
          seed: "9xT4Ziw2",
          type: "multiple-choice",
          question:
            "On the PFD, what does the amber annunciation &quot;DISPLAYS CONTROL PANEL&quot; indicate?",
          annexes: [],
          correctOptionId: "9qe74",
          options: [
            {
              id: "1r3ov",
              text: "The Displays Source Control Panel on the side the annunciation is displayed has failed.",
              why: "",
            },
            {
              id: "tuwd9",
              text: "The Display Select Panel on the the side the annunciation is displayed has failed.",
              why: "",
            },
            {
              id: "9qe74",
              text: "The EFIS control panel on the side the annunciation is displayed has failed",
              why: "",
            },
            {
              id: "xj7fc",
              text: "The PFD the annunciation is displayed on has an error and information displayed may be erroneous.",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "sRjqQ5yK",
          templateId: "3xk9e",
          seed: "Y2NEAsZI",
          type: "multiple-choice",
          question:
            "The EGPWS contains a terrain database, which it uses for look-ahead terrain alerting.  Which of the following statements is correct for this terrain database?",
          annexes: [],
          correctOptionId: "yv539",
          options: [
            {
              id: "bc662i",
              text: "All EGPWS terrain databases account for man-made obstructions over 100 feet high, throughout the whole database area.",
              why: "",
            },
            {
              id: "k3e1pj",
              text: "All man-made obstructions are accounted for in the detailed areas of the EGPWS terrain database in areas close to major airports.",
              why: "",
            },
            {
              id: "yv539",
              text: "Man-made obstructions are not accounted for in all EGPWS terrain databases",
              why: "",
            },
            {
              id: "a3fw6",
              text: "All EGPWS terrain databases account for man-made obstructions over 100 feet high, in the more detailed areas of the database near major airports.",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "spCbCO9k",
          templateId: "htx1n",
          seed: "TO1NlUaT",
          type: "multiple-choice",
          question:
            "How is the engine fuel heated prior to entering the engine?",
          annexes: [],
          correctOptionId: "pfb1b",
          options: [
            {
              id: "bg8h3",
              text: "Engine fuel is not heated until it is burnt in the engine combustion chamber.",
              why: "",
            },
            {
              id: "unhw3",
              text: "Heated only by Kinetic energy imparted due to pressure increase passing through the 1st and 2nd stage engine fuel pumps.",
              why: "",
            },
            {
              id: "ujcxi",
              text: "Heated by passing through engine oil heat exhanger only.",
              why: "",
            },
            {
              id: "pfb1b",
              text: "Heated by passing through IDG oil heat exchanger and engine oil heat exchanger.",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "mzvposAY",
          templateId: "9gdph",
          seed: "fJyqYVrm",
          type: "multiple-choice",
          question:
            "The hydraulic system quantity is displayed on the upper DU by digital indication from 0 to 106%.",
          annexes: [],
          correctOptionId: "false",
          options: [
            {
              id: "true",
              text: "True",

              why: "",
            },
            {
              id: "false",
              text: "False",

              why: "",
            },
          ],
          explanation:
            "The hydraulic system quantity is displayed on the **lower DU** by digital indication from 0 to **106%.**",
        },
        {
          questionId: "5onSXuek",
          templateId: "0kr6kl",
          seed: "KslX9eKO",
          type: "multiple-choice",
          question:
            "If IRS alignment is lost in flight, the navigation mode becomes inoperative for the remainder of the flight.",
          annexes: [],
          correctOptionId: "true",
          options: [
            {
              id: "true",
              text: "True",

              why: "",
            },
            {
              id: "false",
              text: "False",

              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "QHnqtVQy",
          templateId: "4p3hh",
          seed: "RqmzcMU7",
          type: "multiple-choice",
          question:
            "Hydraulic System A powers which hydraulic system components?",
          annexes: [],
          correctOptionId: "n9uft",
          options: [
            {
              id: "ba7oo",
              text: "Alternate nose wheel steering, Alternate brakes and ground spoilers",
              why: "",
            },
            {
              id: "aq222",
              text: "Alternate nose wheel steering, Alternate brakes and ground spoilers",
              why: "",
            },
            {
              id: "7qha7",
              text: "Ground spoilers, trailing edge flaps and the power transfer unit (PTU)",
              why: "",
            },
            {
              id: "n9uft",
              text: "None of the other answers are correct",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "qmIV7IiN",
          templateId: "ocogh",
          seed: "gMGtx4g8",
          type: "multiple-choice",
          question:
            "What is the minimum distance required to make a turn away from an obstacle to the front of the aircraft?",
          annexes: [],
          correctOptionId: "f4s3",
          options: [
            {
              id: "f4s3",
              text: "7.4m",
              why: "",
            },
            {
              id: "fdf6e",
              text: "9.8m",
              why: "",
            },
            {
              id: "qqn1s",
              text: "5.4m",
              why: "",
            },
            {
              id: "rfw8pi",
              text: "12.5m",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "pZhVy1E7",
          templateId: "tyqsp",
          seed: "cynGMG5l",
          type: "multiple-choice",
          question:
            "On the navigation display, how is the display presented in VOR, Approach and Plan modes?",
          annexes: [],
          correctOptionId: "rjlrw",
          options: [
            {
              id: "rrvqfj",
              text: "VOR = heading up, Approach = true north up, Plan = heading up.",
              why: "",
            },
            {
              id: "74wyy",
              text: "VOR = true north up, Approach = heading up, Plan = heading up.",
              why: "",
            },
            {
              id: "rjlrw",
              text: "VOR = heading up, Approach = heading up, Plan = true north up.",
              why: "",
            },
            {
              id: "hcd2i",
              text: "VOR = true north up, Approach = true north up, Plan = heading up.",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "FlCAH5Dz",
          templateId: "aatbl",
          seed: "x9nahhB2",
          type: "multiple-choice",
          question:
            "How many fire extinguishers are located on the flight deck, what type of extinguisher are they and where are they located?",
          annexes: [],
          correctOptionId: "kdiq9",
          options: [
            {
              id: "kdiq9",
              text: "1 Chemical fire extinguisher, located behind the FO",
              why: "",
            },
            {
              id: "jqdsb",
              text: "1 Halon extinguisher located behind the FO, and 1 Water Glycol extinguisher located under the second observer's jump seat.",
              why: "",
            },
            {
              id: "5rzyk",
              text: "2 Halon fire extinguishers, 1 located behind the Captain's seat and 1 located behind the FO's seat.",
              why: "",
            },
            {
              id: "x9ycl",
              text: "1 Halon extinguisher located behind the FO, and 1 CO2 extinguisher located under the second observer's jump seat.",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "sDE782Za",
          templateId: "aehpc",
          seed: "d6ieM5mL",
          type: "multiple-choice",
          question:
            "In an emergency, the Emergency Lights and Forward Airstairs can be operated from the Aft Attendant's panel.",
          annexes: [],
          correctOptionId: "false",
          options: [
            {
              id: "true",
              text: "True",

              why: "",
            },
            {
              id: "false",
              text: "False",

              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "Y1ENlliH",
          templateId: "ke234",
          seed: "1YqBxx0y",
          type: "multiple-choice",
          question:
            "The flap slat electronic unit (FSEU) provides flap load relief for all aircraft from Flap 10 through to Flap 40.",
          annexes: [],
          correctOptionId: "false",
          options: [
            {
              id: "true",
              text: "True",

              why: "",
            },
            {
              id: "false",
              text: "False",

              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "kvWhMVNC",
          templateId: "cwwdo",
          seed: "jjGhcnTa",
          type: "multiple-choice",
          question:
            "After takeoff the autothrottle will remain in Throttle Hold (THR HLD) until 800 feet RA.",
          annexes: [],
          correctOptionId: "true",
          options: [
            {
              id: "true",
              text: "True",

              why: "",
            },
            {
              id: "false",
              text: "False",

              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "DSXfaNhe",
          templateId: "5upew",
          seed: "ZopA8dnv",
          type: "multiple-choice",
          question:
            "What is the flight crew maximum oxygen pressure for the first flight of the day?",
          annexes: [],
          correctOptionId: "iu3wy",
          options: [
            {
              id: "cjkwl",
              text: "1000 psi",
              why: "",
            },
            {
              id: "gk27g",
              text: "3000 psi",
              why: "",
            },
            {
              id: "b8tc4",
              text: "1100 psi",
              why: "",
            },
            {
              id: "iu3wy",
              text: "1850 psi",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "qss5OqfG",
          templateId: "ugl9l",
          seed: "Qc9gdFCR",
          type: "multiple-choice",
          question: "Why do we check that FLARE mode is armed at 500 feet RA?",
          annexes: [],
          correctOptionId: "9ybo7h",
          options: [
            {
              id: "83dn1",
              text: "To allow APP mode to be selected at this point if FLARE not armed.",
              why: "",
            },
            {
              id: "1hcnw",
              text: "To allow the second A/P to be engaged at this point.",
              why: "",
            },
            {
              id: "oqbq8",
              text: "To allow start of the flare manoeuvre at 350 feet RA.",
              why: "",
            },
            {
              id: "9ybo7h",
              text: "To be aware that A/P will disengage at 350 feet RA if not armed.",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "Ri20uUbk",
          templateId: "hga0uj",
          seed: "IaSjBZ70",
          type: "multiple-choice",
          question:
            "The yaw damper provides inputs to the rudder to provide which of the following, and what effect does it have on the rudder pedals?",
          annexes: [],
          correctOptionId: "yma9l",
          options: [
            {
              id: "yma9l",
              text: "Provides Gust Dampening, Dutch roll prevention and Turn coordination. The rudder pedals are not displaced by yaw damper operation.",
              why: "",
            },
            {
              id: "hcu2c",
              text: "Provides Gust Dampening and Turn coordination. The rudder pedals are not displaced by yaw damper operation.",
              why: "",
            },
            {
              id: "t5uzcg",
              text: "Provides Gust Dampening and Turn coordination. The rudder pedals move to match rudder movement for feedback to the pilot.",
              why: "",
            },
            {
              id: "o2upvi",
              text: "Provides Gust Dampening, Dutch roll prevention and Turn coordination. The rudder pedals are displaced by yaw damper operation to provide feedback to the pilot.",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "YKgN7QBZ",
          templateId: "x42t3f",
          seed: "7fey1Cww",
          type: "multiple-choice",
          question:
            "What is the effect on the Standby Hydraulic System, if there is a leak in system B?",
          annexes: [],
          correctOptionId: "wllro",
          options: [
            {
              id: "5s2u2g",
              text: "No effect as the standby system is supplied from system A.",
              why: "",
            },
            {
              id: "dedof",
              text: "The level in the standby system will also decrease as it is linked to system B.",
              why: "",
            },
            {
              id: "sjb06",
              text: "The standby system will decrease but only a limited amount due to the standpipe in system B reservoir.",
              why: "",
            },
            {
              id: "wllro",
              text: "No effect as the standby system has its own accumulator.",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "smBi5Jr1",
          templateId: "v3mqb",
          seed: "kp0qlki4",
          type: "multiple-choice",
          question:
            "The picture below shows that there is a fault in the left engine Overheat/Fire Detection Loops.  How would you determine which of the 2 loops had failed?",
          annexes: [],
          correctOptionId: "zfrgx",
          options: [
            {
              id: "6eein",
              text: "Move to FAULT/INOP - OVHT/FIRE switch to the central TEST position, then test one loop at a time using the OVHT DET switch selected first to A and then B.",
              why: "",
            },
            {
              id: "8iahn",
              text: "This indication only occurs when BOTH loops have failed.",
              why: "",
            },
            {
              id: "zfrgx",
              text: "Carry out the test again one loop at a time using the OVHT DET switch selected to A and then B.",
              why: "",
            },
            {
              id: "vlf76",
              text: "Carry out the test again with the switch selected to FAULT/INOP testing each loop individually with the OVHT DET switch at A then B.",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "kGX231nd",
          templateId: "sm1a1",
          seed: "WYXKgYiI",
          type: "multiple-choice",
          question:
            "If you engage Level Change by pressing the LVL CHG switch on the MCP and the green light illuminates, what other indications will occur as this mode engages?",
          annexes: [],
          correctOptionId: "m5wqf",
          options: [
            {
              id: "m5wqf",
              text: "Speed window opens to show target speed, MCP SPD annunciated for pitch mode, N1 or RETARD/ARM annunciated for thrust mode.",
              why: "",
            },
            {
              id: "80uwx",
              text: "Speed window blanks, MCP SPD annunciated for pitch mode, N1 or RETARD/ARM annunciated for thrust mode.",
              why: "",
            },
            {
              id: "tselk",
              text: "Speed window blanks, MCP SPD annunciated for pitch mode, N1 annunciated for thrust mode.",
              why: "",
            },
            {
              id: "js2x9",
              text: "Speed window opens to show target speed, MCP SPD annunciated for thrust mode, N1 annunciated for pitch mode.",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "MNxJ2ZOX",
          templateId: "pvpep",
          seed: "qh7RDV1w",
          type: "multiple-choice",
          question:
            "With a loss of system B pressure the standby system can be used to extend the leading and trailing edge devices, the leading edge devices cannot be retracted again once extended by the standby system, but the trailing edge flaps can be retracted by electric motors using the ALTERNATE FLAPS position switch, but no asymmetry or skew protection is then provided.",
          annexes: [],
          correctOptionId: "false",
          options: [
            {
              id: "true",
              text: "True",

              why: "",
            },
            {
              id: "false",
              text: "False",

              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "JhhLp18d",
          templateId: "mimbm",
          seed: "dHlJ6yzm",
          type: "multiple-choice",
          question: "What is the result if one pack fails in-flight?",
          annexes: [],
          correctOptionId: "f2r0k",
          options: [
            {
              id: "d9voal",
              text: "The remaining pack will be capable of maintaining pressurisation up to the aircraft maximum certified ceiling, and will attempt to produce an average temperature across all cabin zones.",
              why: "",
            },
            {
              id: "w6gy2",
              text: "The remaining pack will not operate in HIGH flow.",
              why: "",
            },
            {
              id: "i80jkf",
              text: "The remaining pack when selected to AUTO will be capable of maintaining pressurisation up to aircraft ceiling, only if all Zone Temperature Controllers are selected to OFF.",
              why: "",
            },
            {
              id: "f2r0k",
              text: "The remaining pack is capable of maintaining pressurisation and acceptable cabin temperatures up to 41,000 feet.",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "pZAOnZX7",
          templateId: "ti9yn",
          seed: "y1GaMiSP",
          type: "multiple-choice",
          question:
            "In flight, with Autopilot engaged in CMD B, which FCC controls the logic for the flight directors on the Captain's PFD.",
          annexes: [],
          correctOptionId: "29no2h",
          options: [
            {
              id: "mt1odf",
              text: "FCC A",
              why: "",
            },
            {
              id: "29no2h",
              text: "FCC B",
              why: "",
            },
            {
              id: "9ziis",
              text: "FMS B",
              why: "",
            },
            {
              id: "zf3mhj",
              text: "FMS A",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "ne81CUdG",
          templateId: "4twgn",
          seed: "FzocHZq8",
          type: "multiple-choice",
          question:
            "What is the indication of the Crossfeed VALVE OPEN Light when the CROSSFEED selector is positioned OPEN and the crossfeed valve is closed?",
          annexes: [],
          correctOptionId: "bdzgoi",
          options: [
            {
              id: "33t7c",
              text: "extinguished",
              why: "",
            },
            {
              id: "m9l4g",
              text: "illuminated dim blue",
              why: "",
            },
            {
              id: "aiwxk",
              text: "illuminated amber",
              why: "",
            },
            {
              id: "bdzgoi",
              text: "illuminated bright blue",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "wm8XIQYa",
          templateId: "h65mkj",
          seed: "QxWkVkOP",
          type: "multiple-choice",
          question: "How is fuel heated prior to reaching the engine?",
          annexes: [],
          correctOptionId: "cg97w",
          options: [
            {
              id: "ctqs0i",
              text: "The main engine oil cooler.",
              why: "",
            },
            {
              id: "cg97w",
              text: "The main engine oil cooler and the IDG oil cooler",
              why: "",
            },
            {
              id: "tkzgw",
              text: "The IDG oil cooler",
              why: "",
            },
            {
              id: "l5x3z",
              text: "An electrical fuel heater",
              why: "",
            },
          ],
          explanation: "",
        },
      ],
      createdAtEpochMs: 1706516972545,
      startedAtEpochMs: 1706516973558,
      finishedAtEpochMs: null,
    },
    nkshIIB1: {
      id: "nkshIIB1",
      questionBank: "type",
      title: "B737 study",
      status: "started",
      mode: "study",
      currentQuestionIndex: 0,
      timeSpentInMs: 4001,
      durationInMs: 2400000,
      questions: [
        {
          questionId: "4gHBJjoU",
          templateId: "np98dg",
          seed: "mFuSZSVz",
          type: "multiple-choice",
          question:
            "When operating the forward airstairs, with the external control, what position must the forward entry door be in?",
          annexes: [],
          correctOptionId: "00gy9",
          options: [
            {
              id: "3f2uf",
              text: "Must be partially open",
              why: "",
            },
            {
              id: "qp37z",
              text: "Must be fully open",
              why: "",
            },
            {
              id: "00gy9",
              text: "Can be in any position.",
              why: "",
            },
            {
              id: "quq3ik",
              text: "Must be fully closed",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "a4tAgJIi",
          templateId: "d7qw6",
          seed: "HpBDzGO5",
          type: "multiple-choice",
          question:
            "What effect will a leak in system B downstream of the EDP have on the Power Transfer Unit (PTU)?",
          annexes: [],
          correctOptionId: "1ou2",
          options: [
            {
              id: "1ou2",
              text: "It will continue to function if required due to oil in the system B reservoir below the standpipe level.",
              why: "",
            },
            {
              id: "t2nir",
              text: "It will function as normal as it is part of the standby system and powered by system A oil pressure.",
              why: "",
            },
            {
              id: "dsts7",
              text: "A leak in system B has no effect as the PTU only uses oil from system A to operate.",
              why: "",
            },
            {
              id: "to385",
              text: "It will cease to function as it requires oil from system B to operate.",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "HZNmiSyI",
          templateId: "8tjxg",
          seed: "nIeztBVw",
          type: "multiple-choice",
          question:
            "After starting the engine and it achieving Stabilised Idle (59% N2), a low oil pressure condition would be identified by the amber LOW OIL PRESSURE annunciation on the upper DU, and the Lower DU displaying OIL PRESS Pointer in the Amber band.",
          annexes: [],
          correctOptionId: "false",
          options: [
            {
              id: "true",
              text: "True",

              why: "",
            },
            {
              id: "false",
              text: "False",

              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "7iOTt2b0",
          templateId: "qo3yz",
          seed: "C0tsnjjt",
          type: "multiple-choice",
          question:
            "If all Temperature Selectors are positioned OFF, the pack controls will cause the packs to produce which fixed temperatures?",
          annexes: [],
          correctOptionId: "w3htk",
          options: [
            {
              id: "w3htk",
              text: "Left Pack, 24 degrees Centigrade.  Right Pack, 18 degrees Centigrade.",
              why: "",
            },
            {
              id: "oam9t",
              text: "Left Pack, 22 degrees Centigrade.  Right Pack, 20 degrees Centigrade.",
              why: "",
            },
            {
              id: "oqg73",
              text: "Left Pack, 20 degrees Centigrade.  Right Pack, 22 degrees Centigrade.",
              why: "",
            },
            {
              id: "vg19i",
              text: "Left Pack, 18 degrees Centigrade.  Right Pack, 24 degrees Centigrade.",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "sTi1PFFl",
          templateId: "1wc1d",
          seed: "okMunBq7",
          type: "multiple-choice",
          question:
            "Which Statements are correct?\n\n1) The A/T automatically disengages approximately 2 seconds after touchdown.\n\n2) Landing roll-out is executed automatically by the A/P.",
          annexes: [],
          correctOptionId: "MvFQgYLR",
          options: [
            {
              text: "One is incorrect, two is correct",

              why: "",
              id: "ppx5PqZc",
            },
            {
              text: "One is correct, two is incorrect",

              why: "",
              id: "MvFQgYLR",
            },
            {
              text: "One is incorrect, two is incorrect",

              why: "",
              id: "DY3a4pnP",
            },
            {
              text: "One is correct, two is correct",

              why: "",
              id: "U9iknTIf",
            },
          ],
          explanation:
            "- The A/T automatically disengages approximately 2 seconds after touchdown.\n- the A/P must be manually disengaged after touchdown. Landing roll-out is executed manually after disengaging the A/P.",
        },
        {
          questionId: "b3W12DS8",
          templateId: "8w2u1",
          seed: "lMRpNugd",
          type: "multiple-choice",
          question:
            "The DC standby Bus is powered from the batteries through the static Inverter.  Select one:",
          annexes: [],
          correctOptionId: "false",
          options: [
            {
              id: "true",
              text: "True",

              why: "",
            },
            {
              id: "false",
              text: "False",

              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "cZ1s3sab",
          templateId: "kkksb",
          seed: "oysh53fj",
          type: "multiple-choice",
          question:
            "The amber TR UNIT light illuminated while on the ground indicates if?",
          annexes: [],
          correctOptionId: "41jw4",
          options: [
            {
              id: "41jw4",
              text: "One TR has failed.",
              why: "",
            },
            {
              id: "scgr5",
              text: "All three TRs have failed.",
              why: "",
            },
            {
              id: "7gq6w",
              text: "TR1 has failed, or TR2 and TR3 have failed.",
              why: "",
            },
            {
              id: "qkd9u",
              text: "TR1 and TR2 have failed, or TR3 has failed.",
              why: "",
            },
          ],
          explanation:
            "In–flight, an amber TR UNIT light illuminates if TR1, or TR2 and TR3 has failed.\n\nOn the ground, any TR fault causes the light to illuminate",
        },
        {
          questionId: "ZzoJqh2P",
          templateId: "6dzq1k",
          seed: "vyEtHeMC",
          type: "multiple-choice",
          question:
            "The VOR/LOC mode must be armed before the second Autopilot can be selected during a duel channel autopilot approach.",
          annexes: [],
          correctOptionId: "false",
          options: [
            {
              id: "true",
              text: "True",

              why: "",
            },
            {
              id: "false",
              text: "False",

              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "EuXlhHD7",
          templateId: "5oxu3",
          seed: "7Z99UQ4k",
          type: "multiple-choice",
          question:
            "With VNAV engaged, pushing the SPD INTV switch has what effect?",
          annexes: [],
          correctOptionId: "b0ma3",
          options: [
            {
              id: "w20tt",
              text: "Current or next speed restriction deleted from FMC, IAS/MACH window opens up showing previous FMC target speed, and IAS/MACH selector can be used to set new desired speed.",
              why: "",
            },
            {
              id: "b0ma3",
              text: "IAS/MACH window opens up showing current FMC target speed, and IAS/MACH selector can be used to set new desired speed.",
              why: "",
            },
            {
              id: "x3m1gk",
              text: "IAS/MACH window blanks and next FMC speed restriction becomes active, magenta target speed displayed above speed tape on PFD.",
              why: "",
            },
            {
              id: "9a82u",
              text: "No effect, VNAV remains enagaged with the FMC controlling target speed.",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "UTvDR4Im",
          templateId: "hporp",
          seed: "0625DaqT",
          type: "multiple-choice",
          question: "The A/T is controlled by FCC A only.",
          annexes: [],
          correctOptionId: "true",
          options: [
            {
              id: "true",
              text: "True",

              why: "",
            },
            {
              id: "false",
              text: "False",

              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "T0OV4UQr",
          templateId: "1hjv6",
          seed: "yQH2im8K",
          type: "multiple-choice",
          question:
            "What does the TCAS Symbol that is a solid amber circle indicate?",
          annexes: [],
          correctOptionId: "lptqx",
          options: [
            {
              id: "bjw9yh",
              text: "Advises that the proximate traffic is descending at more than 500 fpm.",
              why: "",
            },
            {
              id: "lptqx",
              text: "Advises of traffic with potential impact in 40 seconds.",
              why: "",
            },
            {
              id: "qc0wf",
              text: "Results in aural alert of &quot;TRAFFIC, TRAFFIC&quot; when within 6nm with 1200 feet or less of vertical seperation of other traffic.",
              why: "",
            },
            {
              id: "ayzqg",
              text: "Advises of traffic with potential impact on 25 seconds.",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "ktUbiHTk",
          templateId: "3xk9e",
          seed: "FloT4PAt",
          type: "multiple-choice",
          question:
            "The EGPWS contains a terrain database, which it uses for look-ahead terrain alerting.  Which of the following statements is correct for this terrain database?",
          annexes: [],
          correctOptionId: "yv539",
          options: [
            {
              id: "a3fw6",
              text: "All EGPWS terrain databases account for man-made obstructions over 100 feet high, in the more detailed areas of the database near major airports.",
              why: "",
            },
            {
              id: "k3e1pj",
              text: "All man-made obstructions are accounted for in the detailed areas of the EGPWS terrain database in areas close to major airports.",
              why: "",
            },
            {
              id: "bc662i",
              text: "All EGPWS terrain databases account for man-made obstructions over 100 feet high, throughout the whole database area.",
              why: "",
            },
            {
              id: "yv539",
              text: "Man-made obstructions are not accounted for in all EGPWS terrain databases",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "aKPmOIyT",
          templateId: "jp1sw",
          seed: "nNDvYWsz",
          type: "multiple-choice",
          question: "Where is the potable water contents indicator located?",
          annexes: [],
          correctOptionId: "gdxil",
          options: [
            {
              id: "jrnwjk",
              text: "On the forward Attendant's panel",
              why: "",
            },
            {
              id: "qpvx6",
              text: "Gauge located in the Water System Service Panel blow the aft right entry door.",
              why: "",
            },
            {
              id: "0ocwp",
              text: "In the forward galley adjacent to the water heater.",
              why: "",
            },
            {
              id: "gdxil",
              text: "On the aft Attendant's panel.",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "RxilgEto",
          templateId: "4d3j1",
          seed: "ozleKN1G",
          type: "multiple-choice",
          question: "How many fuel measuring sticks are installed?",
          annexes: [],
          correctOptionId: "x9joek",
          options: [
            {
              id: "zzrzs",
              text: "6",
              why: "",
            },
            {
              id: "si6sah",
              text: "12",
              why: "",
            },
            {
              id: "mbq5g",
              text: "20",
              why: "",
            },
            {
              id: "x9joek",
              text: "16",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "sEzbuJL7",
          templateId: "i2hf",
          seed: "9Nga8ePh",
          type: "multiple-choice",
          question:
            "While airborne and with flaps retracted, if hydraulic System A or System B loose pressure does the Standby hydraulic system automatically activate?",
          annexes: [],
          correctOptionId: "npbqng",
          options: [
            {
              id: "npbqng",
              text: "No, automatic activation only occurs if either System A or System B loose pressure and flaps are extended.",
              why: "",
            },
            {
              id: "1263f",
              text: "Yes, failure of either System A or System B will cause automatic activation of the Standby hydraulic system.",
              why: "",
            },
            {
              id: "n2eh2",
              text: "Yes, but only if both System A and System B loose pressure.",
              why: "",
            },
            {
              id: "yot18",
              text: "No, automatic activation only occurs if both System A and System B loose pressure and flaps are extended.",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "CiV1fdBw",
          templateId: "d9okg",
          seed: "SMtMse0N",
          type: "multiple-choice",
          question:
            "Altitude alerting occurs when approaching or departing from the MCP selected altitude.  When is the altitude alerting system inhibited?",
          annexes: [],
          correctOptionId: "ksoz6g",
          options: [
            {
              id: "y39rk",
              text: "Leading edge flaps are extended to 25 or greater and the landing gear is extended.",
              why: "",
            },
            {
              id: "ksoz6g",
              text: "Glide slope is captured, or trailing edge flaps are extended to 25 or greater.",
              why: "",
            },
            {
              id: "gqt2a",
              text: "Leading edge flaps are extended to 25 or greater",
              why: "",
            },
            {
              id: "x46op",
              text: "Landing gear is down and locked.",
              why: "",
            },
          ],
          explanation:
            "Altitude alerting occurs when approaching or departing the MCP–selected altitude. Altitude alerting is inhibited when trailing edge flaps are extended to 25 or greater, or while G/S is captured.",
        },
        {
          questionId: "YMVFuNEe",
          templateId: "up3v9",
          seed: "6IpxUMpK",
          type: "multiple-choice",
          question:
            "The autopilot automatically disengages 2 seconds after touchdown.",
          annexes: [],
          correctOptionId: "false",
          options: [
            {
              id: "true",
              text: "True",

              why: "",
            },
            {
              id: "false",
              text: "False",

              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "BFG1OOF4",
          templateId: "2hmmt",
          seed: "Q7eX33jw",
          type: "multiple-choice",
          question: "What is the primary function of the recirculation fans?",
          annexes: [],
          correctOptionId: "sep8e",
          options: [
            {
              id: "67ux1",
              text: "To provide standby air conditioning if the packs fail.",
              why: "",
            },
            {
              id: "6jv2i",
              text: "Recirculate the air from the passenger cabin the provide heating for the forward cargo compartment",
              why: "",
            },
            {
              id: "1wdfz",
              text: "Recirculate cabin air to allow it to be filtered to remove contaminants as it passes through the recirculation fan HEPA filters.",
              why: "",
            },
            {
              id: "sep8e",
              text: "Reduce engine bleed air demand and load on the packs.",
              why: "",
            },
          ],
          explanation: "",
        },
        {
          questionId: "J3AnozMo",
          templateId: "9jghi",
          seed: "B5A0fAsO",
          type: "multiple-choice",
          question: "The purpose of the landing gear transfer unit is to:",
          annexes: [],
          correctOptionId: "9co2f",
          options: [
            {
              id: "9co2f",
              text: "Automatically use hydraulic system B for gear retraction if No 1 engine is lost and the landing gear lever is positioned up",
              why: "",
            },
            {
              id: "uafie7",
              text: "Automatically use hydraulic system B for landing gear retraction if hydraulic system A engine driven pump fails and the landing gear lever is positioned up",
              why: "",
            },
            {
              id: "665xz",
              text: "Allow the use of nose wheel steering in the event of hydraulic system A fails",
              why: "",
            },
            {
              id: "obpl2w",
              text: "Allow landing gear retraction if hydraulic system B is lost during takeoff",
              why: "",
            },
          ],
          explanation:
            "> ## Landing Gear Transfer Unit\n> \n> The purpose of the landing gear transfer unit is to supply the volume of hydraulic\n> fluid needed to raise the landing gear at the normal rate when system A\n> engine–driven pump volume is lost. The system B engine–driven pump supplies\n> the volume of hydraulic fluid needed to operate the landing gear transfer unit\n> when all of the following conditions exist:\n> - airborne\n> - No. 1 engine RPM drops below a limit value\n> - landing gear lever is positioned UP\n> - either main landing gear is not up and locked.",
        },
        {
          questionId: "e4a6OWID",
          templateId: "ndk37",
          seed: "arUEVJ43",
          type: "multiple-choice",
          question: "What will cause the A/T to disengage?",
          annexes: [],
          correctOptionId: "lcvbw",
          options: [
            {
              id: "6l3q6",
              text: "Immediately the left main landing gear is compressed, Push Either A/T Disengage switch and Move A/T ARM switch to OFF.",
              why: "",
            },
            {
              id: "lcvbw",
              text: "Move A/T ARM switch to OFF, Push Either A/T Disengage switch and An A/T system fault is detected",
              why: "",
            },
            {
              id: "r8fe9",
              text: "Push Either A/T Disengage switch and An A/T system fault is detected",
              why: "",
            },
            {
              id: "1agn9",
              text: "Push Either A/T Disengage switch and Move A/T ARM switch to OFF",
              why: "",
            },
          ],
          explanation: "",
        },
      ],
      createdAtEpochMs: 1706516987948,
      startedAtEpochMs: 1706516988724,
      finishedAtEpochMs: null,
    },
    djpJTiEx: {
      id: "djpJTiEx",
      questionBank: "type",
      title: "B737 study",
      status: "finished",
      mode: "study",
      currentQuestionIndex: 19,
      timeSpentInMs: 20500,
      durationInMs: 2400000,
      questions: [
        {
          questionId: "WcKocJ0R",
          templateId: "1yzxe",
          seed: "5M1xhQ4U",
          type: "multiple-choice",
          question: "What is the B737-800 wingspan when fitted with Winglets?",
          annexes: [],
          correctOptionId: "wuxwk",
          options: [
            {
              id: "bzfsf",
              text: "39.18m",
              why: "",
            },
            {
              id: "35l85",
              text: "37.57m",
              why: "",
            },
            {
              id: "wuxwk",
              text: "35.79m",
              why: "",
            },
            {
              id: "bzthf",
              text: "32.18m",
              why: "",
            },
          ],
          explanation: "",
          selectedOptionId: "35l85",
        },
        {
          questionId: "2mLn79lq",
          templateId: "tyqsp",
          seed: "Fx5stVRq",
          type: "multiple-choice",
          question:
            "On the navigation display, how is the display presented in VOR, Approach and Plan modes?",
          annexes: [],
          correctOptionId: "rjlrw",
          options: [
            {
              id: "rrvqfj",
              text: "VOR = heading up, Approach = true north up, Plan = heading up.",
              why: "",
            },
            {
              id: "hcd2i",
              text: "VOR = true north up, Approach = true north up, Plan = heading up.",
              why: "",
            },
            {
              id: "rjlrw",
              text: "VOR = heading up, Approach = heading up, Plan = true north up.",
              why: "",
            },
            {
              id: "74wyy",
              text: "VOR = true north up, Approach = heading up, Plan = heading up.",
              why: "",
            },
          ],
          explanation: "",
          selectedOptionId: "hcd2i",
        },
        {
          questionId: "BC3pTXWW",
          templateId: "sikec",
          seed: "W6vAaG5O",
          type: "multiple-choice",
          question:
            "When an Annunciator Panel is pressed, all lights on both panel initially illuminate.",
          annexes: [],
          correctOptionId: "true",
          options: [
            {
              id: "true",
              text: "True",

              why: "",
            },
            {
              id: "false",
              text: "False",

              why: "",
            },
          ],
          explanation: "",
          selectedOptionId: "false",
        },
        {
          questionId: "y9vyVlku",
          templateId: "zrgljl",
          seed: "WOv80DHc",
          type: "multiple-choice",
          question:
            "When setting up the FMC, what Pre-flight information is required.",
          annexes: [],
          correctOptionId: "hx5xv",
          options: [
            {
              id: "q6y8j",
              text: "Initial Position, Takeoff and Climb Thrust Limits, Route, Cruise Wind.",
              why: "",
            },
            {
              id: "t61vw",
              text: "Initial Position, SID, Route, Performance Data, Takeoff Data.",
              why: "",
            },
            {
              id: "xyzxt",
              text: "Performance Data, Navigation Database, Route, Takeoff Data.",
              why: "",
            },
            {
              id: "hx5xv",
              text: "Initial Position, Performance Data, Route, Takeoff Data.",
              why: "",
            },
          ],
          explanation: "",
          selectedOptionId: "t61vw",
        },
        {
          questionId: "PHJq2fYz",
          templateId: "u67l4",
          seed: "rvTKF4f5",
          type: "multiple-choice",
          question:
            "The fuel imbalance alert is only displayed when the aircraft is in the air.",
          annexes: [],
          correctOptionId: "false",
          options: [
            {
              id: "true",
              text: "True",

              why: "",
            },
            {
              id: "false",
              text: "False",

              why: "",
            },
          ],
          explanation: "",
          selectedOptionId: "false",
        },
        {
          questionId: "SfJphtOb",
          templateId: "k6d9k",
          seed: "ud9kgE3e",
          type: "multiple-choice",
          question:
            "How many Trim Air Pressure Regulators are there in the Air Conditioning system?",
          annexes: [],
          correctOptionId: "knkbi",
          options: [
            {
              id: "knkbi",
              text: "1",
              why: "",
            },
            {
              id: "dglis",
              text: "2",
              why: "",
            },
            {
              id: "uao22",
              text: "There are no Trim Air Pressure Regulators, only Trim Air Modulating valves.",
              why: "",
            },
            {
              id: "ze9l2k",
              text: "3",
              why: "",
            },
          ],
          explanation: "",
          selectedOptionId: "dglis",
        },
        {
          questionId: "TY6fzsel",
          templateId: "eh228",
          seed: "mPOdlbIk",
          type: "multiple-choice",
          question:
            "What colour is the Outer Marker Beacon (OM) displayed on the PFD?",
          annexes: [],
          correctOptionId: "uh6tg",
          options: [
            {
              id: "e6vgf",
              text: "OM appears White in top right corner of AI",
              why: "",
            },
            {
              id: "vq8nu",
              text: "OM appears Magenta in lower right corner of Attitude Indicator.",
              why: "",
            },
            {
              id: "uh6tg",
              text: "OM appears Cyan in top right corner of AI.",
              why: "",
            },
            {
              id: "f3kop",
              text: "OM appears in Magenta in top right corner of the Attitude Indicator.",
              why: "",
            },
          ],
          explanation: "",
          selectedOptionId: "vq8nu",
        },
        {
          questionId: "EPge4XOI",
          templateId: "q1zqn",
          seed: "dmzqn3cb",
          type: "multiple-choice",
          question:
            "Maintaining uninterrupted power on both AC Transfer Busses is primarily the function of:",
          annexes: [],
          correctOptionId: "trchb",
          options: [
            {
              id: "trchb",
              text: "The Bus Tie Breakers (BTBs)",
              why: "",
            },
            {
              id: "83o0vl",
              text: "The IDGs",
              why: "",
            },
            {
              id: "20w7e",
              text: "The Ground Service Busses",
              why: "",
            },
            {
              id: "jwr9r",
              text: "The Transfer Busses",
              why: "",
            },
          ],
          explanation: "",
          selectedOptionId: "83o0vl",
        },
        {
          questionId: "YEyxx1Qv",
          templateId: "sbbox",
          seed: "LW3XeX1m",
          type: "multiple-choice",
          question:
            "On the DEP/ARR page on the FMC, more than one Arrival be entered.",
          annexes: [],
          correctOptionId: "true",
          options: [
            {
              id: "true",
              text: "True",

              why: "",
            },
            {
              id: "false",
              text: "False",

              why: "",
            },
          ],
          explanation: "",
          selectedOptionId: "false",
        },
        {
          questionId: "wMU8IXdh",
          templateId: "z3tbo",
          seed: "L21pzcgh",
          type: "multiple-choice",
          question:
            "Raising an engine start lever to the IDLE position opens which fuel valve(s)?",
          annexes: [],
          correctOptionId: "fkp1qf",
          options: [
            {
              id: "fkp1qf",
              text: "The related spar fuel shutoff valve and engine-mounted fuel shutoff valve.",
              why: "",
            },
            {
              id: "z47zo",
              text: "The related spar fuel shutoff valve.",
              why: "",
            },
            {
              id: "c2tn1",
              text: "The related engine-mounted fuel shutoff valve.",
              why: "",
            },
            {
              id: "hooe",
              text: "The related engine-mounted fuel shutoff valve and engine bypass valve.",
              why: "",
            },
          ],
          explanation: "",
          selectedOptionId: "z47zo",
        },
        {
          questionId: "jIgpZslc",
          templateId: "afuw6",
          seed: "UG5vjhIo",
          type: "multiple-choice",
          question: "Which bus powers the right igniter plug?",
          annexes: [],
          correctOptionId: "dj22hg",
          options: [
            {
              id: "8imqif",
              text: "DC Bus 1",
              why: "",
            },
            {
              id: "dj22hg",
              text: "The AC Standby Bus",
              why: "",
            },
            {
              id: "4ikxt",
              text: "AC Transfer Bus 1",
              why: "",
            },
            {
              id: "h81v4",
              text: "AC Transfer Bus 2",
              why: "",
            },
          ],
          explanation: "",
          selectedOptionId: "dj22hg",
        },
        {
          questionId: "5IXAWGxd",
          templateId: "xnuoj",
          seed: "9pbklSxM",
          type: "multiple-choice",
          question:
            "If the forward thrust lever is reduced to idle while the EEC is in the soft alternate mode, what is the result?",
          annexes: [],
          correctOptionId: "goxds",
          options: [
            {
              id: "uylps",
              text: "The EEC will remain in the soft alternate mode, the ALTN switch illuminates and the ON indication remains visible.",
              why: "",
            },
            {
              id: "tc3hoj",
              text: "Approach idle is commanded by the EEC.",
              why: "",
            },
            {
              id: "dul1z",
              text: "The EEC enters the hard alternate mode, the ALTN switch remains illuminated and the ON indication is blanked.",
              why: "",
            },
            {
              id: "goxds",
              text: "The EEC enters the hard alternate mode, the ALTN switch remains illuminated and the ON indication remains visible.",
              why: "",
            },
          ],
          explanation: "",
          selectedOptionId: "tc3hoj",
        },
        {
          questionId: "vGVv9yRc",
          templateId: "5mccy",
          seed: "J3rV0UPw",
          type: "multiple-choice",
          question: "On landing, when do the ground spoilers extend?",
          annexes: [],
          correctOptionId: "v9r05l",
          options: [
            {
              id: "v9r05l",
              text: "Compression of the right main landing gear strut.",
              why: "",
            },
            {
              id: "u24cff",
              text: "Compression of the left main landing gear strut.",
              why: "",
            },
            {
              id: "f0lhm",
              text: "Compression of the nose landing gear.",
              why: "",
            },
            {
              id: "ylrr7",
              text: "Compression of any landing gear strut.",
              why: "",
            },
          ],
          explanation: "",
          selectedOptionId: "v9r05l",
        },
        {
          questionId: "BrgGThAs",
          templateId: "cur39",
          seed: "XBb6WymW",
          type: "multiple-choice",
          question:
            "As well as the indication on the Lower DU, engine oil quantity can be physically checked using the gauges located in the Main Undercarriage Wheel Well.",
          annexes: [],
          correctOptionId: "false",
          options: [
            {
              id: "true",
              text: "True",

              why: "",
            },
            {
              id: "false",
              text: "False",

              why: "",
            },
          ],
          explanation: "",
          selectedOptionId: "true",
        },
        {
          questionId: "eG72Xly7",
          templateId: "a35lah",
          seed: "8RvpSdQj",
          type: "multiple-choice",
          question:
            "In turbulence mode, at what velocity of horizontal flow of precipitation towards or away from the weather radar will the target display turn magenta?",
          annexes: [],
          correctOptionId: "qkq0z",
          options: [
            {
              id: "qkq0z",
              text: "5 meters per second or greater.",
              why: "",
            },
            {
              id: "h1l5x",
              text: "2.5 meters per second or greater",
              why: "",
            },
            {
              id: "g3meq",
              text: "10 meters per second or greater.",
              why: "",
            },
            {
              id: "iks04",
              text: "7.5 meters per second or greater",
              why: "",
            },
          ],
          explanation: "",
          selectedOptionId: "qkq0z",
        },
        {
          questionId: "kMEV5ZwR",
          templateId: "hc0ll",
          seed: "cMzDsZx5",
          type: "multiple-choice",
          question:
            "If both the ON and ALTN lights in the EEC switch are illuminated, what does this indicate?",
          annexes: [],
          correctOptionId: "xqeqs",
          options: [
            {
              id: "l27lt",
              text: "The soft alternate mode is armed.",
              why: "",
            },
            {
              id: "xqeqs",
              text: "The EEC has automatically switched to the soft alternate mode.",
              why: "",
            },
            {
              id: "60ql0h",
              text: "The EEC has been manually switched to the soft alternate mode",
              why: "",
            },
            {
              id: "yvs6i",
              text: "The EEC is inoperative for that engines.",
              why: "",
            },
          ],
          explanation: "",
          selectedOptionId: "l27lt",
        },
        {
          questionId: "hREBHC5V",
          templateId: "v3mqb",
          seed: "SODlEnRq",
          type: "multiple-choice",
          question:
            "The picture below shows that there is a fault in the left engine Overheat/Fire Detection Loops.  How would you determine which of the 2 loops had failed?",
          annexes: [],
          correctOptionId: "zfrgx",
          options: [
            {
              id: "zfrgx",
              text: "Carry out the test again one loop at a time using the OVHT DET switch selected to A and then B.",
              why: "",
            },
            {
              id: "6eein",
              text: "Move to FAULT/INOP - OVHT/FIRE switch to the central TEST position, then test one loop at a time using the OVHT DET switch selected first to A and then B.",
              why: "",
            },
            {
              id: "8iahn",
              text: "This indication only occurs when BOTH loops have failed.",
              why: "",
            },
            {
              id: "vlf76",
              text: "Carry out the test again with the switch selected to FAULT/INOP testing each loop individually with the OVHT DET switch at A then B.",
              why: "",
            },
          ],
          explanation: "",
          selectedOptionId: "zfrgx",
        },
        {
          questionId: "GjLiBTaR",
          templateId: "zmlui",
          seed: "SBgtcb1E",
          type: "multiple-choice",
          question:
            "What is the source of power for the AC Standby bus if all AC power is lost.",
          annexes: [],
          correctOptionId: "xlaao",
          options: [
            {
              id: "xlaao",
              text: "The Static Inverter",
              why: "",
            },
            {
              id: "f5sxr",
              text: "The Battery Charger",
              why: "",
            },
            {
              id: "xzlbgf",
              text: "The DC Standby Bus",
              why: "",
            },
            {
              id: "9n5bg",
              text: "The TRs",
              why: "",
            },
          ],
          explanation: "",
          selectedOptionId: "xlaao",
        },
        {
          questionId: "UJPv3fGg",
          templateId: "8tjxg",
          seed: "O4M3Wqvt",
          type: "multiple-choice",
          question:
            "After starting the engine and it achieving Stabilised Idle (59% N2), a low oil pressure condition would be identified by the amber LOW OIL PRESSURE annunciation on the upper DU, and the Lower DU displaying OIL PRESS Pointer in the Amber band.",
          annexes: [],
          correctOptionId: "false",
          options: [
            {
              id: "true",
              text: "True",

              why: "",
            },
            {
              id: "false",
              text: "False",

              why: "",
            },
          ],
          explanation: "",
          selectedOptionId: "true",
        },
        {
          questionId: "DaRCGL0o",
          templateId: "mnd14",
          seed: "3exLzZHf",
          type: "multiple-choice",
          question: "Where in the engine oil system is the oil filter located?",
          annexes: [],
          correctOptionId: "ulq2c",
          options: [
            {
              id: "p32gc",
              text: "In the oil tank",
              why: "",
            },
            {
              id: "h37grj",
              text: "In the engine oil supply after leaving the oil tank",
              why: "",
            },
            {
              id: "aftpm",
              text: "In the engine bearings supply line",
              why: "",
            },
            {
              id: "ulq2c",
              text: "In the engine oil return line before reaching the oil tank",
              why: "",
            },
          ],
          explanation: "",
          selectedOptionId: "p32gc",
        },
      ],
      createdAtEpochMs: 1706517006479,
      startedAtEpochMs: 1706517006552,
      finishedAtEpochMs: 1706517026633,
    },
  },
};
