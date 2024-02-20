import { createRef } from "react";
import { Raycaster, Vector3 } from "three";
import { create } from "zustand";
import { obstacleIndex } from "./qi-tunnel-obstacles";
import type { Mesh } from "three";

export const START_POSITION_FOR_OBSTACLES = -1000;
export const DISTANCE_BETWEEN_OBSTACLES = 200;
export const POST_COLLISION_VELOCITY = -40;
export const MAX_VELOCITY = 100;
export const ACCELERATION = 5;
export const BUMP_ACCELERATION = 0.5;
export const SPEED_NORMALIZATION_FACTOR = 40;
export const INITIAL_VELOCITY = 30;

type Obstacle = {
  id: number;
  ref: React.MutableRefObject<THREE.Mesh | null>;
  rotation: number;
  name: keyof typeof obstacleIndex;
  position: number;
  rotationDirection: 1 | -1;
};

type GameState = {
  position: [number, number];
  velocity: number;
  passedObstacles: number;
  failedObstacles: number;
  startTime: number;
  currentTime: number;
  duration: number;
  collisionBox: React.MutableRefObject<Mesh | null>;
  obstacles: Obstacle[];
  startGame: () => void;
  setPosition: (position: [number, number]) => void;
  advanceGameTime: () => void;
};

export const useGameState = create<GameState>((set, get) => ({
  position: [0, 0],
  velocity: 1,
  acceleration: 0.02,
  obstacles: [],
  passedObstacles: 0,
  failedObstacles: 0,
  startTime: 0,
  currentTime: 0,
  duration: 3 * 60 * 1000,
  collisionBox: createRef(),
  setPosition: (position) => set({ position }),
  startGame: () => {
    set({
      startTime: Date.now(),
      currentTime: Date.now(),
      velocity: INITIAL_VELOCITY,
      passedObstacles: 0,
      failedObstacles: 0,
      obstacles: [...new Array(8).keys()].reverse().map((i) => ({
        ...createNewObstacle(),
        position: START_POSITION_FOR_OBSTACLES + i * 200,
      })),
    });
  },
  advanceGameTime: () => {
    const {
      obstacles,
      velocity,
      passedObstacles,
      failedObstacles,
      collisionBox,
    } = get();
    const newCurrentTime = Date.now();
    const firstObject = obstacles.at(0);
    const lastObject = obstacles.at(-1);

    const newObstacles = obstacles
      .map((obstacle) => ({
        ...obstacle,
        position: obstacle.position + velocity / SPEED_NORMALIZATION_FACTOR,
      }))
      .filter((obstacle) => {
        return obstacle.position < 0;
      });

    const shouldCreateNewObstacle =
      !lastObject ||
      Math.abs(lastObject.position - START_POSITION_FOR_OBSTACLES) >
        DISTANCE_BETWEEN_OBSTACLES;

    if (shouldCreateNewObstacle) {
      newObstacles.push(createNewObstacle());
    }

    const hasCollided =
      firstObject &&
      firstObject.position > -5 &&
      collisionBox.current &&
      firstObject.ref.current &&
      velocity > 0 &&
      checkIfInside(collisionBox.current, firstObject.ref.current);

    const hasPassedObstacle = newObstacles.length === obstacles.length - 1;

    const newVelocity = (() => {
      if (hasCollided) return POST_COLLISION_VELOCITY;
      if (hasPassedObstacle) return velocity + ACCELERATION;
      if (velocity < 30) return velocity + BUMP_ACCELERATION;
      return velocity;
    })();

    const newFailedObstacles = failedObstacles + (hasCollided ? 1 : 0);
    const newPassedObstacles = passedObstacles + (hasPassedObstacle ? 1 : 0);
    set({
      currentTime: newCurrentTime,
      obstacles: newObstacles,
      velocity: Math.min(newVelocity, MAX_VELOCITY),
      failedObstacles: newFailedObstacles,
      passedObstacles: newPassedObstacles,
    });
  },
}));

const rayCaster = new Raycaster();
const checkIfInside = (meshA: Mesh, meshB: Mesh) => {
  const origin = meshA.position.clone();
  const direction = new Vector3(0, 0, -1);
  rayCaster.set(origin, direction);

  const intersects = rayCaster.intersectObject(meshB);
  const isInside = intersects.length > 0;

  return isInside;
};

const createNewObstacle = (): Obstacle => {
  const id = Math.random();
  const allNames = Object.keys(obstacleIndex);
  const name = allNames[Math.floor(id * allNames.length)];
  return {
    id,
    ref: createRef(),
    rotation: Math.random() * Math.PI * 2,
    name: name as keyof typeof obstacleIndex,
    position: START_POSITION_FOR_OBSTACLES,
    rotationDirection: Math.random() > 0.5 ? 1 : -1,
  };
};
