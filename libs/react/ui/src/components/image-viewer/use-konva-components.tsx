"use client";

import { useEffect, useState } from "react";
import type { default as Konva } from "konva";
import type { KonvaNodeComponent, StageProps } from "react-konva";

type KonvaComponents = {
  Stage: KonvaNodeComponent<Konva.Stage, StageProps>;
  Layer: KonvaNodeComponent<Konva.Layer, Konva.LayerConfig>;
  Image: KonvaNodeComponent<Konva.Image, Konva.ImageConfig>;
  Line: KonvaNodeComponent<Konva.Line, Konva.LineConfig>;
};

/**
 * Why is this abomination a thing?
 *
 * React Konva does not work with SSR. As soon as you import it, it will throw
 * an error. So we need to lazy load it.
 *
 * Require would be best since it's sync... but vite does not support it.
 *
 * So we are left with this...
 */
export const useKonvaComponents = (): KonvaComponents | null => {
  const [KonvaComponents, setKonvaComponents] =
    useState<KonvaComponents | null>(null);

  useEffect(() => {
    import("react-konva").then((components) => {
      setKonvaComponents(components);
    });
  }, []);

  return KonvaComponents;
};
