import type { QuestionSearchResult } from "@cf/core/search";
import type { AppRouterOutput } from "@cf/trpc/client";

const items: QuestionSearchResult[] = [
  {
    id: "QDFBOVPN",
    questionBank: "atpl",
    text: {
      mdContent:
        "The Convention signed by the States, to ensure adequate compensation for persons who suffer damage caused on the surface by foreign aircraft, is the\n\n- :white_check_mark: Rome Convention 1933/1952.\n- :x: Warsaw Convention 1929.\n- :x: Paris Convention 1919.\n- :x: Tokyo Convention 1963.",
    },
    subjects: ["010"],
    href: "/modules/atpl/questions/QDFBOVPN",
    externalIds: ["ATPLGS-103761", "ATPLGS-118704"],
    learningObjectives: [
      {
        id: "010.01.01.01.01",
        href: "/modules/atpl/learning-objectives/010.01.01.01.01",
      },
    ],
    relatedQuestions: [],
  },
  {
    id: "QHMWBCYB",
    questionBank: "atpl",
    text: {
      mdContent:
        "The convention on offenses and certain acts committed on board aircraft, is called\n\n- :white_check_mark: the Convention of Tokyo.\n- :x: the Convention of Chicago.\n- :x: the Convention of Rome.\n- :x: the Convention of Paris.",
    },
    subjects: ["010"],
    href: "/modules/atpl/questions/QHMWBCYB",
    externalIds: ["ATPLGS-103763"],
    learningObjectives: [
      {
        id: "010.01.01.01.01",
        href: "/modules/atpl/learning-objectives/010.01.01.01.01",
      },
    ],
    relatedQuestions: [],
  },
  {
    id: "QEGZNNKW",
    questionBank: "atpl",
    text: {
      mdContent:
        "Which convention makes acts of violence on board, destruction of aircraft in flight and destroying or damaging any air navigation facility punishable?\n\n- :white_check_mark: The Montreal Convention.\n- :x: The Warsaw Convention.\n- :x: The Rome Convention.\n- :x: The Chicago Convention.",
    },
    subjects: ["010"],
    href: "/modules/atpl/questions/QEGZNNKW",
    externalIds: ["ATPLGS-103753"],
    learningObjectives: [
      {
        id: "010.01.01.01.01",
        href: "/modules/atpl/learning-objectives/010.01.01.01.01",
      },
    ],
    relatedQuestions: [],
  },
  {
    id: "QYOGZJOT",
    questionBank: "atpl",
    text: {
      mdContent:
        "The International Civil Aviation Organization (ICAO) was established by the international convention of:\n\n- :white_check_mark: Chicago 1944\n- :x: Chicago 1929\n- :x: Warsaw 1929\n- :x: Montreal 1948",
    },
    subjects: ["010"],
    href: "/modules/atpl/questions/QYOGZJOT",
    externalIds: ["AVEXAM-1644"],
    learningObjectives: [
      {
        id: "010.01.01.01.01",
        href: "/modules/atpl/learning-objectives/010.01.01.01.01",
      },
    ],
    relatedQuestions: [
      { id: "QOMXIUVQ", href: "/modules/atpl/questions/QOMXIUVQ" },
    ],
  },
  {
    id: "QOMXIUVQ",
    questionBank: "atpl",
    text: {
      mdContent:
        "The International Civil Aviation Organisation (ICAO) was established by the international convention of:\n\n- :white_check_mark: Chicago\n- :x: Montreal\n- :x: The Hague\n- :x: Warsaw",
    },
    subjects: ["010"],
    href: "/modules/atpl/questions/QOMXIUVQ",
    externalIds: ["ATPLGS-103725", "BGS-100007"],
    learningObjectives: [
      {
        id: "010.01.01.01.01",
        href: "/modules/atpl/learning-objectives/010.01.01.01.01",
      },
    ],
    relatedQuestions: [
      { id: "QYOGZJOT", href: "/modules/atpl/questions/QYOGZJOT" },
    ],
  },
  {
    id: "QAORDWHO",
    questionBank: "atpl",
    text: {
      mdContent:
        "Which convention on international air navigation resulted in the agreements concerning the responsibilities with illegal acts committed on board aircraft?\n\n- :white_check_mark: The Tokyo Convention\n- :x: The Montreal Convention\n- :x: The Chicago Convention\n- :x: The Geneva Convention",
    },
    subjects: ["010"],
    href: "/modules/atpl/questions/QAORDWHO",
    externalIds: ["ATPLGS-103755"],
    learningObjectives: [
      {
        id: "010.01.01.01.01",
        href: "/modules/atpl/learning-objectives/010.01.01.01.01",
      },
    ],
    relatedQuestions: [],
  },
  {
    id: "QZMRLCWT",
    questionBank: "atpl",
    text: {
      mdContent:
        "“ICAO - Objectives of ICAO were established and are ratified by the...”\n\n- :white_check_mark: Chicago Convention 1944.\n- :x: Geneva Convention 1936.\n- :x: Geneva Convention 1948.\n- :x: Warsaw Convention 1929.",
    },
    subjects: ["010"],
    href: "/modules/atpl/questions/QZMRLCWT",
    externalIds: ["ATPLGS-111546", "ATPLQ-108644", "BGS-100005"],
    learningObjectives: [
      {
        id: "010.01.01.01.01",
        href: "/modules/atpl/learning-objectives/010.01.01.01.01",
      },
    ],
    relatedQuestions: [],
  },
  {
    id: "QKUYKZOX",
    questionBank: "atpl",
    text: {
      mdContent:
        "Which convention deals with the unification of rules related to damage caused by aircraft to third parties on the surface?\n\n- :white_check_mark: The Rome Convention\n- :x: The Guatemala Convention\n- :x: The Montreal Convention\n- :x: The Tokyo Convention",
    },
    subjects: ["010"],
    href: "/modules/atpl/questions/QKUYKZOX",
    externalIds: ["ATPLGS-103754"],
    learningObjectives: [
      {
        id: "010.01.01.01.01",
        href: "/modules/atpl/learning-objectives/010.01.01.01.01",
      },
    ],
    relatedQuestions: [],
  },
  {
    id: "QYZVIIIC",
    questionBank: "atpl",
    text: {
      mdContent:
        "The international convention defining rules relative to the responsibilities of international air carriers for the carriage of passengers, baggage and freight is the\n\n- :white_check_mark: Warsaw Convention of 1929.\n- :x: Montreal Convention of 1971.\n- :x: Tokyo Convention of 1963.\n- :x: Hague Convention of 1970.",
    },
    subjects: ["010"],
    href: "/modules/atpl/questions/QYZVIIIC",
    externalIds: ["ATPLGS-103743"],
    learningObjectives: [
      {
        id: "010.01.01.01.01",
        href: "/modules/atpl/learning-objectives/010.01.01.01.01",
      },
    ],
    relatedQuestions: [],
  },
  {
    id: "QTDRCKEN",
    questionBank: "atpl",
    text: {
      mdContent:
        "Concerning the Chicago Convention of **1944**:\n\n- :white_check_mark: each State has total sovereignty over the airspace above its territory.\n- :x: each State was required to recognize the other States attending.\n- :x: only 52 nations were permitted to attend.\n- :x: all States in the world attended.",
    },
    subjects: ["010"],
    href: "/modules/atpl/questions/QTDRCKEN",
    externalIds: ["AVEXAM-45311"],
    learningObjectives: [
      {
        id: "010.01.01.01.01",
        href: "/modules/atpl/learning-objectives/010.01.01.01.01",
      },
    ],
    relatedQuestions: [],
  },
  {
    id: "QUBVEWSD",
    questionBank: "atpl",
    text: {
      mdContent:
        "The Convention of Rome 1933/1952 for the Unification of certain Rules Relating to Damage caused by Aircraft was established in order to define the liability in case of damage\n\n- :white_check_mark: to third parties on the surface.\n- :x: to other aircraft in case of a mid-air collision.\n- :x: to other aircraft while operating on ground.\n- :x: caused by Dangerous Goods that have been carried by an aircraft.",
    },
    subjects: ["010"],
    href: "/modules/atpl/questions/QUBVEWSD",
    externalIds: ["ATPLGS-118705"],
    learningObjectives: [
      {
        id: "010.01.01.01.01",
        href: "/modules/atpl/learning-objectives/010.01.01.01.01",
      },
    ],
    relatedQuestions: [],
  },
  {
    id: "QUFCNRYT",
    questionBank: "atpl",
    text: {
      mdContent:
        "The objectives of ICAO were ratified by the\n\n- :white_check_mark: Chicago Convention 1 944.\n- :x: Montreal Convention 1 948.\n- :x: Warsaw Convention 1 929.\n- :x: Geneva Convention 1 936.",
    },
    subjects: ["010"],
    href: "/modules/atpl/questions/QUFCNRYT",
    externalIds: ["ATPLGS-103708"],
    learningObjectives: [
      {
        id: "010.01.01.01.01",
        href: "/modules/atpl/learning-objectives/010.01.01.01.01",
      },
    ],
    relatedQuestions: [],
  },
  {
    id: "QIJTZTYB",
    questionBank: "atpl",
    text: {
      mdContent:
        "According to which Convention may an aircraft commander impose measures upon a person committing a crime or an offense on board the aircraft?\n\n- :white_check_mark: The Convention of Tokyo.\n- :x: The Convention of Rome.\n- :x: The Convention of Chicago.\n- :x: The Convention of Warsaw.",
    },
    subjects: ["010"],
    href: "/modules/atpl/questions/QIJTZTYB",
    externalIds: ["ATPLGS-103749", "ATPLQ-106886", "BGS-100560"],
    learningObjectives: [
      {
        id: "010.01.01.01.01",
        href: "/modules/atpl/learning-objectives/010.01.01.01.01",
      },
    ],
    relatedQuestions: [],
  },
  {
    id: "QJHEAKMK",
    questionBank: "atpl",
    text: {
      mdContent:
        "Chicago Convention – Cabotage refers to..\n\n- :white_check_mark: domestic air services.\n- :x: security matters.\n- :x: required documents for cargo.\n- :x: international air services.",
    },
    subjects: ["010"],
    href: "/modules/atpl/questions/QJHEAKMK",
    externalIds: ["ATPLGS-118692", "ATPLQ-106915", "BGS-100013"],
    learningObjectives: [
      {
        id: "010.01.01.01.01",
        href: "/modules/atpl/learning-objectives/010.01.01.01.01",
      },
    ],
    relatedQuestions: [],
  },
  {
    id: "QDNTFLZC",
    questionBank: "atpl",
    text: {
      mdContent:
        "Who issues the certificate of airworthiness?\n\n- :white_check_mark: State of registry\n- :x: ICAO\n- :x: Operator\n- :x: State of design.",
    },
    subjects: ["010"],
    href: "/modules/atpl/questions/QDNTFLZC",
    externalIds: ["ATPLGS-103776"],
    learningObjectives: [
      {
        id: "010.01.01.02.04",
        href: "/modules/atpl/learning-objectives/010.01.01.02.04",
      },
    ],
    relatedQuestions: [],
  },
  {
    id: "QLCWDNUJ",
    questionBank: "atpl",
    text: {
      mdContent:
        "When letters are used for the registration mark, combinations shall not be used which might be confused with the\n\n- :white_check_mark: five letter combinations used in the international code of signals.\n- :x: three letters combinations used in the international code of signals.\n- :x: letters used for an ICAO identification documents.\n- :x: four letter combinations beginning with Q.",
    },
    subjects: ["010"],
    href: "/modules/atpl/questions/QLCWDNUJ",
    externalIds: ["ATPLGS-103793"],
    learningObjectives: [
      {
        id: "010.01.01.02.04",
        href: "/modules/atpl/learning-objectives/010.01.01.02.04",
      },
    ],
    relatedQuestions: [],
  },
  {
    id: "QVQLIOPH",
    questionBank: "atpl",
    text: {
      mdContent:
        "When letters are used for registration mark, a combination that can be used and which should not be confused with other signals, would be for example\n\n- :white_check_mark: VOR\n- :x: TTT\n- :x: QNH\n- :x: SOS",
    },
    subjects: ["010"],
    href: "/modules/atpl/questions/QVQLIOPH",
    externalIds: ["ATPLGS-103792"],
    learningObjectives: [
      {
        id: "010.01.01.02.01",
        href: "/modules/atpl/learning-objectives/010.01.01.02.01",
      },
    ],
    relatedQuestions: [],
  },
  {
    id: "QYONPRXR",
    questionBank: "atpl",
    text: {
      mdContent:
        "A scheduled flight from Singapore to Thailand has the right to fly over Malaysia WITHOUT landing, and to land in Malaysia for non-traffic purposes. These rights are granted by the _____ Freedoms of the Air:\n\n- :white_check_mark: First and Second.\n- :x: Third and Fourth.\n- :x: First and Fifth.\n- :x: Second and Third.",
    },
    subjects: ["010"],
    href: "/modules/atpl/questions/QYONPRXR",
    externalIds: ["ATPLQ-102418"],
    learningObjectives: [
      {
        id: "010.01.01.02.03",
        href: "/modules/atpl/learning-objectives/010.01.01.02.03",
      },
    ],
    relatedQuestions: [],
  },
  {
    id: "QOQYLGDD",
    questionBank: "atpl",
    text: {
      mdContent:
        "Contracting States shall not require the authorized agent or pilot-in-command to deliver to the public authorities concerned, before departure of the aircraft, more than some copies of General Declaration, Cargo Manifest and stores list\nThe numbers of the copies are\n\n- :white_check_mark: 3 of each.\n- :x: 2 copies of General Declaration and of Cargo Manifest and of a stores list.\n- :x: 2 of each.\n- :x: 2 copies of General Declarations and Cargo Manifest and one copy of a simple stores list.",
    },
    subjects: ["010"],
    href: "/modules/atpl/questions/QOQYLGDD",
    externalIds: ["ATPLGS-104676", "AVEXAM-96674"],
    learningObjectives: [
      {
        id: "010.01.01.02.04",
        href: "/modules/atpl/learning-objectives/010.01.01.02.04",
      },
    ],
    relatedQuestions: [],
  },
  {
    id: "QRJBQSTQ",
    questionBank: "atpl",
    text: {
      mdContent:
        "The minimum specifications for a crew license to have international validity is contained in:\n\n- :white_check_mark: Annex 1.\n- :x: Annex 2.\n- :x: Annex 10.\n- :x: Annex 4.",
    },
    subjects: ["010"],
    href: "/modules/atpl/questions/QRJBQSTQ",
    externalIds: ["ATPLQ-107139"],
    learningObjectives: [
      {
        id: "010.01.01.02.01",
        href: "/modules/atpl/learning-objectives/010.01.01.02.01",
      },
    ],
    relatedQuestions: [],
  },
  {
    id: "QIGYGMZV",
    questionBank: "atpl",
    text: {
      mdContent:
        "International Air Services Transit Agreement – The First Freedom of the Air defined in the International Air Services Transit Agreement is the..\n\n- :white_check_mark: right to overfly another State without landing.\n- :x: privilege to operate a commercial flight with passengers on board between two States.\n- :x: right to carry passengers from the State in which the aircraft is registered an other State.\n- :x: right to land for a technical stop in another State.",
    },
    subjects: ["010"],
    href: "/modules/atpl/questions/QIGYGMZV",
    externalIds: ["ATPLGS-118698", "ATPLGS-127383", "ATPLQ-108858"],
    learningObjectives: [
      {
        id: "010.01.01.02.03",
        href: "/modules/atpl/learning-objectives/010.01.01.02.03",
      },
    ],
    relatedQuestions: [],
  },
  {
    id: "QFKUBGPM",
    questionBank: "atpl",
    text: {
      mdContent:
        "An aircraft from an ICAO contracting State must carry the following documents on an international flight:\n\n- :white_check_mark: C of A, certificate of registration, appropriate licences of each crew member and the aircraft's radio station licence\n- :x: C of A, certificate of registration, appropriate licences of each crew member and log books of flight deck crew members\n- :x: Appropriate licences of each crew member, C of A, certificate of registration and passports of each crew member\n- :x: Crew member licences, C of A, certificate of registration and receipts for all fuel purchased outside the aircraft's own State",
    },
    subjects: ["010"],
    href: "/modules/atpl/questions/QFKUBGPM",
    externalIds: ["BGS-991971"],
    learningObjectives: [
      {
        id: "010.01.01.02.04",
        href: "/modules/atpl/learning-objectives/010.01.01.02.04",
      },
    ],
    relatedQuestions: [],
  },
  {
    id: "QLLJPOQX",
    questionBank: "atpl",
    text: {
      mdContent:
        "When should the AIS be avaliable for a flight?  \n\n- :white_check_mark: At least the entire flight AND plus 2 hour BEFORE and AFTER the flight\n- :x: At least the entire flight AND plus 30 Mins BEFORE and AFTER the flight\n- :x: At least the entire flight\n- :x: No requirement for it to be available",
    },
    subjects: ["010"],
    href: "/modules/atpl/questions/QLLJPOQX",
    externalIds: ["ATPLGS-622441"],
    learningObjectives: [
      {
        id: "010.01.01.02.03",
        href: "/modules/atpl/learning-objectives/010.01.01.02.03",
      },
    ],
    relatedQuestions: [],
  },
  {
    id: "QWHUIIHN",
    questionBank: "atpl",
    text: {
      mdContent:
        "In accordance with ICAO Annex 1, when a contracting state renders valid a licence issued by another contracting state, the validity of the authorisation\n\n- :white_check_mark: shall not extend beyond the period of validity of the licence.\n- :x: shall not extend beyond one year for ATPL and CPL.\n- :x: is only considered for PPL.\n- :x: depends on the regulations of the Contracting State which renders valid the licence.",
    },
    subjects: ["010"],
    href: "/modules/atpl/questions/QWHUIIHN",
    externalIds: ["ATPLGS-103798"],
    learningObjectives: [
      {
        id: "010.01.01.02.04",
        href: "/modules/atpl/learning-objectives/010.01.01.02.04",
      },
    ],
    relatedQuestions: [],
  },
];

export const mockRetrieveQuestionsData: AppRouterOutput["common"]["search"]["retrieveQuestions"] =
  {
    items,
  };

export const mockSearchQuestionsData: AppRouterOutput["common"]["search"]["searchQuestions"] =
  {
    items,
    totalResults: 697,
    nextCursor: 20,
  };
