import { CameraControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { SafeBox } from "../safe-box";
import { QiTunnel } from "./qi-tunnel";
import { QiTunnelControls } from "./qi-tunnel-controls";
import { obstacleIndex } from "./qi-tunnel-obstacles";
import type { Meta, StoryFn, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof QiTunnel>;

export const Playground: Story = {};

export const Obstacles: StoryFn = () => {
  return (
    <SafeBox sx={{ display: "flex", flexWrap: "wrap" }}>
      {Object.values(obstacleIndex).map((Obstacle, i) => (
        <SafeBox sx={{ minWidth: 300, minHeight: 300, p: 1 }}>
          <Canvas
            style={{
              height: "100%",
              width: "100%",
              backgroundColor: "#2a6fb5",
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
        </SafeBox>
      ))}
    </SafeBox>
  );
};

export const Joystick: StoryFn = () => {
  return <QiTunnelControls />;
};

const meta: Meta<typeof QiTunnel> = {
  title: "Games/QiTunnel",
  component: QiTunnel,
  tags: ["autodocs"],
};

export default meta;
