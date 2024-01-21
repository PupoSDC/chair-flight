import type { AppRouterOutput } from "@chair-flight/trpc/server";

export const testsGetSubjectsMock: AppRouterOutput["tests"]["getSubjects"] = {
  subjects: [
    {
      id: "010",
      courses: [],
      longName: "Air Law",
      shortName: "ALaw",
      numberOfExamQuestions: 44,
      numberOfExamMinutes: 60,
      learningObjectives: [
        {
          id: "010.01",
          text: "International Law:\n-  Conventions, Agreements And Organisations",
          numberOfQuestions: 190,
          learningObjectives: [
            {
              id: "010.01.01",
              text: "The Convention on International Civil Aviation (Chicago) - Icao Doc 7300/9 - Convention on the High Seas (Geneva, 29 April 1958)",
              numberOfQuestions: 103,
            },
            {
              id: "010.01.02",
              text: "Other conventions and agreements",
              numberOfQuestions: 38,
            },
            {
              id: "010.01.03",
              text: "World organisations",
              numberOfQuestions: 5,
            },
            {
              id: "010.01.04",
              text: "European organisations",
              numberOfQuestions: 22,
            },
          ],
        },
        {
          id: "010.02",
          text: "Airworthiness Of Aircraft, Aircraft Nationality And Registration Marks",
          numberOfQuestions: 29,
          learningObjectives: [
            {
              id: "010.02.02",
              text: "Certificate of Airworthiness (CofA)",
              numberOfQuestions: 15,
            },
            {
              id: "010.02.03",
              text: "Icao Annex 7 - Aircraft Nationality and Registration Marks",
              numberOfQuestions: 8,
            },
            {
              id: "010.02.04",
              text: "Nationality marks, common marks and registration marks",
              numberOfQuestions: 4,
            },
          ],
        },
        {
          id: "010.04",
          text: "Personnel Licensing",
          numberOfQuestions: 124,
          learningObjectives: [
            {
              id: "010.04.01",
              text: "Icao Annex 1",
              numberOfQuestions: 0,
            },
            {
              id: "010.04.02",
              text: "Aircrew Regulation - Annex I (Part-Fcl) Source:\n-  Aircrew Regulation",
              numberOfQuestions: 95,
            },
            {
              id: "010.04.03",
              text: "Aircrew Regulation - Annex Iv (Part-Med)",
              numberOfQuestions: 24,
            },
          ],
        },
        {
          id: "010.05",
          text: "Rules Of The Air According To Icao Annex 2 And Sera ",
          numberOfQuestions: 243,
          learningObjectives: [
            {
              id: "010.05.01",
              text: "Overview of Icao Annex 2 and Sera (Commission Implementing Regulation (Eu) No 923/2012 and its references and subsequent amendments)",
              numberOfQuestions: 2,
            },
            {
              id: "010.05.02",
              text: "Rules of the Air",
              numberOfQuestions: 20,
            },
            {
              id: "010.05.03",
              text: "General rules",
              numberOfQuestions: 156,
            },
            {
              id: "010.05.04",
              text: "Visual flight rules (Vfr)",
              numberOfQuestions: 0,
            },
            {
              id: "010.05.05",
              text: "Instrument flight rules (Ifr)",
              numberOfQuestions: 0,
            },
            {
              id: "010.05.06",
              text: "Interception of civil aircraft",
              numberOfQuestions: 26,
            },
          ],
        },
        {
          id: "010.06",
          text: "Aircraft Operations ",
          numberOfQuestions: 413,
          learningObjectives: [
            {
              id: "010.06.02",
              text: "Definitions and abbreviations (Pans-Ops Flight Procedures, Icao Doc 8168, Volume I)",
              numberOfQuestions: 0,
            },
            {
              id: "010.06.03",
              text: "Departure procedures - (Icao Doc 8168, Volume I)",
              numberOfQuestions: 22,
            },
            {
              id: "010.06.04",
              text: "Approach procedures - Icao Doc 8168, Volume I",
              numberOfQuestions: 149,
            },
            {
              id: "010.06.05",
              text: "Holding procedures - Icao Doc 8168, Volume I",
              numberOfQuestions: 62,
            },
            {
              id: "010.06.06",
              text: "Altimeter-setting procedures - Icao Doc 8168",
              numberOfQuestions: 61,
            },
            {
              id: "010.06.07",
              text: "Parallel or near-parallel instrument RWYs - Icao Doc 8168, Volume Iii",
              numberOfQuestions: 36,
            },
            {
              id: "010.06.08",
              text: "Secondary surveillance radar (transponder) operating procedures - Icao Doc 8168",
              numberOfQuestions: 34,
            },
            {
              id: "010.06.09",
              text: "Regulation (Eu) No 965/2012 On Air Operations",
              numberOfQuestions: 7,
            },
          ],
        },
        {
          id: "010.07",
          text: "Air Traffic Services (Ats) And Air Traffic Management (Atm)",
          numberOfQuestions: 518,
          learningObjectives: [
            {
              id: "010.07.01",
              text: "Icao Annex 11 - Air Traffic Services",
              numberOfQuestions: 132,
            },
            {
              id: "010.07.02",
              text: "Icao Doc 4444 - Air Traffic Management",
              numberOfQuestions: 341,
            },
          ],
        },
        {
          id: "010.08",
          text: "Aeronautical Information Service (Ais)",
          numberOfQuestions: 94,
          learningObjectives: [
            {
              id: "010.08.01",
              text: "Introduction",
              numberOfQuestions: 0,
            },
            {
              id: "010.08.02",
              text: "Definitions of Icao Annex 15",
              numberOfQuestions: 7,
            },
            {
              id: "010.08.03",
              text: "General",
              numberOfQuestions: 8,
            },
            {
              id: "010.08.04",
              text: "Aeronautical information products and services",
              numberOfQuestions: 62,
            },
            {
              id: "010.08.05",
              text: "Atm service providers",
              numberOfQuestions: 3,
            },
          ],
        },
        {
          id: "010.09",
          text: "Aerodromes (Icao Annex 14 and Regulation (Eu) No 139/2014)",
          numberOfQuestions: 327,
          learningObjectives: [
            {
              id: "010.09.01",
              text: "General",
              numberOfQuestions: 0,
            },
            {
              id: "010.09.02",
              text: "Aerodrome (Ad) data",
              numberOfQuestions: 40,
            },
            {
              id: "010.09.03",
              text: "Physical characteristics",
              numberOfQuestions: 63,
            },
            {
              id: "010.09.04",
              text: "Visual aids for navigation",
              numberOfQuestions: 134,
            },
            {
              id: "010.09.05",
              text: "Visual aids for denoting obstacles",
              numberOfQuestions: 23,
            },
            {
              id: "010.09.06",
              text: "Visual aids for denoting restricted use of areas",
              numberOfQuestions: 8,
            },
            {
              id: "010.09.07",
              text: "Aerodrome (Ad) operational services, equipment and installations",
              numberOfQuestions: 23,
            },
            {
              id: "010.09.08",
              text: "Supplementary Guidance Material",
              numberOfQuestions: 16,
            },
          ],
        },
        {
          id: "010.10",
          text: "Facilitation (Icao Annex 9)",
          numberOfQuestions: 51,
          learningObjectives: [
            {
              id: "010.10.02",
              text: "Entry and departure of aircraft",
              numberOfQuestions: 46,
            },
          ],
        },
        {
          id: "010.11",
          text: "Search And Rescue (Sar)",
          numberOfQuestions: 57,
          learningObjectives: [
            {
              id: "010.11.01",
              text: "Essential Sar definitions",
              numberOfQuestions: 3,
            },
            {
              id: "010.11.02",
              text: "Sar - Organisation",
              numberOfQuestions: 13,
            },
            {
              id: "010.11.03",
              text: "Operating procedures for non-Sar crews",
              numberOfQuestions: 11,
            },
            {
              id: "010.11.04",
              text: "Search and rescue signals",
              numberOfQuestions: 25,
            },
          ],
        },
        {
          id: "010.12",
          text: "Security - Safeguarding International Civil Aviation against Acts of Unlawful Interference (Icao Annex 17) ",
          numberOfQuestions: 70,
          learningObjectives: [
            {
              id: "010.12.01",
              text: "Definitions of Icao Annex 17",
              numberOfQuestions: 4,
            },
            {
              id: "010.12.02",
              text: "General principles",
              numberOfQuestions: 0,
            },
            {
              id: "010.12.04",
              text: "Preventive security measures",
              numberOfQuestions: 14,
            },
            {
              id: "010.12.05",
              text: "Management of response to acts of unlawful interference",
              numberOfQuestions: 7,
            },
            {
              id: "010.12.06",
              text: "Operators’ security programme",
              numberOfQuestions: 7,
            },
            {
              id: "010.12.07",
              text: "Security procedures in other documents, i.e. Icao Annexes 2, 6 and 14, Icao Doc 4444, Regulation (Eu) No 965/2012 and Cs-Adr-Dsn",
              numberOfQuestions: 25,
            },
          ],
        },
        {
          id: "010.13",
          text: "Aircraft Accident And Incident Investigation",
          numberOfQuestions: 44,
          learningObjectives: [
            {
              id: "010.13.01",
              text: "Essential definitions of Icao Annex 13",
              numberOfQuestions: 9,
            },
            {
              id: "010.13.02",
              text: "Accident and incident investigation in Icao Annex 13",
              numberOfQuestions: 11,
            },
            {
              id: "010.13.03",
              text: "Accident and incident investigation in Eu regulations ",
              numberOfQuestions: 17,
            },
          ],
        },
      ],
      numberOfQuestions: 1941,
    },
    {
      id: "021",
      courses: [],
      longName:
        "Aircraft General Knowledge — Airframe, Systems And Power Plant",
      shortName: "AGK",
      numberOfExamQuestions: 80,
      numberOfExamMinutes: 120,
      learningObjectives: [
        {
          id: "021.01",
          text: "System Design, Loads, Stresses, Maintenance",
          numberOfQuestions: 65,
          learningObjectives: [
            {
              id: "021.01.01",
              text: "System design",
              numberOfQuestions: 21,
            },
            {
              id: "021.01.02",
              text: "Loads and stresses",
              numberOfQuestions: 17,
            },
            {
              id: "021.01.03",
              text: "Fatigue and corrosion",
              numberOfQuestions: 21,
            },
            {
              id: "021.01.05",
              text: "Maintenance",
              numberOfQuestions: 4,
            },
          ],
        },
        {
          id: "021.02",
          text: "Airframe",
          numberOfQuestions: 114,
          learningObjectives: [
            {
              id: "021.02.01",
              text: "Attachment methods",
              numberOfQuestions: 6,
            },
            {
              id: "021.02.02",
              text: "Materials",
              numberOfQuestions: 3,
            },
            {
              id: "021.02.03",
              text: "Aeroplane:\n-  wings, tail surfaces and control surfaces",
              numberOfQuestions: 22,
            },
            {
              id: "021.02.04",
              text: "Fuselage, landing gear, doors, floor, windscreen and windows",
              numberOfQuestions: 53,
            },
            {
              id: "021.02.05",
              text: "Helicopter:\n-  structural aspects of flight controls ",
              numberOfQuestions: 19,
            },
            {
              id: "021.02.06",
              text: "Structural limitations",
              numberOfQuestions: 5,
            },
          ],
        },
        {
          id: "021.03",
          text: "Hydraulics",
          numberOfQuestions: 91,
          learningObjectives: [
            {
              id: "021.03.01",
              text: "Hydromechanics:\n-  basic principles",
              numberOfQuestions: 0,
            },
            {
              id: "021.03.02",
              text: "Hydraulic systems",
              numberOfQuestions: 85,
            },
          ],
        },
        {
          id: "021.04",
          text: "Landing Gear, Wheels, Tyres, Brakes",
          numberOfQuestions: 141,
          learningObjectives: [
            {
              id: "021.04.01",
              text: "Landing gear",
              numberOfQuestions: 53,
            },
            {
              id: "021.04.02",
              text: "Nose-wheel steering",
              numberOfQuestions: 16,
            },
            {
              id: "021.04.03",
              text: "Brakes",
              numberOfQuestions: 50,
            },
            {
              id: "021.04.04",
              text: "Wheels, rims and tyres",
              numberOfQuestions: 16,
            },
            {
              id: "021.04.05",
              text: "Helicopter equipment",
              numberOfQuestions: 0,
            },
          ],
        },
        {
          id: "021.05",
          text: "Flight Controls",
          numberOfQuestions: 76,
          learningObjectives: [
            {
              id: "021.05.01",
              text: "Aeroplane:\n-  primary flight controls",
              numberOfQuestions: 28,
            },
            {
              id: "021.05.02",
              text: "Aeroplane:\n-  secondary flight controls",
              numberOfQuestions: 12,
            },
            {
              id: "021.05.03",
              text: "Helicopter:\n-  flight controls",
              numberOfQuestions: 8,
            },
            {
              id: "021.05.04",
              text: "Aeroplane:\n-  fly-by-wire (Fbw) control systems",
              numberOfQuestions: 20,
            },
            {
              id: "021.05.05",
              text: "Helicopter:\n-  fly-by-wire (Fbw) control systems - to be introduced at a later date",
              numberOfQuestions: 0,
            },
          ],
        },
        {
          id: "021.06",
          text: "Pneumatics — Pressurisation And Air-Conditioning Systems",
          numberOfQuestions: 99,
          learningObjectives: [
            {
              id: "021.06.01",
              text: "Pneumatic/bleed-air supply",
              numberOfQuestions: 29,
            },
            {
              id: "021.06.02",
              text: "Helicopter:\n-  air-conditioning systems",
              numberOfQuestions: 9,
            },
            {
              id: "021.06.03",
              text: "Aeroplane:\n-  pressurisation and air-conditioning system",
              numberOfQuestions: 59,
            },
          ],
        },
        {
          id: "021.07",
          text: "Anti-Icing And De-Icing Systems",
          numberOfQuestions: 47,
          learningObjectives: [
            {
              id: "021.07.01",
              text: "Types, operation, indications",
              numberOfQuestions: 30,
            },
            {
              id: "021.07.02",
              text: "Ice warning systems",
              numberOfQuestions: 15,
            },
            {
              id: "021.07.03",
              text: "Helicopter blade heating systems",
              numberOfQuestions: 0,
            },
          ],
        },
        {
          id: "021.08",
          text: "Fuel System",
          numberOfQuestions: 83,
          learningObjectives: [
            {
              id: "021.08.01",
              text: "Piston engine",
              numberOfQuestions: 40,
            },
            {
              id: "021.08.02",
              text: "Turbine engine",
              numberOfQuestions: 41,
            },
          ],
        },
        {
          id: "021.09",
          text: "Electrics ",
          numberOfQuestions: 224,
          learningObjectives: [
            {
              id: "021.09.01",
              text: "General, definitions, basic applications:\n-  circuit breakers, logic circuits",
              numberOfQuestions: 70,
            },
            {
              id: "021.09.02",
              text: "Batteries",
              numberOfQuestions: 21,
            },
            {
              id: "021.09.03",
              text: "Generation. ",
              numberOfQuestions: 64,
            },
            {
              id: "021.09.04",
              text: "Distribution",
              numberOfQuestions: 49,
            },
            {
              id: "021.09.05",
              text: "Electrical motors",
              numberOfQuestions: 16,
            },
          ],
        },
        {
          id: "021.10",
          text: "Piston Engines ",
          numberOfQuestions: 250,
          learningObjectives: [
            {
              id: "021.10.01",
              text: "General",
              numberOfQuestions: 16,
            },
            {
              id: "021.10.02",
              text: "Fuel",
              numberOfQuestions: 30,
            },
            {
              id: "021.10.03",
              text: "Engine fuel pumps",
              numberOfQuestions: 2,
            },
            {
              id: "021.10.04",
              text: "Carburettor/injection system",
              numberOfQuestions: 37,
            },
            {
              id: "021.10.05",
              text: "Cooling systems",
              numberOfQuestions: 17,
            },
            {
              id: "021.10.06",
              text: "Lubrication systems ",
              numberOfQuestions: 21,
            },
            {
              id: "021.10.07",
              text: "Ignition circuits",
              numberOfQuestions: 20,
            },
            {
              id: "021.10.08",
              text: "Mixture",
              numberOfQuestions: 24,
            },
            {
              id: "021.10.09",
              text: "Aeroplane:\n-  propellers",
              numberOfQuestions: 51,
            },
            {
              id: "021.10.10",
              text: "Performance and engine handling",
              numberOfQuestions: 28,
            },
          ],
        },
        {
          id: "021.11",
          text: "Turbine Engines",
          numberOfQuestions: 367,
          learningObjectives: [
            {
              id: "021.11.01",
              text: "Basic principles",
              numberOfQuestions: 74,
            },
            {
              id: "021.11.02",
              text: "Main-engine components",
              numberOfQuestions: 133,
            },
            {
              id: "021.11.03",
              text: "Additional components and systems",
              numberOfQuestions: 71,
            },
            {
              id: "021.11.04",
              text: "Engine operation and monitoring",
              numberOfQuestions: 40,
            },
            {
              id: "021.11.05",
              text: "Performance aspects",
              numberOfQuestions: 29,
            },
            {
              id: "021.11.06",
              text: "Auxiliary power unit (Apu)",
              numberOfQuestions: 11,
            },
          ],
        },
        {
          id: "021.12",
          text: "Protection And Detection Systems",
          numberOfQuestions: 58,
          learningObjectives: [
            {
              id: "021.12.01",
              text: "Smoke detection",
              numberOfQuestions: 7,
            },
            {
              id: "021.12.02",
              text: "Fire-protection systems",
              numberOfQuestions: 38,
            },
            {
              id: "021.12.03",
              text: "Rain-protection system",
              numberOfQuestions: 12,
            },
          ],
        },
        {
          id: "021.13",
          text: "Oxygen Systems",
          numberOfQuestions: 52,
          learningObjectives: [
            {
              id: "021.13.01",
              text: "Cockpit, portable and chemical oxygen systems",
              numberOfQuestions: 49,
            },
          ],
        },
        {
          id: "021.14",
          text: "Helicopter:\n-  Miscellaneous Systems",
          numberOfQuestions: 0,
          learningObjectives: [
            {
              id: "021.14.01",
              text: "Variable rotor speed, active vibration suppression, night-vision goggles (Nvg)",
              numberOfQuestions: 0,
            },
          ],
        },
        {
          id: "021.15",
          text: "Helicopter:\n-  Rotor Heads",
          numberOfQuestions: 0,
          learningObjectives: [
            {
              id: "021.15.01",
              text: "Main rotor",
              numberOfQuestions: 0,
            },
            {
              id: "021.15.02",
              text: "Tail rotor",
              numberOfQuestions: 0,
            },
          ],
        },
        {
          id: "021.16",
          text: "Helicopter:\n-  Transmission",
          numberOfQuestions: 0,
          learningObjectives: [
            {
              id: "021.16.01",
              text: "Main gearbox",
              numberOfQuestions: 0,
            },
            {
              id: "021.16.02",
              text: "Rotor brake",
              numberOfQuestions: 0,
            },
            {
              id: "021.16.03",
              text: "Auxiliary systems",
              numberOfQuestions: 0,
            },
            {
              id: "021.16.04",
              text: "Driveshaft and associated installation",
              numberOfQuestions: 0,
            },
            {
              id: "021.16.05",
              text: "Intermediate and tail gearbox",
              numberOfQuestions: 0,
            },
            {
              id: "021.16.06",
              text: "Clutches",
              numberOfQuestions: 0,
            },
            {
              id: "021.16.07",
              text: "Freewheels",
              numberOfQuestions: 0,
            },
          ],
        },
        {
          id: "021.17",
          text: "Helicopter:\n-  Blades",
          numberOfQuestions: 0,
          learningObjectives: [
            {
              id: "021.17.01",
              text: "Main-rotor design and blade design",
              numberOfQuestions: 0,
            },
            {
              id: "021.17.02",
              text: "Tail-rotor design and blade design",
              numberOfQuestions: 0,
            },
          ],
        },
      ],
      numberOfQuestions: 1612,
    },
    {
      id: "022",
      courses: [],
      longName: "Aircraft General Knowledge - Instrumentation",
      shortName: "Instruments",
      numberOfExamQuestions: 60,
      numberOfExamMinutes: 90,
      learningObjectives: [
        {
          id: "022.01",
          text: "Sensors And Instruments ",
          numberOfQuestions: 284,
          learningObjectives: [
            {
              id: "022.01.01",
              text: "Pressure gauge",
              numberOfQuestions: 39,
            },
            {
              id: "022.01.02",
              text: "Temperature sensing",
              numberOfQuestions: 49,
            },
            {
              id: "022.01.03",
              text: "Fuel gauge",
              numberOfQuestions: 43,
            },
            {
              id: "022.01.04",
              text: "Fuel flowmeters",
              numberOfQuestions: 15,
            },
            {
              id: "022.01.05",
              text: "Tachometer",
              numberOfQuestions: 27,
            },
            {
              id: "022.01.06",
              text: "Thrust measurement",
              numberOfQuestions: 16,
            },
            {
              id: "022.01.07",
              text: "Engine torquemeter",
              numberOfQuestions: 29,
            },
            {
              id: "022.01.08",
              text: "Synchroscope",
              numberOfQuestions: 18,
            },
            {
              id: "022.01.09",
              text: "Engine-vibration monitoring ",
              numberOfQuestions: 25,
            },
            {
              id: "022.01.10",
              text: "Time measurement",
              numberOfQuestions: 1,
            },
          ],
        },
        {
          id: "022.02",
          text: "Measurement Of Air-Data Parameters",
          numberOfQuestions: 500,
          learningObjectives: [
            {
              id: "022.02.01",
              text: "Pressure measurement",
              numberOfQuestions: 32,
            },
            {
              id: "022.02.02",
              text: "Temperature measurement",
              numberOfQuestions: 39,
            },
            {
              id: "022.02.03",
              text: "Angle-of-attack (AoA) measurement",
              numberOfQuestions: 47,
            },
            {
              id: "022.02.04",
              text: "Altimeter",
              numberOfQuestions: 60,
            },
            {
              id: "022.02.05",
              text: "Vertical speed indicator (Vsi)",
              numberOfQuestions: 27,
            },
            {
              id: "022.02.06",
              text: "Airspeed indicator (Asi)",
              numberOfQuestions: 61,
            },
            {
              id: "022.02.07",
              text: "Machmeter",
              numberOfQuestions: 116,
            },
            {
              id: "022.02.08",
              text: "Air-data computer (Adc)",
              numberOfQuestions: 83,
            },
          ],
        },
        {
          id: "022.03",
          text: "Magnetism - Direct-Reading Compass And Flux Valve",
          numberOfQuestions: 164,
          learningObjectives: [
            {
              id: "022.03.01",
              text: "Earth’s magnetic field",
              numberOfQuestions: 48,
            },
            {
              id: "022.03.02",
              text: "Aircraft magnetic field",
              numberOfQuestions: 33,
            },
            {
              id: "022.03.03",
              text: "Direct-reading magnetic compass ",
              numberOfQuestions: 58,
            },
            {
              id: "022.03.04",
              text: "Flux valve",
              numberOfQuestions: 16,
            },
          ],
        },
        {
          id: "022.04",
          text: "Gyroscopic Instruments",
          numberOfQuestions: 184,
          learningObjectives: [
            {
              id: "022.04.01",
              text: "Gyroscope:\n-  basic principles",
              numberOfQuestions: 32,
            },
            {
              id: "022.04.02",
              text: "Rate-of-turn indicator - Turn coordinator - Balance (slip) indicator",
              numberOfQuestions: 30,
            },
            {
              id: "022.04.03",
              text: "Attitude indicator (artificial horizon)",
              numberOfQuestions: 21,
            },
            {
              id: "022.04.04",
              text: "Directional gyroscope",
              numberOfQuestions: 73,
            },
            {
              id: "022.04.05",
              text: "Remote-reading compass systems",
              numberOfQuestions: 7,
            },
            {
              id: "022.04.06",
              text: "Solid-state systems - attitude and heading reference system (Ahrs) ",
              numberOfQuestions: 8,
            },
          ],
        },
        {
          id: "022.05",
          text: "Inertial Navigation",
          numberOfQuestions: 232,
          learningObjectives: [
            {
              id: "022.05.01",
              text: "Basic principles",
              numberOfQuestions: 124,
            },
            {
              id: "022.05.02",
              text: "Alignment and operation",
              numberOfQuestions: 104,
            },
          ],
        },
        {
          id: "022.06",
          text: "Aeroplane:\n-  Automatic Flight Control Systems",
          numberOfQuestions: 288,
          learningObjectives: [
            {
              id: "022.06.01",
              text: "General",
              numberOfQuestions: 8,
            },
            {
              id: "022.06.02",
              text: "Autopilot system",
              numberOfQuestions: 129,
            },
            {
              id: "022.06.03",
              text: "Flight director:\n-  design and operation",
              numberOfQuestions: 64,
            },
            {
              id: "022.06.04",
              text: "Aeroplane:\n-  flight mode annunciator (Fma) ",
              numberOfQuestions: 11,
            },
            {
              id: "022.06.05",
              text: "Autoland",
              numberOfQuestions: 60,
            },
          ],
        },
        {
          id: "022.07",
          text: "Helicopter:\n-  Automatic Flight Control Systems",
          numberOfQuestions: 0,
          learningObjectives: [
            {
              id: "022.07.01",
              text: "General principles",
              numberOfQuestions: 0,
            },
            {
              id: "022.07.02",
              text: "Components:\n-  operation",
              numberOfQuestions: 0,
            },
            {
              id: "022.07.03",
              text: "Stability augmentation system (Sas)",
              numberOfQuestions: 0,
            },
            {
              id: "022.07.04",
              text: "Autopilot - automatic stability equipment",
              numberOfQuestions: 0,
            },
          ],
        },
        {
          id: "022.08",
          text: "Trims - Yaw Damper - Flight-Envelope Protection",
          numberOfQuestions: 81,
          learningObjectives: [
            {
              id: "022.08.01",
              text: "Trim systems ",
              numberOfQuestions: 39,
            },
            {
              id: "022.08.02",
              text: "Yaw damper",
              numberOfQuestions: 27,
            },
            {
              id: "022.08.03",
              text: "Flight-envelope protection (Fep)",
              numberOfQuestions: 9,
            },
          ],
        },
        {
          id: "022.09",
          text: "Autothrust - Automatic Thrust Control System",
          numberOfQuestions: 73,
          learningObjectives: [
            {
              id: "022.09.01",
              text: "Autothrust system",
              numberOfQuestions: 69,
            },
          ],
        },
        {
          id: "022.10",
          text: "Communication Systems",
          numberOfQuestions: 57,
          learningObjectives: [
            {
              id: "022.10.01",
              text: "Voice communication, data-link transmission ",
              numberOfQuestions: 39,
            },
            {
              id: "022.10.02",
              text: "Future air navigation systems (FANSs)",
              numberOfQuestions: 17,
            },
          ],
        },
        {
          id: "022.11",
          text: "Flight Management System (Fms) / Flight Management And Guidance System (Fmgs)",
          numberOfQuestions: 186,
          learningObjectives: [
            {
              id: "022.11.01",
              text: "Design",
              numberOfQuestions: 55,
            },
            {
              id: "022.11.02",
              text: "Fmc databases",
              numberOfQuestions: 31,
            },
            {
              id: "022.11.03",
              text: "Operations, limitations",
              numberOfQuestions: 59,
            },
            {
              id: "022.11.04",
              text: "Human–machine interface (control and display unit (Cdu)/ multifunction control and display unit (Mcdu))",
              numberOfQuestions: 29,
            },
          ],
        },
        {
          id: "022.12",
          text: "Alerting Systems, Proximity Systems",
          numberOfQuestions: 344,
          learningObjectives: [
            {
              id: "022.12.01",
              text: "General",
              numberOfQuestions: 2,
            },
            {
              id: "022.12.02",
              text: "Flight warning systems (FWSs)",
              numberOfQuestions: 38,
            },
            {
              id: "022.12.03",
              text: "Stall warning systems (SWSs)",
              numberOfQuestions: 16,
            },
            {
              id: "022.12.04",
              text: "Stall protection",
              numberOfQuestions: 15,
            },
            {
              id: "022.12.05",
              text: "Overspeed warning",
              numberOfQuestions: 24,
            },
            {
              id: "022.12.06",
              text: "Take-off warning",
              numberOfQuestions: 15,
            },
            {
              id: "022.12.07",
              text: "Altitude alert system",
              numberOfQuestions: 12,
            },
            {
              id: "022.12.08",
              text: "Radio altimeter",
              numberOfQuestions: 49,
            },
            {
              id: "022.12.09",
              text: "Ground-proximity warning systems (GPWSs)",
              numberOfQuestions: 71,
            },
            {
              id: "022.12.10",
              text: "Acas/Tcas ",
              numberOfQuestions: 93,
            },
            {
              id: "022.12.11",
              text: "Rotor/engine overspeed alert system",
              numberOfQuestions: 0,
            },
          ],
        },
        {
          id: "022.13",
          text: "Integrated Instruments - Electronic Displays",
          numberOfQuestions: 299,
          learningObjectives: [
            {
              id: "022.13.01",
              text: "Electronic display units",
              numberOfQuestions: 7,
            },
            {
              id: "022.13.02",
              text: "Mechanical integrated instruments",
              numberOfQuestions: 5,
            },
            {
              id: "022.13.03",
              text: "Electronic flight instrument systems (EFISs)",
              numberOfQuestions: 169,
            },
            {
              id: "022.13.04",
              text: "Engine parameters, crew warnings, aircraft systems, procedure and mission display systems ",
              numberOfQuestions: 26,
            },
            {
              id: "022.13.05",
              text: "Engine first limit indicator",
              numberOfQuestions: 0,
            },
            {
              id: "022.13.06",
              text: "Electronic flight bag (Efb)",
              numberOfQuestions: 33,
            },
            {
              id: "022.13.07",
              text: "Head-up display (Hud), synthetic vision system (Svs) and enhanced visual system (Evs)",
              numberOfQuestions: 44,
            },
          ],
        },
        {
          id: "022.14",
          text: "Maintenance, Monitoring And Recording Systems",
          numberOfQuestions: 53,
          learningObjectives: [
            {
              id: "022.14.01",
              text: "Cockpit voice recorder (Cvr)",
              numberOfQuestions: 18,
            },
            {
              id: "022.14.02",
              text: "Flight data recorder (Fdr)",
              numberOfQuestions: 21,
            },
            {
              id: "022.14.03",
              text: "Maintenance and monitoring systems",
              numberOfQuestions: 9,
            },
          ],
        },
        {
          id: "022.15",
          text: "Digital Circuits And Computers",
          numberOfQuestions: 56,
          learningObjectives: [
            {
              id: "022.15.01",
              text: "Digital circuits and computers ",
              numberOfQuestions: 55,
            },
          ],
        },
      ],
      numberOfQuestions: 2649,
    },
    {
      id: "031",
      courses: [],
      longName: "Mass And Balance - Aeroplanes/Helicopters",
      shortName: "M&B",
      numberOfExamQuestions: 25,
      numberOfExamMinutes: 75,
      learningObjectives: [
        {
          id: "031.01",
          text: "Purpose Of Mass-And-Balance Considerations",
          numberOfQuestions: 57,
          learningObjectives: [
            {
              id: "031.01.01",
              text: "Mass limitations",
              numberOfQuestions: 11,
            },
            {
              id: "031.01.02",
              text: "Centre-of-gravity (Cg) limitations",
              numberOfQuestions: 29,
            },
          ],
        },
        {
          id: "031.02",
          text: "Loading",
          numberOfQuestions: 433,
          learningObjectives: [
            {
              id: "031.02.01",
              text: "Terminology",
              numberOfQuestions: 81,
            },
            {
              id: "031.02.02",
              text: "Mass limits",
              numberOfQuestions: 165,
            },
            {
              id: "031.02.03",
              text: "Mass calculations",
              numberOfQuestions: 159,
            },
          ],
        },
        {
          id: "031.04",
          text: "Mass-And-Balance Details Of Aircraft",
          numberOfQuestions: 156,
          learningObjectives: [
            {
              id: "031.04.01",
              text: "Contents of mass-and-balance documentation",
              numberOfQuestions: 114,
            },
            {
              id: "031.04.02",
              text: "Determination of aircraft empty mass and Cg position by weighing",
              numberOfQuestions: 19,
            },
            {
              id: "031.04.03",
              text: "Extraction of basic empty mass (Bem) and Cg data from aircraft documentation",
              numberOfQuestions: 0,
            },
          ],
        },
        {
          id: "031.05",
          text: "Determination Of Cg Position",
          numberOfQuestions: 256,
          learningObjectives: [
            {
              id: "031.05.01",
              text: "Methods",
              numberOfQuestions: 122,
            },
            {
              id: "031.05.02",
              text: "Load and trim sheet",
              numberOfQuestions: 83,
            },
            {
              id: "031.05.03",
              text: "Repositioning of Cg",
              numberOfQuestions: 26,
            },
          ],
        },
        {
          id: "031.06",
          text: "Cargo Handling",
          numberOfQuestions: 64,
          learningObjectives: [
            {
              id: "031.06.01",
              text: "Types of cargo ",
              numberOfQuestions: 3,
            },
            {
              id: "031.06.02",
              text: "Floor-area load and running-load limitations ",
              numberOfQuestions: 53,
            },
            {
              id: "031.06.03",
              text: "Securement of load",
              numberOfQuestions: 7,
            },
          ],
        },
      ],
      numberOfQuestions: 872,
    },
    {
      id: "032",
      courses: [],
      longName: "Performance - Aeroplanes",
      shortName: "Perf",
      numberOfExamQuestions: 45,
      numberOfExamMinutes: 120,
      learningObjectives: [
        {
          id: "032.01",
          text: "General ",
          numberOfQuestions: 640,
          learningObjectives: [
            {
              id: "032.01.01",
              text: "Performance legislation ",
              numberOfQuestions: 32,
            },
            {
              id: "032.01.02",
              text: "General performance theory ",
              numberOfQuestions: 128,
            },
            {
              id: "032.01.03",
              text: "Level flight, range and endurance",
              numberOfQuestions: 211,
            },
            {
              id: "032.01.04",
              text: "Climbing",
              numberOfQuestions: 96,
            },
            {
              id: "032.01.05",
              text: "Descending ",
              numberOfQuestions: 32,
            },
          ],
        },
        {
          id: "032.02",
          text: "Cs-23/Applicable Operational Requirements Performance Class B - Theory ",
          numberOfQuestions: 353,
          learningObjectives: [
            {
              id: "032.02.01",
              text: "Airworthiness requirements ",
              numberOfQuestions: 95,
            },
            {
              id: "032.02.03",
              text: "Take-off and landing",
              numberOfQuestions: 115,
            },
            {
              id: "032.02.04",
              text: "Climb, cruise and descent ",
              numberOfQuestions: 99,
            },
          ],
        },
        {
          id: "032.03",
          text: "Cs-23/Applicable Operational Requirements Performance Class B - Use Of Aeroplane Performance Data For Single- And Multi-Engine Aeroplanes",
          numberOfQuestions: 307,
          learningObjectives: [
            {
              id: "032.03.03",
              text: "Use of aeroplane performance data",
              numberOfQuestions: 274,
            },
          ],
        },
        {
          id: "032.04",
          text: "Cs-25/Applicable Operational Requirements Performance Class A - Theory ",
          numberOfQuestions: 772,
          learningObjectives: [
            {
              id: "032.04.01",
              text: "Take-off ",
              numberOfQuestions: 441,
            },
            {
              id: "032.04.02",
              text: "Climb",
              numberOfQuestions: 45,
            },
            {
              id: "032.04.03",
              text: "Cruise",
              numberOfQuestions: 58,
            },
            {
              id: "032.04.04",
              text: "En-route one-engine-inoperative",
              numberOfQuestions: 27,
            },
            {
              id: "032.04.05",
              text: "Descent",
              numberOfQuestions: 34,
            },
            {
              id: "032.04.06",
              text: "Approach and landing",
              numberOfQuestions: 72,
            },
          ],
        },
        {
          id: "032.05",
          text: "Cs-25/Applicable Operational Requirements Performance Class A - Use Of Aeroplane Performance Data ",
          numberOfQuestions: 155,
          learningObjectives: [
            {
              id: "032.05.01",
              text: "Take-off ",
              numberOfQuestions: 68,
            },
            {
              id: "032.05.02",
              text: "Drift-down and stabilising altitude",
              numberOfQuestions: 35,
            },
            {
              id: "032.05.03",
              text: "Landing",
              numberOfQuestions: 45,
            },
          ],
        },
      ],
      numberOfQuestions: 1907,
    },
    {
      id: "033",
      courses: [],
      longName: "Flight Planning And Monitoring",
      shortName: "FPM",
      numberOfExamQuestions: 42,
      numberOfExamMinutes: 120,
      learningObjectives: [
        {
          id: "033.01",
          text: "Flight Planning For Vfr Flights ",
          numberOfQuestions: 406,
          learningObjectives: [
            {
              id: "033.01.01",
              text: "Vfr navigation plan",
              numberOfQuestions: 391,
            },
          ],
        },
        {
          id: "033.02",
          text: "Flight Planning For Ifr Flights ",
          numberOfQuestions: 570,
          learningObjectives: [
            {
              id: "033.02.01",
              text: "Ifr navigation plan",
              numberOfQuestions: 549,
            },
          ],
        },
        {
          id: "033.03",
          text: "Fuel Planning — Operational Requirements",
          numberOfQuestions: 804,
          learningObjectives: [
            {
              id: "033.03.01",
              text: "General",
              numberOfQuestions: 189,
            },
            {
              id: "033.03.02",
              text: "Pre-flight fuel planning for commercial flights",
              numberOfQuestions: 475,
            },
            {
              id: "033.03.03",
              text: "Specific fuel-calculation procedures ",
              numberOfQuestions: 104,
            },
          ],
        },
        {
          id: "033.04",
          text: "Pre-Flight Preparation",
          numberOfQuestions: 327,
          learningObjectives: [
            {
              id: "033.04.01",
              text: "Notice to airmen (Notam) briefing",
              numberOfQuestions: 65,
            },
            {
              id: "033.04.02",
              text: "Meteorological briefing",
              numberOfQuestions: 166,
            },
            {
              id: "033.04.03",
              text: "Point of equal time (Pet) and point of safe return (Psr)",
              numberOfQuestions: 69,
            },
          ],
        },
        {
          id: "033.05",
          text: "Icao Flight Plan (Ats flight plan (Fpl))",
          numberOfQuestions: 90,
          learningObjectives: [
            {
              id: "033.05.01",
              text: "Individual Fpl",
              numberOfQuestions: 84,
            },
            {
              id: "033.05.02",
              text: "Repetitive flight plan (Rpl)",
              numberOfQuestions: 0,
            },
          ],
        },
        {
          id: "033.06",
          text: "Flight Monitoring And In-Flight Replanning",
          numberOfQuestions: 293,
          learningObjectives: [
            {
              id: "033.06.01",
              text: "Flight monitoring",
              numberOfQuestions: 197,
            },
            {
              id: "033.06.02",
              text: "In-flight replanning",
              numberOfQuestions: 68,
            },
          ],
        },
      ],
      numberOfQuestions: 2357,
    },
    {
      id: "040",
      courses: [],
      longName: "Human Performance And Limitations",
      shortName: "HPL",
      numberOfExamQuestions: 48,
      numberOfExamMinutes: 90,
      learningObjectives: [
        {
          id: "040.01",
          text: "Human Factors:\n-  Basic Concepts ",
          numberOfQuestions: 119,
          learningObjectives: [
            {
              id: "040.01.01",
              text: "Human factors in aviation",
              numberOfQuestions: 12,
            },
            {
              id: "040.01.03",
              text: "Flight safety concepts",
              numberOfQuestions: 64,
            },
            {
              id: "040.01.04",
              text: "Safety culture",
              numberOfQuestions: 23,
            },
          ],
        },
        {
          id: "040.02",
          text: "Basics of aviation physiology and health maintenance",
          numberOfQuestions: 1263,
          learningObjectives: [
            {
              id: "040.02.01",
              text: "Basics of flight physiology",
              numberOfQuestions: 431,
            },
            {
              id: "040.02.02",
              text: "People and the environment:\n-  the sensory system",
              numberOfQuestions: 416,
            },
            {
              id: "040.02.03",
              text: "Health and hygiene",
              numberOfQuestions: 372,
            },
          ],
        },
        {
          id: "040.03",
          text: "Basic Aviation Psychology",
          numberOfQuestions: 903,
          learningObjectives: [
            {
              id: "040.03.01",
              text: "Human information processing",
              numberOfQuestions: 171,
            },
            {
              id: "040.03.02",
              text: "Human error and reliability",
              numberOfQuestions: 112,
            },
            {
              id: "040.03.03",
              text: "Decision-making",
              numberOfQuestions: 61,
            },
            {
              id: "040.03.04",
              text: "Avoiding and managing errors:\n-  cockpit management",
              numberOfQuestions: 202,
            },
            {
              id: "040.03.05",
              text: "Human behaviour",
              numberOfQuestions: 84,
            },
            {
              id: "040.03.06",
              text: "Human overload and underload",
              numberOfQuestions: 169,
            },
            {
              id: "040.03.07",
              text: "Advanced cockpit automation",
              numberOfQuestions: 72,
            },
          ],
        },
      ],
      numberOfQuestions: 2189,
    },
    {
      id: "050",
      courses: [],
      longName: "Meteorology ",
      shortName: "Met",
      numberOfExamQuestions: 84,
      numberOfExamMinutes: 120,
      learningObjectives: [
        {
          id: "050.01",
          text: "The Atmosphere",
          numberOfQuestions: 719,
          learningObjectives: [
            {
              id: "050.01.01",
              text: "Composition, extent, vertical division",
              numberOfQuestions: 144,
            },
            {
              id: "050.01.02",
              text: "Air temperature",
              numberOfQuestions: 110,
            },
            {
              id: "050.01.03",
              text: "Atmospheric pressure",
              numberOfQuestions: 176,
            },
            {
              id: "050.01.04",
              text: "Air density",
              numberOfQuestions: 3,
            },
            {
              id: "050.01.05",
              text: "International Standard Atmosphere (Isa)",
              numberOfQuestions: 7,
            },
            {
              id: "050.01.06",
              text: "Altimetry",
              numberOfQuestions: 208,
            },
          ],
        },
        {
          id: "050.02",
          text: "Wind",
          numberOfQuestions: 490,
          learningObjectives: [
            {
              id: "050.02.01",
              text: "Definition and measurement of wind",
              numberOfQuestions: 88,
            },
            {
              id: "050.02.02",
              text: "Primary cause of wind",
              numberOfQuestions: 128,
            },
            {
              id: "050.02.03",
              text: "General global circulation",
              numberOfQuestions: 31,
            },
            {
              id: "050.02.04",
              text: "Local winds",
              numberOfQuestions: 42,
            },
            {
              id: "050.02.05",
              text: "Mountain waves (standing waves, lee waves)",
              numberOfQuestions: 31,
            },
            {
              id: "050.02.06",
              text: "Turbulence",
              numberOfQuestions: 52,
            },
            {
              id: "050.02.07",
              text: "Jet streams",
              numberOfQuestions: 74,
            },
          ],
        },
        {
          id: "050.03",
          text: "Thermodynamics",
          numberOfQuestions: 185,
          learningObjectives: [
            {
              id: "050.03.01",
              text: "Humidity",
              numberOfQuestions: 59,
            },
            {
              id: "050.03.02",
              text: "Change of state of water",
              numberOfQuestions: 28,
            },
            {
              id: "050.03.03",
              text: "Adiabatic processes",
              numberOfQuestions: 80,
            },
          ],
        },
        {
          id: "050.04",
          text: "Clouds And Fog",
          numberOfQuestions: 291,
          learningObjectives: [
            {
              id: "050.04.01",
              text: "Cloud formation and description",
              numberOfQuestions: 151,
            },
            {
              id: "050.04.02",
              text: "Fog, mist, haze",
              numberOfQuestions: 112,
            },
          ],
        },
        {
          id: "050.05",
          text: "Precipitation",
          numberOfQuestions: 66,
          learningObjectives: [
            {
              id: "050.05.01",
              text: "Development of precipitation",
              numberOfQuestions: 11,
            },
            {
              id: "050.05.02",
              text: "Types of precipitation",
              numberOfQuestions: 46,
            },
          ],
        },
        {
          id: "050.06",
          text: "Air Masses And Fronts",
          numberOfQuestions: 434,
          learningObjectives: [
            {
              id: "050.06.01",
              text: "Air masses",
              numberOfQuestions: 64,
            },
            {
              id: "050.06.02",
              text: "Fronts",
              numberOfQuestions: 348,
            },
          ],
        },
        {
          id: "050.07",
          text: "Pressure Systems",
          numberOfQuestions: 140,
          learningObjectives: [
            {
              id: "050.07.01",
              text: "The principal pressure areas",
              numberOfQuestions: 8,
            },
            {
              id: "050.07.02",
              text: "Anticyclone",
              numberOfQuestions: 25,
            },
            {
              id: "050.07.03",
              text: "Non-frontal depressions",
              numberOfQuestions: 14,
            },
            {
              id: "050.07.04",
              text: "Tropical revolving storms",
              numberOfQuestions: 67,
            },
          ],
        },
        {
          id: "050.08",
          text: "Climatology",
          numberOfQuestions: 342,
          learningObjectives: [
            {
              id: "050.08.01",
              text: "Climatic zones",
              numberOfQuestions: 9,
            },
            {
              id: "050.08.02",
              text: "Tropical climatology",
              numberOfQuestions: 168,
            },
            {
              id: "050.08.03",
              text: "Typical weather situations in the mid-latitudes",
              numberOfQuestions: 120,
            },
            {
              id: "050.08.04",
              text: "Local winds and associated weather",
              numberOfQuestions: 26,
            },
          ],
        },
        {
          id: "050.09",
          text: "Flight Hazards",
          numberOfQuestions: 536,
          learningObjectives: [
            {
              id: "050.09.01",
              text: "Icing",
              numberOfQuestions: 197,
            },
            {
              id: "050.09.02",
              text: "Turbulence",
              numberOfQuestions: 61,
            },
            {
              id: "050.09.03",
              text: "Wind shear",
              numberOfQuestions: 49,
            },
            {
              id: "050.09.04",
              text: "Thunderstorms",
              numberOfQuestions: 111,
            },
            {
              id: "050.09.05",
              text: "Tornadoes",
              numberOfQuestions: 10,
            },
            {
              id: "050.09.06",
              text: "Inversions",
              numberOfQuestions: 1,
            },
            {
              id: "050.09.07",
              text: "Stratospheric conditions",
              numberOfQuestions: 6,
            },
            {
              id: "050.09.08",
              text: "Hazards in mountainous areas",
              numberOfQuestions: 16,
            },
            {
              id: "050.09.09",
              text: "Visibility-reducing phenomena",
              numberOfQuestions: 37,
            },
          ],
        },
        {
          id: "050.10",
          text: "Meteorological Information",
          numberOfQuestions: 549,
          learningObjectives: [
            {
              id: "050.10.01",
              text: "Observation",
              numberOfQuestions: 220,
            },
            {
              id: "050.10.02",
              text: "Weather charts",
              numberOfQuestions: 147,
            },
            {
              id: "050.10.03",
              text: "Information for flight planning",
              numberOfQuestions: 86,
            },
            {
              id: "050.10.04",
              text: "Meteorological services",
              numberOfQuestions: 24,
            },
          ],
        },
      ],
      numberOfQuestions: 3395,
    },
    {
      id: "061",
      courses: [],
      longName: "General Navigation",
      shortName: "GNav",
      numberOfExamQuestions: 55,
      numberOfExamMinutes: 135,
      learningObjectives: [
        {
          id: "061.01",
          text: "Basics Of Navigation",
          numberOfQuestions: 991,
          learningObjectives: [
            {
              id: "061.01.01",
              text: "The Earth",
              numberOfQuestions: 41,
            },
            {
              id: "061.01.02",
              text: "Position",
              numberOfQuestions: 36,
            },
            {
              id: "061.01.03",
              text: "Direction",
              numberOfQuestions: 224,
            },
            {
              id: "061.01.04",
              text: "Distance",
              numberOfQuestions: 155,
            },
            {
              id: "061.01.05",
              text: "Speed",
              numberOfQuestions: 268,
            },
            {
              id: "061.01.06",
              text: "Triangle of velocities (Tov)",
              numberOfQuestions: 1,
            },
            {
              id: "061.01.07",
              text: "Dead reckoning (Dr)",
              numberOfQuestions: 54,
            },
            {
              id: "061.01.08",
              text: "Navigation in climb and descent",
              numberOfQuestions: 171,
            },
          ],
        },
        {
          id: "061.02",
          text: "Visual Flight Rules (Vfr) Navigation",
          numberOfQuestions: 109,
          learningObjectives: [
            {
              id: "061.02.01",
              text: "Ground features",
              numberOfQuestions: 47,
            },
            {
              id: "061.02.02",
              text: "Vfr navigation techniques",
              numberOfQuestions: 46,
            },
          ],
        },
        {
          id: "061.03",
          text: "Great Circles And Rhumb Lines",
          numberOfQuestions: 128,
          learningObjectives: [
            {
              id: "061.03.01",
              text: "Great circles",
              numberOfQuestions: 73,
            },
            {
              id: "061.03.02",
              text: "Rhumb lines",
              numberOfQuestions: 14,
            },
            {
              id: "061.03.03",
              text: "Relationship",
              numberOfQuestions: 23,
            },
          ],
        },
        {
          id: "061.04",
          text: "Charts",
          numberOfQuestions: 431,
          learningObjectives: [
            {
              id: "061.04.01",
              text: "Chart requirements",
              numberOfQuestions: 64,
            },
            {
              id: "061.04.02",
              text: "Projections",
              numberOfQuestions: 228,
            },
            {
              id: "061.04.03",
              text: "Practical use",
              numberOfQuestions: 120,
            },
          ],
        },
        {
          id: "061.05",
          text: "Time",
          numberOfQuestions: 132,
          learningObjectives: [
            {
              id: "061.05.01",
              text: "Local Mean Time (Lmt)",
              numberOfQuestions: 22,
            },
            {
              id: "061.05.02",
              text: "Standard time",
              numberOfQuestions: 38,
            },
            {
              id: "061.05.03",
              text: "Sunrise and sunset",
              numberOfQuestions: 67,
            },
          ],
        },
      ],
      numberOfQuestions: 1692,
    },
    {
      id: "062",
      courses: [],
      longName: "Radio Navigation",
      shortName: "RNav",
      numberOfExamQuestions: 66,
      numberOfExamMinutes: 90,
      learningObjectives: [
        {
          id: "062.01",
          text: "Basic Radio Propagation Theory",
          numberOfQuestions: 29,
          learningObjectives: [
            {
              id: "062.01.01",
              text: "Basic principles",
              numberOfQuestions: 9,
            },
            {
              id: "062.01.02",
              text: "Antennas",
              numberOfQuestions: 8,
            },
            {
              id: "062.01.03",
              text: "Wave propagation",
              numberOfQuestions: 5,
            },
          ],
        },
        {
          id: "062.02",
          text: "Radio Aids",
          numberOfQuestions: 169,
          learningObjectives: [
            {
              id: "062.02.01",
              text: "Ground direction finding (Df)",
              numberOfQuestions: 11,
            },
            {
              id: "062.02.02",
              text: "Non-directional radio beacon (Ndb)/automatic direction finding (Adf)",
              numberOfQuestions: 31,
            },
            {
              id: "062.02.03",
              text: "Vhf omnidirectional radio range (Vor):\n-  conventional Vor (Cvor) and Doppler Vor (Dvor)",
              numberOfQuestions: 48,
            },
            {
              id: "062.02.04",
              text: "Distance-measuring equipment (Dme)",
              numberOfQuestions: 29,
            },
            {
              id: "062.02.05",
              text: "Instrument landing system (Ils)",
              numberOfQuestions: 34,
            },
            {
              id: "062.02.06",
              text: "Microwave landing system (Mls) ",
              numberOfQuestions: 10,
            },
          ],
        },
        {
          id: "062.03",
          text: "Radar",
          numberOfQuestions: 50,
          learningObjectives: [
            {
              id: "062.03.01",
              text: "Pulse techniques ",
              numberOfQuestions: 6,
            },
            {
              id: "062.03.02",
              text: "Ground radar",
              numberOfQuestions: 2,
            },
            {
              id: "062.03.03",
              text: "Airborne weather radar",
              numberOfQuestions: 23,
            },
            {
              id: "062.03.04",
              text: "Secondary surveillance radar and transponder",
              numberOfQuestions: 19,
            },
          ],
        },
        {
          id: "062.06",
          text: "Global Navigation Satellite Systems (GNSSs)",
          numberOfQuestions: 67,
          learningObjectives: [
            {
              id: "062.06.01",
              text: "Global navigation satellite systems (GNSSs)",
              numberOfQuestions: 35,
            },
            {
              id: "062.06.02",
              text: "Ground-, satellite- and aircraft-based augmentation systems ",
              numberOfQuestions: 29,
            },
          ],
        },
        {
          id: "062.07",
          text: "Performance-Based Navigation (Pbn)",
          numberOfQuestions: 75,
          learningObjectives: [
            {
              id: "062.07.01",
              text: "Performance-based navigation (Pbn) concept (as described in Icao Doc 9613)",
              numberOfQuestions: 22,
            },
            {
              id: "062.07.02",
              text: "Navigation specifications",
              numberOfQuestions: 22,
            },
            {
              id: "062.07.03",
              text: "Use of performance-based navigation (Pbn)",
              numberOfQuestions: 3,
            },
            {
              id: "062.07.04",
              text: "Performance-based navigation (Pbn) operations",
              numberOfQuestions: 4,
            },
            {
              id: "062.07.05",
              text: "Requirements of specific Rnav and Rnp specifications",
              numberOfQuestions: 20,
            },
          ],
        },
      ],
      numberOfQuestions: 370,
    },
    {
      id: "070",
      courses: [],
      longName: "Operational Procedures",
      shortName: "OPS",
      numberOfExamQuestions: 42,
      numberOfExamMinutes: 75,
      learningObjectives: [
        {
          id: "071.01",
          text: "General Requirements ",
          numberOfQuestions: 1272,
          learningObjectives: [
            {
              id: "071.01.01",
              text: "Icao Annex 6",
              numberOfQuestions: 29,
            },
            {
              id: "071.01.02",
              text: "Operational requirements ",
              numberOfQuestions: 699,
            },
            {
              id: "071.01.03",
              text: "Long-range flights",
              numberOfQuestions: 368,
            },
          ],
        },
        {
          id: "071.02",
          text: "Special Operational Procedures And Hazards - General Aspects",
          numberOfQuestions: 903,
          learningObjectives: [
            {
              id: "071.02.01",
              text: "Operations manual ",
              numberOfQuestions: 62,
            },
            {
              id: "071.02.02",
              text: "Icing conditions",
              numberOfQuestions: 145,
            },
            {
              id: "071.02.03",
              text: "Bird-strike risk ",
              numberOfQuestions: 28,
            },
            {
              id: "071.02.04",
              text: "Noise abatement",
              numberOfQuestions: 56,
            },
            {
              id: "071.02.05",
              text: "Fire and smoke",
              numberOfQuestions: 103,
            },
            {
              id: "071.02.06",
              text: "Decompression of pressurised cabin",
              numberOfQuestions: 23,
            },
            {
              id: "071.02.07",
              text: "Wind shear and microburst",
              numberOfQuestions: 76,
            },
            {
              id: "071.02.08",
              text: "Wake turbulence",
              numberOfQuestions: 47,
            },
            {
              id: "071.02.09",
              text: "Security (unlawful events)",
              numberOfQuestions: 34,
            },
            {
              id: "071.02.10",
              text: "Emergency and precautionary landing, and ditching",
              numberOfQuestions: 37,
            },
            {
              id: "071.02.11",
              text: "Fuel jettisoning",
              numberOfQuestions: 21,
            },
            {
              id: "071.02.12",
              text: "Transport of dangerous goods by air",
              numberOfQuestions: 123,
            },
            {
              id: "071.02.13",
              text: "Contaminated runways",
              numberOfQuestions: 59,
            },
            {
              id: "071.02.14",
              text: "Rotor downwash",
              numberOfQuestions: 2,
            },
            {
              id: "071.02.15",
              text: "Operation influence by meteorological conditions (helicopter)",
              numberOfQuestions: 6,
            },
          ],
        },
        {
          id: "071.03",
          text: "Emergency Procedures (Helicopter)",
          numberOfQuestions: 0,
          learningObjectives: [
            {
              id: "071.03.01",
              text: "Influence of technical problems",
              numberOfQuestions: 0,
            },
          ],
        },
        {
          id: "071.04",
          text: "Specialised Operations",
          numberOfQuestions: 131,
          learningObjectives: [
            {
              id: "071.04.01",
              text: "Specialised Operations (Regulation (Eu) No 965/2012 on air operations, as amended)",
              numberOfQuestions: 21,
            },
          ],
        },
      ],
      numberOfQuestions: 1939,
    },
    {
      id: "081",
      courses: [],
      longName: "Principles Of Flight - Aeroplanes",
      shortName: "POF",
      numberOfExamQuestions: 46,
      numberOfExamMinutes: 90,
      learningObjectives: [
        {
          id: "081.01",
          text: "Subsonic Aerodynamics",
          numberOfQuestions: 894,
          learningObjectives: [
            {
              id: "081.01.01",
              text: "Basics, laws and definitions",
              numberOfQuestions: 279,
            },
            {
              id: "081.01.02",
              text: "Two-dimensional airflow around an aerofoil",
              numberOfQuestions: 37,
            },
            {
              id: "081.01.03",
              text: "Coefficients",
              numberOfQuestions: 41,
            },
            {
              id: "081.01.04",
              text: "Three-dimensional airflow around an aeroplane",
              numberOfQuestions: 139,
            },
            {
              id: "081.01.05",
              text: "Total drag",
              numberOfQuestions: 67,
            },
            {
              id: "081.01.06",
              text: "Ground effect",
              numberOfQuestions: 42,
            },
            {
              id: "081.01.07",
              text: "The relationship between lift coefficient and speed in steady, straight, and level flight",
              numberOfQuestions: 44,
            },
            {
              id: "081.01.09",
              text: "Clmax augmentation",
              numberOfQuestions: 138,
            },
            {
              id: "081.01.10",
              text: "Means to reduce the Cl-Cd ratio",
              numberOfQuestions: 13,
            },
            {
              id: "081.01.12",
              text: "Aerodynamic degradation",
              numberOfQuestions: 39,
            },
          ],
        },
        {
          id: "081.02",
          text: "High-Speed Aerodynamics",
          numberOfQuestions: 306,
          learningObjectives: [
            {
              id: "081.02.01",
              text: "Speeds",
              numberOfQuestions: 111,
            },
            {
              id: "081.02.02",
              text: "Shock waves",
              numberOfQuestions: 45,
            },
            {
              id: "081.02.03",
              text: "Effects of exceeding the critical Mach number (Mcrit)",
              numberOfQuestions: 89,
            },
            {
              id: "081.02.05",
              text: "Means to influence critical Mach number (Mcrit)",
              numberOfQuestions: 37,
            },
          ],
        },
        {
          id: "081.03",
          text: "Stall, Mach tuck, and upset prevention and recovery",
          numberOfQuestions: 345,
          learningObjectives: [
            {
              id: "081.03.01",
              text: "The stall",
              numberOfQuestions: 226,
            },
            {
              id: "081.03.02",
              text: "Buffet onset boundary",
              numberOfQuestions: 37,
            },
            {
              id: "081.03.03",
              text: "Situations in which buffet or stall could occur",
              numberOfQuestions: 15,
            },
            {
              id: "081.03.04",
              text: "Recognition of stalled condition",
              numberOfQuestions: 29,
            },
          ],
        },
        {
          id: "081.04",
          text: "Stability",
          numberOfQuestions: 247,
          learningObjectives: [
            {
              id: "081.04.01",
              text: "Static and dynamic stability",
              numberOfQuestions: 28,
            },
            {
              id: "081.04.03",
              text: "Static and dynamic longitudinal stability",
              numberOfQuestions: 106,
            },
            {
              id: "081.04.04",
              text: "Static directional stability",
              numberOfQuestions: 40,
            },
            {
              id: "081.04.05",
              text: "Static lateral stability",
              numberOfQuestions: 32,
            },
            {
              id: "081.04.06",
              text: "Dynamic lateral/directional stability",
              numberOfQuestions: 23,
            },
          ],
        },
        {
          id: "081.05",
          text: "Control",
          numberOfQuestions: 212,
          learningObjectives: [
            {
              id: "081.05.01",
              text: "General",
              numberOfQuestions: 13,
            },
            {
              id: "081.05.02",
              text: "Pitch (longitudinal) control",
              numberOfQuestions: 23,
            },
            {
              id: "081.05.03",
              text: "Yaw (directional) control",
              numberOfQuestions: 5,
            },
            {
              id: "081.05.04",
              text: "Roll (lateral) control",
              numberOfQuestions: 57,
            },
            {
              id: "081.05.05",
              text: "Roll/yaw interaction",
              numberOfQuestions: 3,
            },
            {
              id: "081.05.06",
              text: "Means to reduce control forces",
              numberOfQuestions: 17,
            },
            {
              id: "081.05.07",
              text: "Fly-by-wire (Fbw)",
              numberOfQuestions: 9,
            },
            {
              id: "081.05.08",
              text: "Trimming",
              numberOfQuestions: 68,
            },
          ],
        },
        {
          id: "081.06",
          text: "Limitations",
          numberOfQuestions: 176,
          learningObjectives: [
            {
              id: "081.06.01",
              text: "Operating limitations",
              numberOfQuestions: 40,
            },
            {
              id: "081.06.02",
              text: "Manoeuvring envelope",
              numberOfQuestions: 37,
            },
            {
              id: "081.06.03",
              text: "Gust envelope",
              numberOfQuestions: 83,
            },
          ],
        },
        {
          id: "081.07",
          text: "Propellers",
          numberOfQuestions: 241,
          learningObjectives: [
            {
              id: "081.07.01",
              text: "Conversion of engine torque to thrust",
              numberOfQuestions: 113,
            },
            {
              id: "081.07.02",
              text: "Engine failure",
              numberOfQuestions: 12,
            },
            {
              id: "081.07.03",
              text: "Design features for power absorption",
              numberOfQuestions: 17,
            },
            {
              id: "081.07.04",
              text: "Secondary effects of propellers",
              numberOfQuestions: 87,
            },
          ],
        },
        {
          id: "081.08",
          text: "Flight Mechanics",
          numberOfQuestions: 427,
          learningObjectives: [
            {
              id: "081.08.01",
              text: "Forces acting on an aeroplane",
              numberOfQuestions: 271,
            },
            {
              id: "081.08.02",
              text: "Asymmetric thrust",
              numberOfQuestions: 115,
            },
            {
              id: "081.08.03",
              text: "Significant points on a polar curve",
              numberOfQuestions: 13,
            },
          ],
        },
      ],
      numberOfQuestions: 2640,
    },
    {
      id: "082",
      courses: [],
      longName: "Principles Of Flight - Helicopters",
      shortName: "POF(H)",
      numberOfExamQuestions: 46,
      numberOfExamMinutes: 90,
      learningObjectives: [
        {
          id: "082.01",
          text: "Subsonic Aerodynamics ",
          numberOfQuestions: 0,
          learningObjectives: [
            {
              id: "082.01.01",
              text: "Basic concepts, laws and definitions",
              numberOfQuestions: 0,
            },
            {
              id: "082.01.02",
              text: "Two-dimensional airflow",
              numberOfQuestions: 0,
            },
            {
              id: "082.01.03",
              text: "Three-dimensional airflow around a blade ",
              numberOfQuestions: 0,
            },
          ],
        },
        {
          id: "082.02",
          text: "Transonic Aerodynamics and Compressibility Effects",
          numberOfQuestions: 0,
          learningObjectives: [
            {
              id: "082.02.01",
              text: "Airflow speeds and velocities",
              numberOfQuestions: 0,
            },
          ],
        },
        {
          id: "082.03",
          text: "Rotorcraft Types",
          numberOfQuestions: 0,
          learningObjectives: [
            {
              id: "082.03.01",
              text: "Rotorcraft",
              numberOfQuestions: 0,
            },
            {
              id: "082.03.02",
              text: "Helicopters",
              numberOfQuestions: 0,
            },
          ],
        },
        {
          id: "082.04",
          text: "Main-Rotor Aerodynamics",
          numberOfQuestions: 0,
          learningObjectives: [
            {
              id: "082.04.01",
              text: "Hover flight outside ground effect ",
              numberOfQuestions: 0,
            },
            {
              id: "082.04.02",
              text: "Vertical climb",
              numberOfQuestions: 0,
            },
            {
              id: "082.04.03",
              text: "Forward flight",
              numberOfQuestions: 0,
            },
            {
              id: "082.04.04",
              text: "Hover and forward flight in ground effect ",
              numberOfQuestions: 0,
            },
            {
              id: "082.04.05",
              text: "Vertical descent",
              numberOfQuestions: 0,
            },
            {
              id: "082.04.06",
              text: "Forward flight - autorotation",
              numberOfQuestions: 0,
            },
          ],
        },
        {
          id: "082.05",
          text: "Main-Rotor Mechanics",
          numberOfQuestions: 0,
          learningObjectives: [
            {
              id: "082.05.01",
              text: "Flapping of the blade in hover",
              numberOfQuestions: 0,
            },
            {
              id: "082.05.02",
              text: "Flapping angles of the blade in forward flight",
              numberOfQuestions: 0,
            },
            {
              id: "082.05.03",
              text: "Blade-lag motion in forward flight",
              numberOfQuestions: 0,
            },
            {
              id: "082.05.04",
              text: "Rotor systems",
              numberOfQuestions: 0,
            },
            {
              id: "082.05.05",
              text: "Blade sailing",
              numberOfQuestions: 0,
            },
            {
              id: "082.05.06",
              text: "Vibrations due to main rotor",
              numberOfQuestions: 0,
            },
          ],
        },
        {
          id: "082.06",
          text: "Tail Rotors",
          numberOfQuestions: 0,
          learningObjectives: [
            {
              id: "082.06.01",
              text: "Conventional tail rotor",
              numberOfQuestions: 0,
            },
          ],
        },
        {
          id: "082.07",
          text: "Equilibrium, Stability And Control",
          numberOfQuestions: 0,
          learningObjectives: [
            {
              id: "082.07.01",
              text: "Equilibrium and helicopter attitudes",
              numberOfQuestions: 0,
            },
            {
              id: "082.07.02",
              text: "Stability",
              numberOfQuestions: 0,
            },
            {
              id: "082.07.03",
              text: "Control",
              numberOfQuestions: 0,
            },
          ],
        },
        {
          id: "082.08",
          text: "Helicopter Flight Mechanics",
          numberOfQuestions: 0,
          learningObjectives: [
            {
              id: "082.08.01",
              text: "Flight limits",
              numberOfQuestions: 0,
            },
            {
              id: "082.08.02",
              text: "Special conditions",
              numberOfQuestions: 0,
            },
          ],
        },
      ],
      numberOfQuestions: 0,
    },
    {
      id: "090",
      courses: [],
      longName: "Communications",
      shortName: "Coms",
      numberOfExamQuestions: 34,
      numberOfExamMinutes: 45,
      learningObjectives: [
        {
          id: "090.01",
          text: "Concepts",
          numberOfQuestions: 114,
          learningObjectives: [
            {
              id: "090.01.01",
              text: "Associated terms",
              numberOfQuestions: 84,
            },
          ],
        },
        {
          id: "090.02",
          text: "General Operating Procedures",
          numberOfQuestions: 661,
          learningObjectives: [
            {
              id: "090.02.01",
              text: "Transmission standards",
              numberOfQuestions: 603,
            },
          ],
        },
        {
          id: "090.03",
          text: "Relevant Weather Information ",
          numberOfQuestions: 87,
          learningObjectives: [
            {
              id: "090.03.01",
              text: "Aerodrome weather",
              numberOfQuestions: 72,
            },
          ],
        },
        {
          id: "090.04",
          text: "Voice Communication Failure",
          numberOfQuestions: 240,
          learningObjectives: [
            {
              id: "090.04.01",
              text: "Required action",
              numberOfQuestions: 231,
            },
          ],
        },
        {
          id: "090.05",
          text: "Distress And Urgency Procedures",
          numberOfQuestions: 143,
          learningObjectives: [
            {
              id: "090.05.01",
              text: "Signals and procedures",
              numberOfQuestions: 133,
            },
          ],
        },
        {
          id: "090.06",
          text: "Vhf Propagation And Allocation Of Frequencies",
          numberOfQuestions: 126,
          learningObjectives: [
            {
              id: "090.06.01",
              text: "General principles",
              numberOfQuestions: 107,
            },
          ],
        },
        {
          id: "090.07",
          text: "Other communications",
          numberOfQuestions: 78,
          learningObjectives: [
            {
              id: "090.07.01",
              text: "Weather observations, Morse code",
              numberOfQuestions: 68,
            },
          ],
        },
      ],
      numberOfQuestions: 1298,
    },
  ],
};
