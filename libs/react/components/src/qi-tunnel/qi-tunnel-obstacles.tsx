import { MeshTransmissionMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { forwardRef, useMemo, useRef } from "react";
import { mergeRefs } from "react-merge-refs";
import * as THREE from "three";

type QiTunnelObstacleProps = {
    position: [number,number, number];
    rotation: [number,number, number];
    rotationDirection: 1 | -1;
}

type ExtrudeGeometryProps = QiTunnelObstacleProps & {
    path: THREE.Shape;
}

const OUTER_RADIUS = 20;
const ROTATION_SPEED = 0.01;

const ExtrudeGeometry = forwardRef<THREE.Mesh, ExtrudeGeometryProps>((
    props, 
    ref
) => {
    const diskRef = useRef<THREE.Mesh>(null);
    const mergedRef = mergeRefs([diskRef, ref]); 

    useFrame(() => {
        if (diskRef.current) {
            diskRef.current.rotation.z += ROTATION_SPEED * props.rotationDirection;
            diskRef.current.position.z = props.position[2];
        }
    });

    const geometry = new THREE.ExtrudeGeometry(props.path, {
        depth: 3,
        bevelEnabled: false,
        curveSegments: 64,
      });

    return (
        <mesh
            ref={mergedRef}
            geometry={geometry}
            position={props.position}
            rotation={props.rotation}
        >
            <MeshTransmissionMaterial
                distortionScale={0}
                temporalDistortion={0}
                roughness={0.5}
                resolution={128}
                samples={16}
                thickness={1}
                envMapIntensity={1}
                color="#fdfdfd" 
                metalness={0} 
                transmission={0}
            />
        </mesh>
    )
});

export const DiskWithThreeHoles = forwardRef<THREE.Mesh, QiTunnelObstacleProps>((props, ref) => {


    const path = useMemo(() => {
        const cutoutRadius = 12;
        const cutoutSize = 7;
        
        const outerCircle = new THREE.Shape();
        outerCircle.absarc(0, 0, OUTER_RADIUS, 0, Math.PI * 2, false);

        [...new Array(3).keys()].forEach((i) => {
            const angle = i * Math.PI * 2 / 3;
            const x = cutoutRadius * Math.cos(angle);
            const y = cutoutRadius * Math.sin(angle);
            const innerCircle = new THREE.Path();
            innerCircle.absarc(x, y, cutoutSize, 0, Math.PI * 2, true);
            outerCircle.holes.push(innerCircle);
        });
        return outerCircle;
    }, []);

    return (<ExtrudeGeometry ref={ref} {...props} path={path}  />);
});

export const DiskWithRectangleSlot = forwardRef<THREE.Mesh, QiTunnelObstacleProps>((props, ref) => {


    const path = useMemo(() => {
        const slotWidth = 12;
        const slotHeight = 24;

        const outerCircle = new THREE.Shape();
        outerCircle.absarc(0, 0, OUTER_RADIUS, 0, Math.PI * 2, false);

        const slotRect = new THREE.Path();
        slotRect.moveTo(-slotWidth / 2, -slotHeight / 2);
        slotRect.lineTo(slotWidth / 2, -slotHeight / 2);
        slotRect.lineTo(slotWidth / 2, slotHeight / 2);
        slotRect.lineTo(-slotWidth / 2, slotHeight / 2);
        slotRect.lineTo(-slotWidth / 2, -slotHeight / 2);

        outerCircle.holes.push(slotRect);
        return outerCircle;
    }, []);

    return (<ExtrudeGeometry ref={ref} {...props} path={path} />);
});

export const DiskWithRoundedSLot = forwardRef<THREE.Mesh, QiTunnelObstacleProps>((props, ref) => {
    const path = useMemo(() => {
        const pizzaRadius = 18;
        const pizzaAngle = Math.PI / 2;
        const cutoutSize = 8;

        const outerCircle = new THREE.Shape();
        outerCircle.absarc(0, 0, OUTER_RADIUS, 0, Math.PI * 2, false);

        const keyHolePath = new THREE.Path();
        keyHolePath.moveTo(0, 0);
        keyHolePath.absarc(0, 0, cutoutSize, 0, Math.PI * 2, true);
        keyHolePath.moveTo(pizzaRadius, 0);
        keyHolePath.absarc(0, 0, pizzaRadius, 0, pizzaAngle, false);
        keyHolePath.lineTo(0, 0);

        outerCircle.holes.push(keyHolePath);
        return outerCircle;
    }, []);

    return (<ExtrudeGeometry ref={ref} {...props} path={path} />);
});

export const DiskWithKeyHole = forwardRef<THREE.Mesh, QiTunnelObstacleProps>((props, ref) => {
    const path = useMemo(() => {
        const pizzaRadius = 18;
        const pizzaAngle = Math.PI / 2;
        const cutoutSize = 8;

        const outerCircle = new THREE.Shape();
        outerCircle.absarc(0, 0, OUTER_RADIUS, 0, Math.PI * 2, false);

        const keyHolePath = new THREE.Path();
        keyHolePath.moveTo(0, 0);
        keyHolePath.absarc(0, 0, cutoutSize, 0, Math.PI * 2, false);
        keyHolePath.moveTo(pizzaRadius * Math.cos(pizzaAngle), pizzaRadius * Math.sin(pizzaAngle));
        keyHolePath.lineTo(0, 0);

        outerCircle.holes.push(keyHolePath);
        return outerCircle;
    }, []);

    return (<ExtrudeGeometry ref={ref} {...props} path={path} />);
});

export const obstacleIndex = {
    DiskWithThreeHoles: DiskWithThreeHoles,
    DiskWithRectangleSlot: DiskWithRectangleSlot,
    DiskWithRoundedSLot: DiskWithRoundedSLot,
    DiskWithKeyHole: DiskWithKeyHole,
}