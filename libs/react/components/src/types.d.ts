import "@nx/next/typings/image.d.ts";
import "@total-typescript/ts-reset";

declare module "*.mdx" {
  let MDXComponent: (props: unknown) => JSX.Element;
  export default MDXComponent;
}
