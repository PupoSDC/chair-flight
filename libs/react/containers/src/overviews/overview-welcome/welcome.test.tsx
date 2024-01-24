import { composeStories } from "@storybook/react";
import { render, screen, waitFor } from "@testing-library/react";
import { setupServer } from "msw/node";
import { wrapper } from "../../__tests__/wrapper";
import * as stories from "./welcome.stories";

const { Playground } = composeStories(stories);

const handlers = stories.default.parameters?.["msw"].handlers ?? [];
const server = setupServer(...handlers);

describe("welcome", () => {
  beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it.skip("renders with server data", async () => {
    render(<Playground />, { wrapper });
    const tagline = /Built by students for students/;
    await waitFor(() => expect(screen.getByText(tagline)).toBeInTheDocument());
  });
});
