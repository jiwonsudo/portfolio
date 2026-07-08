import { useMemo, useRef } from 'react';
import { Float, RoundedBox, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { Project } from '../types';
import { accentPalette } from '../data/projects';

export const wallSpacing = 11;

type ExhibitItemProps = {
  exhibit: Project;
  index: number;
  isMobile?: boolean;
};

// 폰 바디 규격
const bodyWidth = 2.16;
const bodyHeight = 4.5;
const bodyDepth = 0.22;
const screenMaxWidth = 2.0;
const screenMaxHeight = 4.24;
const screenZ = bodyDepth / 2 + 0.012;

function createMockupTexture(title: string, accent: string) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = 512;
  canvas.height = 1040;

  if (!context) {
    return new THREE.CanvasTexture(canvas);
  }

  context.fillStyle = '#fbfaf6';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = accent;
  context.fillRect(0, 0, canvas.width, 120);
  context.fillStyle = '#171717';
  context.font = '800 52px system-ui';
  context.fillText(title.split(' ')[0], 40, 260);
  context.fillStyle = '#e7e0d4';
  context.fillRect(40, 320, 432, 420);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** 부드러운 방사형 알파 (그림자·글로우 공용) */
function createRadialTexture(stops: [number, string][]) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');

  if (context) {
    const gradient = context.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );

    for (const [offset, color] of stops) {
      gradient.addColorStop(offset, color);
    }

    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

function screenSize(aspect: number): [number, number] {
  return aspect > screenMaxWidth / screenMaxHeight
    ? [screenMaxWidth, screenMaxWidth / aspect]
    : [screenMaxHeight * aspect, screenMaxHeight];
}

function PhoneScreen({ image }: { image: string }) {
  const maxAnisotropy = useThree((state) =>
    state.gl.capabilities.getMaxAnisotropy(),
  );
  const texture = useTexture(image, (loaded) => {
    const items = Array.isArray(loaded) ? loaded : [loaded];

    for (const item of items) {
      item.anisotropy = maxAnisotropy;
      item.generateMipmaps = true;
      item.minFilter = THREE.LinearMipmapLinearFilter;
      item.magFilter = THREE.LinearFilter;
      item.needsUpdate = true;
    }
  });
  const source = texture.image as { width: number; height: number };
  const [planeWidth, planeHeight] = screenSize(source.width / source.height);

  return (
    <mesh position={[0, 0, screenZ]}>
      <planeGeometry args={[planeWidth, planeHeight]} />
      <meshStandardMaterial
        color="#ffffff"
        map={texture}
        roughness={0.26}
        toneMapped={false}
        transparent
      />
    </mesh>
  );
}

function FallbackScreen({ texture }: { texture: THREE.Texture }) {
  const [planeWidth, planeHeight] = screenSize(0.49);

  return (
    <mesh position={[0, 0, screenZ]}>
      <planeGeometry args={[planeWidth, planeHeight]} />
      <meshStandardMaterial color="#ffffff" map={texture} roughness={0.26} />
    </mesh>
  );
}

export default function ExhibitItem({
  exhibit,
  index,
  isMobile = false,
}: ExhibitItemProps) {
  const x = (index + 1) * wallSpacing;
  const baseScale = isMobile ? 0.86 : 1;
  const accent = accentPalette[index % accentPalette.length];
  const groupRef = useRef<THREE.Group>(null);
  const fallbackTexture = useMemo(
    () => (exhibit.image ? null : createMockupTexture(exhibit.title, accent)),
    [accent, exhibit.image, exhibit.title],
  );
  const shadowTexture = useMemo(
    () =>
      createRadialTexture([
        [0, 'rgba(0,0,0,0.5)'],
        [1, 'rgba(0,0,0,0)'],
      ]),
    [],
  );
  const glowTexture = useMemo(
    () =>
      createRadialTexture([
        [0, 'rgba(255,255,255,1)'],
        [0.45, 'rgba(255,255,255,0.5)'],
        [1, 'rgba(255,255,255,0)'],
      ]),
    [],
  );

  // 카메라가 지날 때 폰이 앞으로 나오며 정면을 향한다.
  useFrame(({ camera }) => {
    const group = groupRef.current;

    if (!group) {
      return;
    }

    const distance = (camera.position.x - x) / wallSpacing;
    const focus = Math.max(0, 1 - Math.min(Math.abs(distance), 1.4) / 1.4);
    const targetScale = baseScale * (0.9 + focus * 0.16);

    group.scale.setScalar(group.scale.x + (targetScale - group.scale.x) * 0.12);
    group.position.z += (focus * 0.9 - group.position.z) * 0.12;
    group.rotation.y += (distance * 0.09 - group.rotation.y) * 0.12;
  });

  return (
    <group position={[x, 0, 0]} ref={groupRef} scale={baseScale}>
      {/* 뒤쪽 컬러 글로우 (키치 포인트) */}
      <mesh position={[0, 0.3, -0.7]}>
        <planeGeometry args={[5.8, 6.8]} />
        <meshBasicMaterial
          alphaMap={glowTexture}
          blending={THREE.AdditiveBlending}
          color={accent}
          depthWrite={false}
          opacity={0.45}
          transparent
        />
      </mesh>

      <Float
        floatIntensity={0.85}
        floatingRange={[-0.12, 0.12]}
        rotationIntensity={0.28}
        speed={1.35}
      >
        {/* 폰 바디 */}
        <RoundedBox
          args={[bodyWidth, bodyHeight, bodyDepth]}
          radius={0.34}
          smoothness={4}
        >
          <meshStandardMaterial
            color="#0e0e12"
            envMapIntensity={1.1}
            metalness={0.55}
            roughness={0.3}
          />
        </RoundedBox>

        {exhibit.image ? (
          <PhoneScreen image={exhibit.image} />
        ) : fallbackTexture ? (
          <FallbackScreen texture={fallbackTexture} />
        ) : null}
      </Float>

      {/* 바닥 그림자 */}
      <mesh position={[0, -2.95, 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.6, 3.6]} />
        <meshBasicMaterial
          depthWrite={false}
          map={shadowTexture}
          opacity={0.8}
          transparent
        />
      </mesh>
    </group>
  );
}
