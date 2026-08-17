"use client";

import { MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { getCameraSpherical, sphericalToPosition, CameraKeyframe } from "@/lib/cinematic/cameraPath";

export function CameraRig({
  progressRef,
  keyframes,
  target = [0, 0, 0],
}: {
  progressRef: MutableRefObject<number>;
  keyframes: CameraKeyframe[];
  target?: [number, number, number];
}) {
  const { camera } = useThree();
  useFrame(() => {
    const { azimuth, elevation, distance } = getCameraSpherical(
      progressRef.current,
      keyframes
    );
    const [x, y, z] = sphericalToPosition(azimuth, elevation, distance);
    camera.position.set(x + target[0], y + target[1], z + target[2]);
    camera.lookAt(target[0], target[1], target[2]);
  });
  return null;
}
