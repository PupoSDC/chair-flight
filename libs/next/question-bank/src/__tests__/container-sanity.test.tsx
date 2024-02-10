import * as containers from "../index";
import type { Container } from "@chair-flight/trpc/client";

describe("Container Sanity", () => {
  const typedContainers = Object.entries(containers).filter(
    ([k]) => !k.startsWith("use"),
  ) as unknown as [string, Container][];

  describe.each(typedContainers)(`%s sanity check`, (name, Container) => {
    it("has display name", () => {
      expect(Container.displayName).toBe(name);
    });

    it("has useData implemented", () => {
      expect(Container.useData).toBeDefined();
    });

    it("has getData implemented", () => {
      expect(Container.getData).toBeDefined();
    });
  });
});
