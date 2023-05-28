import React, { useEffect, useState } from 'react';
import * as THREE from 'three'
import { Tube, Box, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from '@react-three/fiber'
import { FunctionComponent, useRef } from "react"
import {  obstacleIndex } from './qi-tunnel-obstacles';
import { QiTunnelJoystick } from './qi-tunnel-joystick';


const TubeGeometry = ({
    radius,
    angle,
}: {
    radius: number,
    angle: number,
}) => {
    const tubePath = React.useMemo(() => {
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        const pathPoints = [
            new THREE.Vector3(x, y, 0), // Start point
            new THREE.Vector3(x, y, -10000), // End point
        ];

        return new THREE.CatmullRomCurve3(pathPoints);
    }, [radius, angle]);

    return (
        <Tube args={[tubePath, 2, 0.5, 20, true]}>
              <meshBasicMaterial color="#979695" />
        </Tube>
    );
};

const MAX_SPEED = 2;

export const QiTunnel: FunctionComponent = () => {
    const collisionBox = useRef<THREE.Mesh>(null);
    const [position, setPosition] = useState<[number, number]>([0, 0]);
    const velocity = useRef(1);
    const acceleration = useRef(0.02);
    const [obstacles, setObstacles] = useState<Array<{
        id: number;
        ref: React.MutableRefObject<THREE.Mesh | null>;
        rotation: number;
        name: keyof typeof obstacleIndex;
        position: number;
        rotationDirection: 1 | -1;
    }>>([]);

    useEffect(() => {
        const interval = setInterval(() => setObstacles((oldObstacles) => {
            velocity.current = Math.min(
                velocity.current + acceleration.current, 
                MAX_SPEED
            );
            const startPosition = -1000;
            const distanceBetweenObstacles = 200;
            const obstacleCopy = oldObstacles
                .map((obstacle) => ({
                    ...obstacle,
                    position: obstacle.position + velocity.current,
                }))
                .filter((obstacle) => {
                    return obstacle.position < 0 
                })
            const firstObject = obstacleCopy.at(0);
            const lastObject = obstacleCopy.at(-1);
            if (
                firstObject && 
                firstObject.position > - 5 &&
                collisionBox.current && 
                firstObject.ref.current
            ) {
                if (checkIfInside(
                    collisionBox.current, 
                    firstObject.ref.current
                )) {
                    velocity.current = -1;
                }
            }
            if (
                !lastObject || 
                Math.abs(lastObject.position - startPosition) > distanceBetweenObstacles
            ) {
                const id = Math.random();
                const allNames = Object.keys(obstacleIndex)
                const name = allNames[Math.floor(id * allNames.length)];
                obstacleCopy.push({
                    id,
                    ref: React.createRef(),
                    rotation: id * Math.PI * 2,
                    name: name as keyof typeof obstacleIndex,
                    position: startPosition,
                    rotationDirection: id > 0.5 ? 1 : -1,
                });
            }
            return obstacleCopy;
        }), 1000 / 60);

        return () =>  clearInterval(interval);
    }, []);

    console.log(position)

    return (
        <>
        <Canvas
            style={{
                height: 500,
                width: 500,
                backgroundColor: '#2a6fb5',
            }}
        >
            <PerspectiveCamera 
                makeDefault
                fov={75}
                position={[
                    0 + position[0] / 100 * 18,
                    0 - position[1] / 100 * 18,
                    0
                ]}
            />
            <Box
                ref={collisionBox} 
                args={[0.1, 0.1, 0.1]}
                position={[
                    0 + position[0] / 100 * 18,
                    0 - position[1] / 100 * 18,
                    -0.001
                ]}
             />
            <pointLight position={[0, 0, 0]} />
            {[...new Array(6).keys()].map((i, j, arr) => (
                <TubeGeometry key={i} radius={21} angle={i * Math.PI / arr.length * 2} />
            ))}
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
            <QiTunnelJoystick 
                position={position}
                onPositionChange={setPosition}
            />
        </>
    )
}

const raycaster = new THREE.Raycaster();

const checkIfInside = (meshA: THREE.Mesh, meshB: THREE.Mesh) => {
  const origin = meshA.position.clone();
  const direction = new THREE.Vector3(0, 0, -1);
  raycaster.set(origin, direction);
  
  const intersects = raycaster.intersectObject(meshB);
  const isInside = intersects.length > 0;
  
  return isInside;
};