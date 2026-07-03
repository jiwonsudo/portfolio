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

const artworkMaxWidth = 2.62;
const artworkMaxHeight = 3.34;

function createMockupTexture(title: string, accent: string) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = 512;
  canvas.height = 640;

  if (!context) {
    return new THREE.CanvasTexture(canvas);
  }

  context.fillStyle = '#fbfaf6';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = accent;
  context.fillRect(48, 48, 192, 18);
  context.fillStyle = '#171717';
  context.font = '800 44px system-ui';
  context.fillText(title.split(' ')[0], 48, 148);
  context.fillStyle = '#e7e0d4';
  context.fillRect(48, 200, 416, 300);
  context.fillStyle = accent;
  context.globalAlpha = 0.5;
  context.fillRect(48, 200, 416, 60);
  context.globalAlpha = 1;
  context.fillStyle = '#c9c0b2';
  context.fillRect(48, 536, 300, 16);
  context.fillRect(48, 570, 220, 16);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** 카드 아래 떠 있는 느낌을 주는 부드러운 그림자 블롭 */
function createBlobTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');

  if (context) {
    const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(40,30,20,0.42)');
    gradient.addColorStop(1, 'rgba(40,30,20,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

function ArtworkImage({ image }: { image: string }) {
  const maxAnisotropy = useThree((state) =>
    state.gl.capabilities.getMaxAnisotropy(),
  );
  // 스크린샷(대개 NPOT)이 기울어진 카드에서 밉맵/비등방 필터링 없이
  // 렌더되면 계단·픽셀 깨짐이 생긴다. 로드 콜백에서 필터를 명시해 선명하게.
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
  const aspect = source.width / source.height;
  const [planeWidth, planeHeight] =
    aspect > artworkMaxWidth / artworkMaxHeight
      ? [artworkMaxWidth, artworkMaxWidth / aspect]
      : [artworkMaxHeight * aspect, artworkMaxHeight];

  return (
    <mesh position={[0, 0.12, 0.3]}>
      <planeGeometry args={[planeWidth, planeHeight]} />
      <meshStandardMaterial
        color="#ffffff"
        map={texture}
        roughness={0.32}
        toneMapped={false}
      />
    </mesh>
  );
}

export default function ExhibitItem({
  exhibit,
  index,
  isMobile = false,
}: ExhibitItemProps) {
  const x = (index + 1) * wallSpacing;
  const baseScale = isMobile ? 0.84 : 1;
  const accent = accentPalette[index % accentPalette.length];
  const groupRef = useRef<THREE.Group>(null);
  const mockupTexture = useMemo(
    () => (exhibit.image ? null : createMockupTexture(exhibit.title, accent)),
    [accent, exhibit.image, exhibit.title],
  );
  const blobTexture = useMemo(() => createBlobTexture(), []);

  // 카메라가 이 작품을 지날 때 앞으로 나오며 정면을 향하고, 멀어지면 물러난다.
  useFrame(({ camera }) => {
    const group = groupRef.current;

    if (!group) {
      return;
    }

    const distance = (camera.position.x - x) / wallSpacing;
    const focus = Math.max(0, 1 - Math.min(Math.abs(distance), 1.4) / 1.4);
    const targetScale = baseScale * (0.9 + focus * 0.16);

    group.scale.setScalar(
      group.scale.x + (targetScale - group.scale.x) * 0.12,
    );
    group.position.z += (focus * 0.9 - group.position.z) * 0.12;
    group.rotation.y += (distance * 0.12 - group.rotation.y) * 0.12;
  });

  return (
    <group position={[x, 0, 0]} ref={groupRef} scale={baseScale}>
      <Float
        floatIntensity={0.9}
        floatingRange={[-0.12, 0.12]}
        rotationIntensity={0.4}
        speed={1.4}
      >
        {/* 컬러 라운드 카드 (뒤판) */}
        <RoundedBox
          args={[3.24, 4.04, 0.26]}
          position={[0, 0, -0.04]}
          radius={0.16}
          smoothness={3}
        >
          <meshStandardMaterial
            color={accent}
            envMapIntensity={0.8}
            metalness={0.1}
            roughness={0.38}
          />
        </RoundedBox>

        {/* 흰 매트 */}
        <RoundedBox
          args={[2.86, 3.66, 0.14]}
          position={[0, 0.1, 0.12]}
          radius={0.09}
          smoothness={3}
        >
          <meshStandardMaterial color="#fbfaf6" roughness={0.55} />
        </RoundedBox>

        {exhibit.image ? (
          <ArtworkImage image={exhibit.image} />
        ) : mockupTexture ? (
          <mesh position={[0, 0.12, 0.3]}>
            <planeGeometry args={[2.42, 3.02]} />
            <meshStandardMaterial
              color="#ffffff"
              map={mockupTexture}
              roughness={0.32}
              toneMapped={false}
            />
          </mesh>
        ) : null}
      </Float>

      {/* 바닥 그림자 블롭 */}
      <mesh position={[0, -2.9, 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.2, 4.2]} />
        <meshBasicMaterial
          depthWrite={false}
          map={blobTexture}
          transparent
        />
      </mesh>
    </group>
  );
}
