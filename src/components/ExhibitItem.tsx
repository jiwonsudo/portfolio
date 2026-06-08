import { useEffect, useMemo, useRef } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { ExhibitData } from '../types';

export const wallSpacing = 9.2;

type ExhibitItemProps = {
  exhibit: ExhibitData;
  index: number;
  isMobile?: boolean;
  shadowsEnabled?: boolean;
};

function createMockupTexture(title: string, accent: string) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = 512;
  canvas.height = 640;

  if (!context) {
    return new THREE.CanvasTexture(canvas);
  }

  context.fillStyle = '#f7f3ec';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = accent;
  context.fillRect(48, 48, 192, 18);
  context.fillStyle = '#171717';
  context.font = '700 42px system-ui';
  context.fillText(title.split(' ')[0], 48, 142);
  context.fillStyle = '#d8d1c5';
  context.fillRect(48, 190, 416, 292);
  context.strokeStyle = '#948b7d';
  context.lineWidth = 2;

  for (let x = 96; x < 464; x += 82) {
    context.beginPath();
    context.moveTo(x, 190);
    context.lineTo(x, 482);
    context.stroke();
  }

  for (let y = 238; y < 482; y += 62) {
    context.beginPath();
    context.moveTo(48, y);
    context.lineTo(464, y);
    context.stroke();
  }

  context.fillStyle = '#81786b';
  context.fillRect(48, 536, 300, 16);
  context.fillRect(48, 570, 220, 16);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function ArtworkImage({ image }: { image: string }) {
  const texture = useTexture(image);

  return (
    <mesh castShadow position={[0, 0, 0.26]}>
      <planeGeometry args={[2.34, 2.9]} />
      <meshStandardMaterial
        color="#ffffff"
        map={texture}
        roughness={0.42}
        transparent
      />
    </mesh>
  );
}

export default function ExhibitItem({
  exhibit,
  index,
  isMobile = false,
  shadowsEnabled = true,
}: ExhibitItemProps) {
  const x = (index + 1) * wallSpacing;
  const scale = isMobile ? 0.72 : 1;
  const lightRef = useRef<THREE.SpotLight>(null);
  const targetRef = useRef<THREE.Object3D>(null);
  const mockupTexture = useMemo(
    () =>
      createMockupTexture(exhibit.title, index === 1 ? '#bc7147' : '#5c9d88'),
    [exhibit.title, index],
  );

  useEffect(() => {
    if (!lightRef.current || !targetRef.current) {
      return;
    }

    lightRef.current.target = targetRef.current;
  }, []);

  return (
    <group position={[x, 0, 0]} scale={scale}>
      <object3D ref={targetRef} position={[0, 0.1, 0.05]} />
      <spotLight
        angle={0.34}
        castShadow={shadowsEnabled}
        color="#ffe2aa"
        decay={1}
        distance={13}
        intensity={16}
        penumbra={0.82}
        position={[0, 5.1, 3.4]}
        ref={lightRef}
        shadow-mapSize-height={shadowsEnabled ? 1024 : 256}
        shadow-mapSize-width={shadowsEnabled ? 1024 : 256}
      />
      <mesh
        castShadow={shadowsEnabled}
        position={[0, 0, -1.38]}
        receiveShadow={shadowsEnabled}
      >
        <boxGeometry args={[4.45, 7.15, 0.44]} />
        <meshStandardMaterial color="#fbfaf6" roughness={0.72} />
      </mesh>
      <mesh castShadow={shadowsEnabled} position={[0, 0, 0.08]}>
        <boxGeometry args={[2.86, 3.48, 0.22]} />
        <meshStandardMaterial
          color="#1a1713"
          metalness={0.12}
          roughness={0.48}
        />
      </mesh>
      {exhibit.image ? (
        <ArtworkImage image={exhibit.image} />
      ) : (
        <mesh castShadow={shadowsEnabled} position={[0, 0, 0.26]}>
          <planeGeometry args={[2.34, 2.9]} />
          <meshStandardMaterial
            color="#ffffff"
            map={mockupTexture}
            roughness={0.42}
          />
        </mesh>
      )}
    </group>
  );
}
