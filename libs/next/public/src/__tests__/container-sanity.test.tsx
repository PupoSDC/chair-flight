import * as allExports from "../index";
import type { Container } from "@chair-flight/trpc/client";

describe("Container Sanity", () => {
  const containers = Object.entries(allExports).filter(
    ([k]) => !k.startsWith("use"),
  ) as unknown as [string, Container][];

  describe.each(containers)(`%s sanity check`, (name, Container) => {
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
