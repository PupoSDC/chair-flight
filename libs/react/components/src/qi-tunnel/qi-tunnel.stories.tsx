import { useState } from "react";
import { QiTunnel } from "./qi-tunnel";
import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import { obstacleIndex } from "./qi-tunnel-obstacles";
import { CameraControls } from "@react-three/drei";
import { QiTunnelJoystick } from "./qi-tunnel-joystick";
import { Box } from "@mui/joy";

type Story = StoryObj<typeof QiTunnel>;

export const Playground: Story = {};

export const Obstacles: StoryFn = () => {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
      {Object.values(obstacleIndex).map((Obstacle, i) => (
        <Box sx={{ minWidth: 300, minHeight: 300, p: 1 }}>
          <Canvas
            style={{
              height: "100%",
              width: "100%",
              backgroundColor: '#2a6fb5',
            }}
          >
            <CameraControls />
            <pointLight position={[0, 0, 0]} />
            <Obstacle
              key={i}
              position={[0, 0, -50]}
              rotation={[0, 0, 0]}
              rotationDirection={1}
            />
          </Canvas>
        </Box>
      ))}
    </Box>
  );
}

export const Joystick: StoryFn = () => {
  const [position, setPosition] = useState<[number, number]>([0, 0]);
  return (
    <QiTunnelJoystick 
      position={position} 
      onPositionChange={setPosition}
    />
  );
}

const meta: Meta<typeof QiTunnel> = {
  title: "Components/QiTunnel",
  component: QiTunnel,
  tags: ["autodocs"],
};


export default meta;
