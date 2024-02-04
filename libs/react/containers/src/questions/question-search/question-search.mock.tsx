import type { AppRouterOutput } from "@chair-flight/trpc/server";

export const mockData: AppRouterOutput["containers"]["questions"]["getQuestionSearch"] =
  {
    filters: {
      subject: [
        { id: "all", text: "All Subjects" },
        { id: "010", text: "010 - ALaw" },
        { id: "021", text: "021 - AGK" },
        { id: "022", text: "022 - Instruments" },
        { id: "031", text: "031 - M&B" },
        { id: "032", text: "032 - Perf" },
        { id: "033", text: "033 - FPM" },
        { id: "034", text: "034 - Perf(H)" },
        { id: "040", text: "040 - HPL" },
        { id: "050", text: "050 - Met" },
        { id: "061", text: "061 - GNav" },
        { id: "062", text: "062 - RNav" },
        { id: "070", text: "070 - OPS" },
        { id: "081", text: "081 - POF" },
        { id: "082", text: "082 - POF(H)" },
        { id: "090", text: "090 - Coms" },
      ],
      searchField: [
        { id: "all", text: "All Fields" },
        { id: "questionId", text: "Question ID" },
        { id: "learningObjectives", text: "Learning Objectives" },
        { id: "text", text: "Text" },
        { id: "externalIds", text: "External IDs" },
      ],
    },
  };

