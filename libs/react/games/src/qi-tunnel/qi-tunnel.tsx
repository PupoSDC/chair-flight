import React, { useEffect } from "react";
import { Typography, useTheme } from "@mui/joy";
import { Box } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { SafeBox } from "../safe-box";
import { QiTunnelControls } from "./qi-tunnel-controls";
import { QiTunnelGameLogic } from "./qi-tunnel-game-logic";
import { useGameState } from "./qi-tunnel-game-state";
import { obstacleIndex } from "./qi-tunnel-obstacles";
import { QiTunnelPlayer } from "./qi-tunnel-player";
import { QiTunnelTunnel } from "./qi-tunnel-tunnel";
import type { FunctionComponent } from "react";

export const QiTunnel: FunctionComponent = () => {
  const theme = useTheme();
  const obstacles = useGameState((state) => state.obstacles);
  const passedObstacles = useGameState((state) => state.passedObstacles);
  const failedObstacles = useGameState((state) => state.failedObstacles);
  const velocity = useGameState((state) => state.velocity);

  const startGame = useGameState((state) => state.startGame);

  useEffect(() => startGame(), [startGame]);

  return (
    <SafeBox sx={{ width: "100%", minWidth: 500 }}>
      <Box>
        <Typography>
          SCORE: {passedObstacles}/{failedObstacles}
        </Typography>
        <Typography>TIME: {Math.floor(velocity)}</Typography>
        <Typography>SPEED: {Math.floor(velocity)}</Typography>
      </Box>
      <Canvas
        style={{
          margin: "auto",
          height: 500,
          width: 500,
          backgroundColor: theme.palette.primary.solidBg,
        }}
      >
        <QiTunnelGameLogic />
        <QiTunnelPlayer />
        <QiTunnelTunnel />
        <pointLight position={[0, 0, 0]} />
        {obstacles.map((obstacle) => {
          const ObstacleComponent = obstacleIndex[obstacle.name];
          return (
            <ObstacleComponent
              key={obstacle.id}
              ref={obstacle.ref}
              rotation={[0, 0, obstacle.rotation]}
              position={[0, 0, obstacle.position]}
              rotationDirection={obstacle.rotationDirection}
            />
          );
        })}
      </Canvas>
      <SafeBox
        sx={{
          display: "flex",
          justifyContent: "center",
          width: 500,
          pt: 2,
          margin: "auto",
        }}
      >
        <QiTunnelControls />
      </SafeBox>
    </SafeBox>
  );
};
