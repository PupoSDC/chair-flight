import { screens } from "../utils/screens";

const QUESTION_ID = "QG06S572R1";

describe("Search questions", { scrollBehavior: false }, () => {
  screens.forEach((screen) => {
    describe(`on ${screen}`, () => {
      beforeEach(() => {
        cy.viewport(screen);
      });

      it("Navigates to questions page", () => {
        cy.visit("/");
        cy.contains("Explore Questions").click();
        cy.url().should("include", "/questions");
      });

      it(
        "Navigates to a specific question page",
        {
          // the first search of questions with a lambda cold start is very slow
          defaultCommandTimeout: 25000,
        },
        () => {
          cy.visit("/questions");

          cy.get("[role='search'] input").type("Hypoxia{enter}");

          const preview = "[data-cy='question-preview']";
          cy.get(preview).should("have.length.at.least", 3);
          cy.get(preview).first().should("contain", "hypoxia");
          cy.get(preview).first().should("contain", QUESTION_ID);
          cy.get(preview).first().find("a:visible").click();
          cy.url().should("include", `/questions/${QUESTION_ID}`);
        }
      );

      it("is possible to access all components of a question", () => {
        cy.visit(`/questions/${QUESTION_ID}`);
        const tabPanel = '[role="tabpanel"]';
        const answer = "hypaemic hypoxia";

        cy.get(tabPanel).contains("button", answer).click();
        cy.get(tabPanel).contains("button", answer).should("be.disabled");

        cy.contains("button", "Explanation").click();
        cy.get(tabPanel).contains("Hypoxic Hypoxia");

        cy.contains("button", "Meta").click();
        cy.get(tabPanel).find("a").contains("040.02.01.02.50");

        cy.contains("button", "Variants").click();
        cy.get(tabPanel).contains("button", "Generate This Variant").click();

        cy.get(tabPanel).contains("button", answer).click();
        cy.get(tabPanel).contains("button", answer).should("be.disabled");
      });
    });
  });
});
