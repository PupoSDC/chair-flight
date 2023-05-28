import { useFrame } from "@react-three/fiber";
import { useGameState } from "./qi-tunnel-game-state";
import type { FunctionComponent } from "react";

export const QiTunnelGameLogic: FunctionComponent = () => {
  const advanceGameTime = useGameState((state) => state.advanceGameTime);
  useFrame(() => advanceGameTime());

  return null;
};
