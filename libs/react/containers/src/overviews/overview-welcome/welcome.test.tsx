import { composeStory } from "@storybook/react";
import { render, screen, waitFor } from "@testing-library/react";
import { setupServer } from "msw/node";
import { wrapper } from "../../__tests__/wrapper";
import { Playground, default as Meta } from "./welcome.stories";

const Welcome = composeStory(Playground, Meta);
const server = setupServer(...(Meta.parameters?.["msw"].handlers ?? []));

describe("welcome", () => {
  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  it("renders with server data", async () => {
    render(<Welcome />, { wrapper });
    const tagline = /Built by students for students/;
    await waitFor(() => expect(screen.getByText(tagline)).toBeInTheDocument());
  });
});
