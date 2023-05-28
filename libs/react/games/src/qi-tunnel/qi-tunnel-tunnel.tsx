import { useMemo } from "react";
import { Tube } from "@react-three/drei";
import { Vector3, CatmullRomCurve3 } from "three";
import type { FunctionComponent } from "react";

const TubeGeometry = ({ radius, angle }: { radius: number; angle: number }) => {
  const tubePath = useMemo(() => {
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    const pathPoints = [
      new Vector3(x, y, 0), // Start point
      new Vector3(x, y, -10000), // End point
    ];

    return new CatmullRomCurve3(pathPoints);
  }, [radius, angle]);

  return (
    <Tube args={[tubePath, 2, 0.5, 20, true]}>
      <meshBasicMaterial color="#979695" />
    </Tube>
  );
};

export const QiTunnelTunnel: FunctionComponent = () => {
  return (
    <>
      {[...new Array(6).keys()].map((i, j, arr) => (
        <TubeGeometry
          key={i}
          radius={21}
          angle={((i * Math.PI) / arr.length) * 2}
        />
      ))}
    </>
  );
};
