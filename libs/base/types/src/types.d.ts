import "@total-typescript/ts-reset";

declare module "*.png" {
  const content: import("next/dist/shared/lib/image-external").StaticImageData;

  export default content;
}
