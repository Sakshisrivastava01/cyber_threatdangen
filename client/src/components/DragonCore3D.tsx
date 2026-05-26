import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface DragonCore3DProps {
  bootStage: number;
}

const DragonCore3D: React.FC<DragonCore3DProps> = ({ bootStage }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // 1. Scene & Renderer Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b000f, 0.012);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 180;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Group to hold all rotating elements
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 2. Custom Extruded Dragon Logo Geometry
    const dragonShape = new THREE.Shape();
    
    // Stylized high-fidelity dragon head shape
    dragonShape.moveTo(40, -10);
    dragonShape.lineTo(60, -5);
    dragonShape.lineTo(75, 5);
    dragonShape.bezierCurveTo(85, 10, 92, 13, 92, 18); // snout tip
    dragonShape.lineTo(82, 23);
    dragonShape.lineTo(70, 20); // nose bridge
    dragonShape.bezierCurveTo(60, 18, 55, 28, 50, 38);
    dragonShape.bezierCurveTo(45, 52, 30, 72, 10, 82); // horn 1 top
    dragonShape.bezierCurveTo(20, 68, 30, 52, 35, 42); // horn 1 inner
    dragonShape.bezierCurveTo(25, 45, 10, 55, -10, 58); // horn 2 top
    dragonShape.bezierCurveTo(5, 48, 18, 38, 25, 32); // horn 2 inner
    dragonShape.bezierCurveTo(15, 28, 5, 34, -15, 36); // horn 3 top
    dragonShape.bezierCurveTo(0, 28, 12, 21, 20, 17); // horn 3 inner
    dragonShape.bezierCurveTo(10, 8, -5, -2, -20, -12); // back neck
    dragonShape.lineTo(-30, -7); // spike 1
    dragonShape.lineTo(-25, -22);
    dragonShape.lineTo(-45, -27); // spike 2
    dragonShape.lineTo(-30, -37);
    dragonShape.lineTo(-50, -52); // spike 3
    dragonShape.lineTo(-30, -57);
    dragonShape.bezierCurveTo(-15, -72, 5, -82, 20, -87); // lower neck back
    dragonShape.bezierCurveTo(15, -72, 12, -57, 10, -47); // jaw joint
    dragonShape.lineTo(25, -37);
    dragonShape.lineTo(40, -32);
    dragonShape.lineTo(45, -24);
    dragonShape.lineTo(35, -22);
    dragonShape.lineTo(40, -10); // jaw connect to snout

    // Eye cutout (hole in mesh)
    const eyePath = new THREE.Path();
    eyePath.moveTo(42, 16);
    eyePath.lineTo(52, 20);
    eyePath.lineTo(46, 23);
    eyePath.closePath();
    dragonShape.holes.push(eyePath);

    // Extrusion Settings
    const extrudeSettings = {
      steps: 2,
      depth: 8,
      bevelEnabled: true,
      bevelThickness: 2.0,
      bevelSize: 1.5,
      bevelOffset: 0,
      bevelSegments: 5,
    };

    const logoGeometry = new THREE.ExtrudeGeometry(dragonShape, extrudeSettings);
    logoGeometry.center();

    // 3. Metallic Crimson Shader/Material
    const logoMaterial = new THREE.MeshStandardMaterial({
      color: 0x99000a,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0x440003,
      emissiveIntensity: 0.8,
    });

    const logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
    logoMesh.scale.set(0.65, 0.65, 0.65);
    logoMesh.castShadow = true;
    logoMesh.receiveShadow = true;
    mainGroup.add(logoMesh);

    // 4. Cyber Platform at the Bottom
    const platformGeo = new THREE.CylinderGeometry(52, 58, 5, 32);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0x0c010c,
      roughness: 0.45,
      metalness: 0.9,
      emissive: 0x1f0103,
    });
    const platformMesh = new THREE.Mesh(platformGeo, platformMat);
    platformMesh.position.y = -65;
    platformMesh.receiveShadow = true;
    mainGroup.add(platformMesh);

    // Holographic Platform Ring
    const platformRingGeo = new THREE.TorusGeometry(55, 0.8, 8, 48);
    const platformRingMat = new THREE.MeshBasicMaterial({
      color: 0xff003c,
      transparent: true,
      opacity: 0.55,
      wireframe: true,
    });
    const platformRing = new THREE.Mesh(platformRingGeo, platformRingMat);
    platformRing.rotation.x = Math.PI / 2;
    platformRing.position.y = -62.5;
    mainGroup.add(platformRing);

    // 5. Glowing Orbiting Rings
    const ringsGroup = new THREE.Group();
    mainGroup.add(ringsGroup);

    const ringCount = 3;
    const rings: THREE.Mesh[] = [];
    const ringSpeeds: number[] = [0.012, -0.016, 0.008];

    for (let i = 0; i < ringCount; i++) {
      const radius = 54 + i * 15;
      const tubeRadius = 0.6 + (ringCount - i) * 0.15;
      const ringGeo = new THREE.TorusGeometry(radius, tubeRadius, 8, 64);
      
      const ringMat = new THREE.MeshBasicMaterial({
        color: i === 0 ? 0xff003c : i === 1 ? 0xff3b30 : 0xaa0011,
        transparent: true,
        opacity: 0.75 - i * 0.18,
        wireframe: true,
      });

      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      
      // Cybernetic angles
      ringMesh.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.5;
      ringMesh.rotation.y = (Math.random() - 0.5) * 0.5;
      
      ringsGroup.add(ringMesh);
      rings.push(ringMesh);
    }

    // 6. Neural Particle Swarm
    const particleCount = 300;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    const particleRadii = new Float32Array(particleCount);
    const particleHeights = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 40 + Math.random() * 55;
      const height = (Math.random() - 0.5) * 65;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      particleSpeeds[i] = 0.006 + Math.random() * 0.008;
      particleRadii[i] = radius;
      particleHeights[i] = height;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const createCircleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.3, 'rgba(255, 0, 60, 0.85)');
        grad.addColorStop(1, 'rgba(255, 0, 60, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 16, 16);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const particleMaterial = new THREE.PointsMaterial({
      size: 2.5,
      map: createCircleTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    mainGroup.add(particles);

    // 7. Cybernetic Lighting System
    const ambientLight = new THREE.AmbientLight(0x220206, 2.0);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xff003c, 7.5);
    dirLight1.position.set(60, 60, 100);
    dirLight1.castShadow = true;
    dirLight1.shadow.mapSize.width = 1024;
    dirLight1.shadow.mapSize.height = 1024;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xaa0015, 4.5);
    dirLight2.position.set(-80, -40, 50);
    scene.add(dirLight2);

    const corePointLight = new THREE.PointLight(0xff003c, 12, 140);
    corePointLight.position.set(0, 0, 15);
    mainGroup.add(corePointLight);

    // 8. Mouse Interaction Parallax Bindings
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      mouseRef.current.targetX = x * 0.35;
      mouseRef.current.targetY = y * 0.35;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 9. Animation & Render Loop
    const clock = new THREE.Clock();
    let animId: number;
    let currentY = -80; // Starts below inside the platform

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Dragon Logo slow spin
      logoMesh.rotation.y = elapsedTime * 0.25;

      // Emergence Rise from Platform
      // Stage 1/2: down at -75. Stage 3/4: rises to 0
      const targetY = bootStage >= 3 ? 0 : -75;
      currentY += (targetY - currentY) * 0.045;

      // Floating Idle vertical loop
      const floatOffset = bootStage >= 3 ? Math.sin(elapsedTime * 1.5) * 4.5 : 0;
      logoMesh.position.y = currentY + floatOffset;

      // Breathing Emissive Pulse Glow
      const breathe = Math.sin(elapsedTime * 2.8) * 0.5 + 0.5;
      logoMaterial.emissiveIntensity = 0.4 + breathe * 0.8;
      corePointLight.intensity = 10 + breathe * 7;

      // Orbiting rings
      rings.forEach((ring, idx) => {
        ring.rotation.z += ringSpeeds[idx];
        ring.rotation.x += ringSpeeds[idx] * 0.35;
      });

      // Animate particles
      const posAttr = particleGeometry.getAttribute('position') as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const speed = particleSpeeds[i];
        const r = particleRadii[i];
        const currentAngle = elapsedTime * speed * 7.5 + i;
        
        posArray[i * 3] = Math.cos(currentAngle) * r;
        posArray[i * 3 + 2] = Math.sin(currentAngle) * r;
        posArray[i * 3 + 1] = particleHeights[i] + Math.sin(elapsedTime + i) * 3.5;
      }
      posAttr.needsUpdate = true;

      // Interpolate mouse movements
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.07;
      mouse.y += (mouse.targetY - mouse.y) * 0.07;

      mainGroup.rotation.y = mouse.x;
      mainGroup.rotation.x = -mouse.y;

      // Camera zoom depth
      const targetZoom = bootStage >= 3 ? 125 : 160;
      camera.position.z += (targetZoom - camera.position.z) * 0.045;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);

      logoGeometry.dispose();
      logoMaterial.dispose();
      rings.forEach(ring => {
        ring.geometry.dispose();
        if (Array.isArray(ring.material)) {
          ring.material.forEach(m => m.dispose());
        } else {
          ring.material.dispose();
        }
      });
      platformGeo.dispose();
      platformMat.dispose();
      platformRingGeo.dispose();
      platformRingMat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [bootStage]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[350px] md:min-h-[500px] relative flex items-center justify-center pointer-events-auto"
    />
  );
};

export default DragonCore3D;
