import { Box as DreiBox, PerspectiveCamera } from "@react-three/drei";
import { useGameState } from "./qi-tunnel-game-state";
import type { FunctionComponent } from "react";

export const QiTunnelPlayer: FunctionComponent = () => {
  const position = useGameState((state) => state.position);
  const collisionBox = useGameState((state) => state.collisionBox);

  return (
    <>
      <PerspectiveCamera
        makeDefault
        fov={75}
        position={[
          0 + (position[0] / 100) * 18,
          0 - (position[1] / 100) * 18,
          0,
        ]}
      />
      <DreiBox
        ref={collisionBox}
        args={[0.1, 0.1, 0.1]}
        position={[
          0 + (position[0] / 100) * 18,
          0 - (position[1] / 100) * 18,
          -0.001,
        ]}
      />
    </>
  );
};