export const mockSearchData: AppRouterOutput["common"]["search"]["searchQuestions"] =
  {
    items: [
      {
        questionBank: "atpl",
        id: "dsLWKxr9",
        questionId: "Q000YBA1ON",
        variantId: "dsLWKxr9",
        text: "Annex 14 to the convention on international civil aviation contains SARPS for:\n\n- :white_check_mark: aerodromes.\n- :x: security.\n- :x: facilitation.\n- :x: none of the above.",
        subjects: ["010"],
        learningObjectives: [
          {
            name: "010.01",
            href: "/modules/[object Object]/learning-objectives/010.01",
          },
        ],
        externalIds: ["AVEXAM-67778", "ATPLGS-622143", "AVEXAM-67778"],
        href: "/modules/[object Object]/questions/Q000YBA1ON?variantId=dsLWKxr9",
      },
      {
        questionBank: "atpl",
        id: "KzjKpEMN",
        questionId: "Q0JGOZVR7S",
        variantId: "KzjKpEMN",
        text: "The body of ICAO that considers and recommends modifications to the Annexes of the Convention to the ICAO Council is the\n\n- :white_check_mark: Air Navigation Commission.\n- :x: Legal Committee.\n- :x: Assembly.\n- :x: Transport Committee.",
        subjects: ["010"],
        learningObjectives: [
          {
            name: "010.01.01.03.02",
            href: "/modules/[object Object]/learning-objectives/010.01.01.03.02",
          },
        ],
        externalIds: ["ATPLGS-118695", "ATPLQ-107886"],
        href: "/modules/[object Object]/questions/Q0JGOZVR7S?variantId=KzjKpEMN",
      },
      {
        questionBank: "atpl",
        id: "Yx4c25Yw",
        questionId: "Q0LY5P7KSB",
        variantId: "Yx4c25Yw",
        text: "What does EU Commission Implementing Regulation (EU) 2017/373 refer to?\n\n- :white_check_mark: ATM and Air Navigation Services\n- :x: Commercial Air Transport\n- :x: Transport of Dangerous Goods\n- :x: Aerodrome design and runway markings",
        subjects: ["010"],
        learningObjectives: [
          {
            name: "010.01.04.02.01",
            href: "/modules/[object Object]/learning-objectives/010.01.04.02.01",
          },
        ],
        externalIds: ["ATPLGS-627741"],
        href: "/modules/[object Object]/questions/Q0LY5P7KSB?variantId=Yx4c25Yw",
      },
      {
        questionBank: "atpl",
        id: "FgtF7in7",
        questionId: "Q1CSODOI5C",
        variantId: "FgtF7in7",
        text: "Who issues the certificate of airworthiness?\n\n- :white_check_mark: State of registry\n- :x: ICAO\n- :x: Operator\n- :x: State of design.",
        subjects: ["010"],
        learningObjectives: [
          {
            name: "010.01.01.02.04",
            href: "/modules/[object Object]/learning-objectives/010.01.01.02.04",
          },
        ],
        externalIds: ["ATPLGS-103776"],
        href: "/modules/[object Object]/questions/Q1CSODOI5C?variantId=FgtF7in7",
      },
      {
        questionBank: "atpl",
        id: "UwaMCErx",
        questionId: "Q1XSGFH9NV",
        variantId: "UwaMCErx",
        text: "The president of the ICAO Council is elected for\n\n- :white_check_mark: 3 years.\n- :x: 1 year.\n- :x: 5 years.\n- :x: 10 years.",
        subjects: ["010"],
        learningObjectives: [
          {
            name: "010.01.01.03.01",
            href: "/modules/[object Object]/learning-objectives/010.01.01.03.01",
          },
        ],
        externalIds: ["ATPLGS-103733", "AVEXAM-40558", "ATPLQ-105951"],
        href: "/modules/[object Object]/questions/Q1XSGFH9NV?variantId=UwaMCErx",
      },
      {
        questionBank: "atpl",
        id: "dlzPJRKF",
        questionId: "Q26L3WKZ61",
        variantId: "dlzPJRKF",
        text: "Which of the following is obligating for members of ICAO?\n\n- :white_check_mark: ICAO must be informed about differences from the standards in any of the Annexes to the convention.\n- :x: ICAO shall approve the pricing of tickets on international airline connections\n- :x: ICAO must be informed about changes in the national regulations\n- :x: ICAO must be informed about new flight crew licenses and any suspended validity of such licenses",
        subjects: ["010"],
        learningObjectives: [
          {
            name: "010.01.01.03.01",
            href: "/modules/[object Object]/learning-objectives/010.01.01.03.01",
          },
        ],
        externalIds: ["BGS-100002", "ATPLGS-103724"],
        href: "/modules/[object Object]/questions/Q26L3WKZ61?variantId=dlzPJRKF",
      },
      {
        questionBank: "atpl",
        id: "0OGUgcI5",
        questionId: "Q2CGFE1OCO",
        variantId: "0OGUgcI5",
        text: "The Convention signed by the States, to ensure adequate compensation for persons who suffer damage caused on the surface by foreign aircraft, is the\n\n- :white_check_mark: Rome Convention 1933/1952.\n- :x: Warsaw Convention 1929.\n- :x: Paris Convention 1919.\n- :x: Tokyo Convention 1963.",
        subjects: ["010"],
        learningObjectives: [
          {
            name: "010.01.01.01.01",
            href: "/modules/[object Object]/learning-objectives/010.01.01.01.01",
          },
        ],
        externalIds: ["ATPLGS-118704", "ATPLGS-103761"],
        href: "/modules/[object Object]/questions/Q2CGFE1OCO?variantId=0OGUgcI5",
      },
      {
        questionBank: "atpl",
        id: "U9SzIdTc",
        questionId: "Q39QM81P5Y",
        variantId: "U9SzIdTc",
        text: "What does the acronym IATA stand for?\n\n- :white_check_mark: International Air Transport Association\n- :x: International Airline Training Association\n- :x: International Airline Trade Agreement\n- :x: International Air Trade Agreement",
        subjects: ["010"],
        learningObjectives: [
          {
            name: "010.01.03.01.01",
            href: "/modules/[object Object]/learning-objectives/010.01.03.01.01",
          },
        ],
        externalIds: ["BGS-100656", "ATPLQ-103684"],
        href: "/modules/[object Object]/questions/Q39QM81P5Y?variantId=U9SzIdTc",
      },
      {
        questionBank: "atpl",
        id: "Zr5RJ8OD",
        questionId: "Q3XNN22GER",
        variantId: "Zr5RJ8OD",
        text: "The convention on offenses and certain acts committed on board aircraft, is called\n\n- :white_check_mark: the Convention of Tokyo.\n- :x: the Convention of Chicago.\n- :x: the Convention of Rome.\n- :x: the Convention of Paris.",
        subjects: ["010"],
        learningObjectives: [
          {
            name: "010.01.01.01.01",
            href: "/modules/[object Object]/learning-objectives/010.01.01.01.01",
          },
        ],
        externalIds: ["ATPLGS-103763"],
        href: "/modules/[object Object]/questions/Q3XNN22GER?variantId=Zr5RJ8OD",
      },
      {
        questionBank: "atpl",
        id: "0kg8NKOx",
        questionId: "Q3XNYTOH0S",
        variantId: "0kg8NKOx",
        text: "If a state finds that it is impracticable to comply with an International Standard:\n\n- :white_check_mark: it shall give immediate notice to ICAO of the differences between its own practices and the International Standard.\n- :x: it shall give 45 days notice to ICAO of the differences between its own practices and the International Standard.\n- :x: it shall give 90 days notice to ICAO of the differences between its own practices and the International Standard.\n- :x: it shall give 60 days notice to ICAO of the differences between its own practices and the International Standard.",
        subjects: ["010"],
        learningObjectives: [
          {
            name: "010.01.01.03.01",
            href: "/modules/[object Object]/learning-objectives/010.01.01.03.01",
          },
        ],
        externalIds: ["AVEXAM-50042", "ATPLQ-108654"],
        href: "/modules/[object Object]/questions/Q3XNYTOH0S?variantId=0kg8NKOx",
      },
      {
        questionBank: "atpl",
        id: "sbeyrHkr",
        questionId: "Q3XNYTOH0S",
        variantId: "sbeyrHkr",
        text: "If a state finds that it is impracticable to comply with an International Standard:\n\n- :white_check_mark: It shall give immediate notice to ICAO of the differences\nbetween its own practices and the International Standard\n- :x: It shall give 90 days notice to ICAO of the differences\nbetween its own practices and the International\nStandard.\n- :x: It shall give 60 days notice to ICAO of the differences\nbetween its own practices and the International\nStandard.\n- :x: It shall give 45 days notice to ICAO of the differences\nbetween its own practices and the International\nStandard.",
        subjects: ["010"],
        learningObjectives: [
          {
            name: "010.01.01.03.01",
            href: "/modules/[object Object]/learning-objectives/010.01.01.03.01",
          },
        ],
        externalIds: ["BGS-100531", "ATPLQ-108654", "AVEXAM-50042"],
        href: "/modules/[object Object]/questions/Q3XNYTOH0S?variantId=sbeyrHkr",
      },
      {
        questionBank: "atpl",
        id: "XfHnUgu8",
        questionId: "Q3YFO0WJ1I",
        variantId: "XfHnUgu8",
        text: "The ICAO Annex dealing with the registration and marking of aircraft is\n\n- :white_check_mark: Annex 7.\n- :x: Annex 11.\n- :x: Annex 14.\n- :x: Annex 6.",
        subjects: ["010"],
        learningObjectives: [
          {
            name: "010.01.01.03.01",
            href: "/modules/[object Object]/learning-objectives/010.01.01.03.01",
          },
        ],
        externalIds: ["ATPLGS-103734"],
        href: "/modules/[object Object]/questions/Q3YFO0WJ1I?variantId=XfHnUgu8",
      },
      {
        questionBank: "atpl",
        id: "l5Xt6xav",
        questionId: "Q3ZP858O4I",
        variantId: "l5Xt6xav",
        text: "When letters are used for the registration mark, combinations shall not be used which might be confused with the\n\n- :white_check_mark: five letter combinations used in the international code of signals.\n- :x: three letters combinations used in the international code of signals.\n- :x: letters used for an ICAO identification documents.\n- :x: four letter combinations beginning with Q.",
        subjects: ["010"],
        learningObjectives: [
          {
            name: "010.01.01.02.04",
            href: "/modules/[object Object]/learning-objectives/010.01.01.02.04",
          },
        ],
        externalIds: ["ATPLGS-103793"],
        href: "/modules/[object Object]/questions/Q3ZP858O4I?variantId=l5Xt6xav",
      },
      {
        questionBank: "atpl",
        id: "agc5I80m",
        questionId: "Q42BT8RS09",
        variantId: "agc5I80m",
        text: "The Basic Regulation refers to a...\n\n- :white_check_mark: Binding rule adopted by the European Parliament and the Council, establishing the EASA.\n- :x: Binding rule adopted by the EASA, establishing Acceptable Means of Compliance.\n- :x: Non-Binding rule adopted by EASA, establishing implementing Acts and Delegated Acts.\n- :x: Non-Binding rule adopted by the European Commission, establishing aeronautical rules and basic standards.",
        subjects: ["010"],
        learningObjectives: [
          {
            name: "010.01.04.01.04",
            href: "/modules/[object Object]/learning-objectives/010.01.04.01.04",
          },
        ],
        externalIds: ["ATPLQ-106124"],
        href: "/modules/[object Object]/questions/Q42BT8RS09?variantId=agc5I80m",
      },
      {
        questionBank: "atpl",
        id: "ffE6cBEY",
        questionId: "Q4C6S9NWGH",
        variantId: "ffE6cBEY",
        text: "What are the three stages for an aircraft considered to be in a state of emergency?\n\n- :white_check_mark: Uncertainty, alert, and distress.\n- :x: Uncertainty, alert, distress and urgency.\n- :x: Uncertainty, urgency, and distress.\n- :x: Uncertainty, distress, and adversity.",
        subjects: ["010"],
        learningObjectives: [
          {
            name: "010.01",
            href: "/modules/[object Object]/learning-objectives/010.01",
          },
        ],
        externalIds: ["ATPLGS-119079", "ATPLQ-109350"],
        href: "/modules/[object Object]/questions/Q4C6S9NWGH?variantId=ffE6cBEY",
      },
      {
        questionBank: "atpl",
        id: "pKqD25YY",
        questionId: "Q4DIWPPO56",
        variantId: "pKqD25YY",
        text: "When letters are used for registration mark, a combination that can be used and which should not be confused with other signals, would be for example\n\n- :white_check_mark: VOR\n- :x: TTT\n- :x: QNH\n- :x: SOS",
        subjects: ["010"],
        learningObjectives: [
          {
            name: "010.01.01.02.01",
            href: "/modules/[object Object]/learning-objectives/010.01.01.02.01",
          },
        ],
        externalIds: ["ATPLGS-103792"],
        href: "/modules/[object Object]/questions/Q4DIWPPO56?variantId=pKqD25YY",
      },
      {
        questionBank: "atpl",
        id: "wtA8d89r",
        questionId: "Q55RQ6Y7VN",
        variantId: "wtA8d89r",
        text: "The regulatory material related to air safety and managed by EASA includes:\n\n- :white_check_mark: Hard and soft law\n- :x: Hard norms and soft implementing rules\n- :x: Hard rules and decrees\n- :x: High requirements and low requirements",
        subjects: ["010"],
        learningObjectives: [
          {
            name: "010.01.04.01.03",
            href: "/modules/[object Object]/learning-objectives/010.01.04.01.03",
          },
        ],
        externalIds: ["BGS-101379", "ATPLQ-106857"],
        href: "/modules/[object Object]/questions/Q55RQ6Y7VN?variantId=wtA8d89r",
      },
      {
        questionBank: "atpl",
        id: "5qFz0bUI",
        questionId: "Q5BMMU05JE",
        variantId: "5qFz0bUI",
        text: "A scheduled flight from Singapore to Thailand has the right to fly over Malaysia WITHOUT landing, and to land in Malaysia for non-traffic purposes. These rights are granted by the _____ Freedoms of the Air:\n\n- :white_check_mark: First and Second.\n- :x: Third and Fourth.\n- :x: First and Fifth.\n- :x: Second and Third.",
        subjects: ["010"],
        learningObjectives: [
          {
            name: "010.01.01.02.03",
            href: "/modules/[object Object]/learning-objectives/010.01.01.02.03",
          },
        ],
        externalIds: ["ATPLQ-102418"],
        href: "/modules/[object Object]/questions/Q5BMMU05JE?variantId=5qFz0bUI",
      },
      {
        questionBank: "atpl",
        id: "76JDNUGB",
        questionId: "Q5I3O2GYHX",
        variantId: "76JDNUGB",
        text: "State who on board an aircraft is primarily responsible for the operation of the aircraft in accordance with the Rules of the Air\n\n- :white_check_mark: The pilot-in-command.\n- :x: The operator.\n- :x: The senior cabin crew member.\n- :x: The safety manager.",
        subjects: ["010"],
        learningObjectives: [
          {
            name: "010.01.02.03.01",
            href: "/modules/[object Object]/learning-objectives/010.01.02.03.01",
          },
        ],
        externalIds: ["ATPLGS-103883"],
        href: "/modules/[object Object]/questions/Q5I3O2GYHX?variantId=76JDNUGB",
      },
      {
        questionBank: "atpl",
        id: "iKVZT0rC",
        questionId: "Q5TZDYZHXG",
        variantId: "iKVZT0rC",
        text: "The International Civil Aviation Organisation (ICAO) establishes:\n\n- :white_check_mark: Standards and recommended international practices for\ncontracting member states.\n- :x: Aeronautical standards adopted by all states.\n- :x: Proposals for aeronautical regulations in the form of 18\nannexes.\n- :x: Standards and recommended practices applied without\nexception by all states, signatory to the Chicago\nconvention.",
        subjects: ["010"],
        learningObjectives: [
          {
            name: "010.01.01.03.01",
            href: "/modules/[object Object]/learning-objectives/010.01.01.03.01",
          },
        ],
        externalIds: [
          "BGS-100006",
          "ATPLQ-106130",
          "AVEXAM-28471",
          "ATPLGS-118694",
          "ATPLGS-103719",
        ],
        href: "/modules/[object Object]/questions/Q5TZDYZHXG?variantId=iKVZT0rC",
      },
      {
        questionBank: "atpl",
        id: "stZ73I8h",
        questionId: "Q64Z2CM3AC",
        variantId: "stZ73I8h",
        text: "Contracting States shall not require the authorized agent or pilot-in-command to deliver to the public authorities concerned, before departure of the aircraft, more than some copies of General Declaration, Cargo Manifest and stores list\nThe numbers of the copies are\n\n- :white_check_mark: 3 of each.\n- :x: 2 copies of General Declaration and of Cargo Manifest and of a stores list.\n- :x: 2 of each.\n- :x: 2 copies of General Declarations and Cargo Manifest and one copy of a simple stores list.",
        subjects: ["010"],
        learningObjectives: [
          {
            name: "010.01.01.02.04",
            href: "/modules/[object Object]/learning-objectives/010.01.01.02.04",
          },
        ],
        externalIds: ["ATPLGS-104676", "AVEXAM-96674"],
        href: "/modules/[object Object]/questions/Q64Z2CM3AC?variantId=stZ73I8h",
      },
      {
        questionBank: "atpl",
        id: "icKGE46Q",
        questionId: "Q6C0N5RDTX",
        variantId: "icKGE46Q",
        text: "What is the difference between hard and soft law?\n\n- :white_check_mark: Hard laws are legal obligations while soft laws only provide more details about the hard laws.\n- :x: Hard laws can contain documents such as certification specifications and guidance material, while soft laws contain regulations and implementing rules.\n- :x: Soft laws are the latest features fly-by-wire aircraft need to be fitted with, whereas hard laws refer mainly to mechanically driven flight controls.\n- :x: Hard laws are applied by force to the operators whereas it is a choice to comply with soft laws or not.",
        subjects: ["010"],
        learningObjectives: [
          {
            name: "010.01.04.01.03",
            href: "/modules/[object Object]/learning-objectives/010.01.04.01.03",
          },
        ],
        externalIds: ["AVEXAM-43929"],
        href: "/modules/[object Object]/questions/Q6C0N5RDTX?variantId=icKGE46Q",
      },
      {
        questionBank: "atpl",
        id: "LVbtDSyB",
        questionId: "Q6UYEVTVQ4",
        variantId: "LVbtDSyB",
        text: "The minimum specifications for a crew license to have international validity is contained in:\n\n- :white_check_mark: Annex 1.\n- :x: Annex 2.\n- :x: Annex 10.\n- :x: Annex 4.",
        subjects: ["010"],
        learningObjectives: [
          {
            name: "010.01.01.02.01",
            href: "/modules/[object Object]/learning-objectives/010.01.01.02.01",
          },
        ],
        externalIds: ["ATPLQ-107139"],
        href: "/modules/[object Object]/questions/Q6UYEVTVQ4?variantId=LVbtDSyB",
      },
      {
        questionBank: "atpl",
        id: "Z9dBRmGm",
        questionId: "Q74ICEQ3V4",
        variantId: "Z9dBRmGm",
        text: "International Air Services Transit Agreement – The First Freedom of the Air defined in the International Air Services Transit Agreement is the..\n\n- :white_check_mark: right to overfly another State without landing.\n- :x: privilege to operate a commercial flight with passengers on board between two States.\n- :x: right to carry passengers from the State in which the aircraft is registered an other State.\n- :x: right to land for a technical stop in another State.",
        subjects: ["010"],
        learningObjectives: [
          {
            name: "010.01.01.02.03",
            href: "/modules/[object Object]/learning-objectives/010.01.01.02.03",
          },
        ],
        externalIds: ["ATPLQ-108858", "ATPLGS-127383", "ATPLGS-118698"],
        href: "/modules/[object Object]/questions/Q74ICEQ3V4?variantId=Z9dBRmGm",
      },
    ],
    totalResults: 30345,
    nextCursor: 24,
  };
