import { composeStories } from "@storybook/react";
import { render, screen } from "@testing-library/react";
import { default as userEvent } from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll } from "vitest";
import { decorators } from "../../__tests__/decorators";
import * as stories from "./question-editor.stories";

const { BasePage } = composeStories(stories, { decorators });
const server = setupServer(...(stories.default.parameters?.["msw"] ?? []));

describe("QuestionEditor", () => {
  beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it.skip("is possible to create a new variant", async () => {
    render(<BasePage />);
    const initialCards = await screen.findAllByTestId("variant-card");
    const addButton = screen.getByRole("button", { name: /new variant/i });
    await userEvent.click(addButton);
    const newCards = await screen.findAllByTestId("variant-card");
    expect(initialCards.length + 1).toBe(newCards.length);
  });

  it.skip("is possible to delete a variant", async () => {
    render(<BasePage />);
    const initialCards = await screen.findAllByTestId("variant-card");
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    await userEvent.click(deleteButton);
    const newCards = await screen.findAllByTestId("variant-card");
    expect(initialCards.length - 1).toBe(newCards.length);
  });
});
