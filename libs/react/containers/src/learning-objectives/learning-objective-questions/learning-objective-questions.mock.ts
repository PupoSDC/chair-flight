import type { AppRouterOutput } from "@chair-flight/trpc/server";

export const mockData: AppRouterOutput["containers"]["learningObjectives"]["getLearningObjectiveQuestions"] =
  {
    items: [
      {
        questionBank: "atpl",
        id: "InuEp2iq",
        questionId: "Q1U2MWY0XQ",
        variantId: "InuEp2iq",
        text: "The sensor(s) feeding the EPR-indicator is (are):\n\n- :white_check_mark: pressure probes, one located upstream from the compressor inlet, and the other downstream from the turbine outlet.\n- :x: tachometer located on the shaft of the N2 compressor.\n- :x: temperature probes, one located upstream from the compressor inlet, and another downstream from the turbine outlet.\n- :x: tachometer located on the shaft of the N1 compressor.",
        subjects: ["022"],
        learningObjectives: [
          {
            name: "022.01.06.01.03",
            href: "/modules/atpl/learning-objectives/022.01.06.01.03",
          },
        ],
        externalIds: ["BGS-220059", "ATPLQ-222483", "AVEXAM-9730"],
        href: "/modules/atpl/questions/Q1U2MWY0XQ?variantId=InuEp2iq",
      },
      {
        questionBank: "atpl",
        id: "2JoQW5Tc",
        questionId: "QOTLN9CXBM",
        variantId: "2JoQW5Tc",
        text: "The EPR is computed by:\n\n- :white_check_mark: dividing turbine discharge pressure by compressor inlet pressure.\n- :x: dividing compressor discharge pressure by turbine discharge pressure.\n- :x: multiplying compressor discharge pressure by turbine inlet pressure.\n- :x: multiplying compressor inlet pressure by turbine discharge pressure.",
        subjects: ["022"],
        learningObjectives: [
          {
            name: "022.01.06.01.03",
            href: "/modules/atpl/learning-objectives/022.01.06.01.03",
          },
        ],
        externalIds: [
          "BGS-222048",
          "ATPLQ-222263",
          "AVEXAM-13967",
          "ATPLGS-120351",
          "BGS-220053",
        ],
        href: "/modules/atpl/questions/QOTLN9CXBM?variantId=2JoQW5Tc",
      },
      {
        questionBank: "atpl",
        id: "ePy2uGIm",
        questionId: "QBPFACYKPV",
        variantId: "ePy2uGIm",
        text: "On a N1 indicator, the maximum N1 admissible\n\n- :white_check_mark: may be greater than 100%.\n- :x: is always less than 100%.\n- :x: is approximately 99%.\n- :x: is 100%.",
        subjects: ["022"],
        learningObjectives: [
          {
            name: "022.01.06.01.03",
            href: "/modules/atpl/learning-objectives/022.01.06.01.03",
          },
        ],
        externalIds: ["ATPLGS-120803", "ATPLQ-223638", "BGS-221375"],
        href: "/modules/atpl/questions/QBPFACYKPV?variantId=ePy2uGIm",
      },
      {
        questionBank: "atpl",
        id: "iSK3z1US",
        questionId: "QE5ACYYYRY",
        variantId: "iSK3z1US",
        text: "How is the N1 shown on an EICAS?\n\n- :white_check_mark: Present, commanded, limit.\n- :x: Present, commanded.\n- :x: Commanded, limit.\n- :x: Present, limit.",
        subjects: ["022"],
        learningObjectives: [
          {
            name: "022.01.06.01.03",
            href: "/modules/atpl/learning-objectives/022.01.06.01.03",
          },
        ],
        externalIds: ["ATPLGS-129545", "BGS-221259"],
        href: "/modules/atpl/questions/QE5ACYYYRY?variantId=iSK3z1US",
      },
      {
        questionBank: "atpl",
        id: "m1tSvGDP",
        questionId: "QMKC2RVOS1",
        variantId: "m1tSvGDP",
        text: "Define EPR:\n\n- :white_check_mark: The quotient of pressure at the exhaust nozzle and pressure at the compressor inlet.\n- :x: Ratio of turbine inlet pressure and compressor inlet pressure.\n- :x: Exhaust pressure, expressed as a fraction of combustion chamber outlet pressure.\n- :x: Pressure at the compressor outlet divided by pressure at the compressor inlet.",
        subjects: ["022"],
        learningObjectives: [
          {
            name: "022.01.06.01.03",
            href: "/modules/atpl/learning-objectives/022.01.06.01.03",
          },
        ],
        externalIds: ["AVEXAM-91486"],
        href: "/modules/atpl/questions/QMKC2RVOS1?variantId=m1tSvGDP",
      },
      {
        questionBank: "atpl",
        id: "nn3FSSpI",
        questionId: "QD86CABM5R",
        variantId: "nn3FSSpI",
        text: "Which of the following N~1~ parameters can be displayed on an electronic display unit?\n1. Present N~1~\n2. Commanded N~1~\n3. N~1~ limit for operation\nThe combination regrouping all correct statements is:\n\n- :white_check_mark: 1, 2, 3\n- :x: 1, 2\n- :x: 2, 3\n- :x: 1, 3",
        subjects: ["022"],
        learningObjectives: [
          {
            name: "022.01.06.01.03",
            href: "/modules/atpl/learning-objectives/022.01.06.01.03",
          },
        ],
        externalIds: ["AVEXAM-18510"],
        href: "/modules/atpl/questions/QD86CABM5R?variantId=nn3FSSpI",
      },
      {
        questionBank: "atpl",
        id: "K1V8wvHK",
        questionId: "QIMXOG0PXA",
        variantId: "K1V8wvHK",
        text: "On an electronic display unit, the following N1 parameters can be displayed:\n\n1 – present N1.2 – commanded N13 – maximum N1 operating limit.\nThe combination that regroups all of the correct statements is:\n\n- :white_check_mark: 1, 2, 3.\n- :x: 1, 2.\n- :x: 1, 3.\n- :x: 2, 3.",
        subjects: ["022"],
        learningObjectives: [
          {
            name: "022.01.06.01.03",
            href: "/modules/atpl/learning-objectives/022.01.06.01.03",
          },
        ],
        externalIds: ["ATPLQ-228565", "AVEXAM-18510", "BGS-222291"],
        href: "/modules/atpl/questions/QIMXOG0PXA?variantId=K1V8wvHK",
      },
      {
        questionBank: "atpl",
        id: "r8yHf5o4",
        questionId: "Q0AV06OV59",
        variantId: "r8yHf5o4",
        text: "The EPR (Engine Pressure Ratio) is:\n\n- :white_check_mark: the ratio of the turbine outlet total pressure to the compressor inlet total pressure.\n- :x: the difference between the compressor inlet total pressure and the turbine outlet total pressure.\n- :x: the ratio of the compressor outlet total pressure to the compressor inlet total pressure.\n- :x: the ratio of the turbine outlet total pressure to the ambient total pressure.",
        subjects: ["022"],
        learningObjectives: [
          {
            name: "022.01.06.01.02",
            href: "/modules/atpl/learning-objectives/022.01.06.01.02",
          },
        ],
        externalIds: [
          "AVEXAM-15363",
          "ATPLQ-226699",
          "BGS-220052",
          "ATPLGS-112832",
        ],
        href: "/modules/atpl/questions/Q0AV06OV59?variantId=r8yHf5o4",
      },
      {
        questionBank: "atpl",
        id: "rck9XKeO",
        questionId: "Q0T4LMRMFK",
        variantId: "rck9XKeO",
        text: "The front probe of an EPR system becomes blocked during take-off due to debris ingestion or icing. The EPR gauge will indicate\n\n- :white_check_mark: higher than the actual value of EPR.\n- :x: lower than the actual value of EPR.\n- :x: the LP turbine exhaust pressure.\n- :x: 1.00",
        subjects: ["022"],
        learningObjectives: [
          {
            name: "022.01.06.01.02",
            href: "/modules/atpl/learning-objectives/022.01.06.01.02",
          },
        ],
        externalIds: ["BGS-221317", "AVEXAM-65694"],
        href: "/modules/atpl/questions/Q0T4LMRMFK?variantId=rck9XKeO",
      },
      {
        questionBank: "atpl",
        id: "QVyRzw90",
        questionId: "Q31KLTRZL6",
        variantId: "QVyRzw90",
        text: "During take-off, the front probe of an EPR system becomes blocked by ingested debris or icing but the rear probe remains unaffected. The displayed EPR will likely be:\n\n- :white_check_mark: higher than the actual EPR value.\n- :x: equal to the LP turbine exhaust pressure.\n- :x: equal to zero, and N1 should be used instead.\n- :x: lower than the actual EPR value.",
        subjects: ["022"],
        learningObjectives: [
          {
            name: "022.01.06.01.02",
            href: "/modules/atpl/learning-objectives/022.01.06.01.02",
          },
        ],
        externalIds: ["AVEXAM-65694", "BGS-221317", "ATPLQ-225451"],
        href: "/modules/atpl/questions/Q31KLTRZL6?variantId=QVyRzw90",
      },
      {
        questionBank: "atpl",
        id: "YQJwzEpm",
        questionId: "Q2UTW3QCT2",
        variantId: "YQJwzEpm",
        text: "The parameters used to represent thrust are:\n\n1 – N1 (low pressure shaft speed).2 – N2 (high pressure shaft speed).3 – EGT.4 – EPR.\nThe combination that regroups all of the correct statements is:\n\n- :white_check_mark: 1, 4.\n- :x: 1, 3.\n- :x: 1, 2.\n- :x: 4",
        subjects: ["022"],
        learningObjectives: [
          {
            name: "022.01.06.01.01",
            href: "/modules/atpl/learning-objectives/022.01.06.01.01",
          },
        ],
        externalIds: ["ATPLQ-225288", "BGS-221948"],
        href: "/modules/atpl/questions/Q2UTW3QCT2?variantId=YQJwzEpm",
      },
      {
        questionBank: "atpl",
        id: "qfkFexRV",
        questionId: "QCM38OT5IN",
        variantId: "qfkFexRV",
        text: "Gas turbine thrust  is measured by the EPR. EPR is:\n \n\n- :white_check_mark: LP turbine exhaust pressure divided by engine inlet pressure\n- :x: LP turbine exhaust pressure divided by LP compressor exhaust pressure\n- :x: Fan inlet pressure divided by LP turbine exhaust pressure\n- :x: N1 divided by N3",
        subjects: ["022"],
        learningObjectives: [
          {
            name: "022.01.06.01.01",
            href: "/modules/atpl/learning-objectives/022.01.06.01.01",
          },
        ],
        externalIds: ["BGS-990663"],
        href: "/modules/atpl/questions/QCM38OT5IN?variantId=qfkFexRV",
      },
      {
        questionBank: "atpl",
        id: "ymGlUNq3",
        questionId: "QGH2RX8801",
        variantId: "ymGlUNq3",
        text: "The two main sources of information used to calculate turbojet thrust are the\n\n- :white_check_mark: Fan rotation speed (or N1) or the EPR.\n- :x: High pressure turbine rotation speed or the EPR.\n- :x: Fan rotation speed (or N1) or the total pressure at the low pressure turbine outlet.\n- :x: Fan rotation speed (or N1) or the total pressure at the high pressure compressor outlet.",
        subjects: ["022"],
        learningObjectives: [
          {
            name: "022.01.06.01.01",
            href: "/modules/atpl/learning-objectives/022.01.06.01.01",
          },
        ],
        externalIds: [
          "ATPLGS-129505",
          "BGS-220060",
          "ATPLQ-225217",
          "AVEXAM-50391",
        ],
        href: "/modules/atpl/questions/QGH2RX8801?variantId=ymGlUNq3",
      },
      {
        questionBank: "atpl",
        id: "Oi5KdRJb",
        questionId: "QVMJ1DU6QK",
        variantId: "Oi5KdRJb",
        text: "Concerning the thrust measurement, the N1 is defined as the:\n\n- :white_check_mark: low pressure shaft speed.\n- :x: first stage compressor speed.\n- :x: high pressure shaft speed.\n- :x: second stage compressor speed.",
        subjects: ["022"],
        learningObjectives: [
          {
            name: "022.01.06.01.01",
            href: "/modules/atpl/learning-objectives/022.01.06.01.01",
          },
        ],
        externalIds: ["BGS-222167", "ATPLQ-221881"],
        href: "/modules/atpl/questions/QVMJ1DU6QK?variantId=Oi5KdRJb",
      },
      {
        questionBank: "atpl",
        id: "SWiVpQHi",
        questionId: "QUHVPY5CMU",
        variantId: "SWiVpQHi",
        text: "N1 is a measurement of\n\n- :white_check_mark: the LP spool in %RPM\n- :x: the HP spool in %RPM\n- :x: Pressure differential\n- :x: gearbox rotational velocity",
        subjects: ["022"],
        learningObjectives: [
          {
            name: "022.01.06.01.01",
            href: "/modules/atpl/learning-objectives/022.01.06.01.01",
          },
        ],
        externalIds: ["BGS-221364"],
        href: "/modules/atpl/questions/QUHVPY5CMU?variantId=SWiVpQHi",
      },
      {
        questionBank: "atpl",
        id: "45stJ0Th",
        questionId: "QYOFIK8C7Z",
        variantId: "45stJ0Th",
        text: "If an EPR is set at a constant value, with an increasing OAT, the thrust:\n\n- :white_check_mark: decreases\n- :x: remains constant\n- :x: varies according to the characteristics of the engine\n- :x: increases",
        subjects: ["022"],
        learningObjectives: [
          {
            name: "022.01.06.01.01",
            href: "/modules/atpl/learning-objectives/022.01.06.01.01",
          },
        ],
        externalIds: ["AVEXAM-1701"],
        href: "/modules/atpl/questions/QYOFIK8C7Z?variantId=45stJ0Th",
      },
    ],
  };
