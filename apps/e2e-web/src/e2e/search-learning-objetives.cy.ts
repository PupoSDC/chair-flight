import { screens } from "../utils/screens";

describe("Search Learning Objectives", () => {
  screens.forEach((screen) => {
    describe(`on ${screen}`, () => {
      beforeEach(() => {
        cy.viewport(screen);
      });

      it("navigates to learning objectives page", () => {
        cy.visit("/");
        cy.contains("Search Learning Objectives").scrollIntoView();
        cy.contains("Search Learning Objectives").click();
        cy.url().should("include", "/learning-objectives");
        cy.contains("010.01.01.01");
      });

      it("searches for learning objectives", () => {
        cy.visit("/learning-objectives");
        cy.get("[role='search']").get("input").type("050.01.01{enter}");
        cy.get("li, tr").contains("050.01.01.01");
      });
    });
  });
});
