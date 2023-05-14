import { screens } from "../utils/screens";

const NUMBER_OF_QUESTIONS = 10;

describe("Create Test", () => {
  screens.forEach((screen) => {
    describe(`on ${screen}`, () => {
      beforeEach(() => {
        cy.viewport(screen);
      });

      it("navigates to test creation", () => {
        cy.visit("/");
        cy.contains("Create a Test").scrollIntoView();
        cy.contains("Create a Test").click();
        cy.url().should("include", "/tests/new");
        cy.contains("New Test");
      });

      it("creates and completes a test", () => {
        cy.visit("/tests/new");
        cy.contains("label", "Mode").parent().find("button").click();
        cy.get("li").contains("Exam").click({ force: true });
        cy.contains("label", "Number of Questions")
          .parent()
          .find("input")
          .first()
          .clear();
        cy.contains("label", "Number of Questions")
          .parent()
          .find("input")
          .first()
          .invoke("val", "");
        cy.contains("label", "Number of Questions").type(
          String(NUMBER_OF_QUESTIONS)
        );
        cy.get("button").contains("Start!").click();
        cy.url().should("include", "/exam");

        for (let i = 1; i <= NUMBER_OF_QUESTIONS; i++) {
          cy.get("[data-cy='question']").find("button").first().click();

          if (["iphone-6", "ipad-2"].includes(screen)) {
            cy.get('[data-testid="MenuIcon"]').click();
          }

          cy.get('[data-cy="test-question-navigation"]:visible')
            .find("button")
            .contains(String(i))
            .click();

          cy.get('[data-cy="question"]').find("button").first().click();
        }

        if (["iphone-6", "ipad-2"].includes(screen)) {
          cy.get('[data-testid="MenuIcon"]').click();
        }
        cy.contains("button:visible", "Finish").click();
        cy.url().should("include", "/review");
      });
    });
  });
});
