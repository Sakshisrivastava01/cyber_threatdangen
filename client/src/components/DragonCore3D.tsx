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
    scene.fog = new THREE.FogExp2(0x0b000f, 0.015);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 180;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Group to hold all rotating elements (for mouse tilt and core spin)
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 2. Custom Extruded Dragon Logo Geometry
    const dragonShape = new THREE.Shape();
    
    // Draw a high-fidelity stylized dragon head outline
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
    dragonShape.lineTo(40, -10); // jaw connect to snout start

    // Eye cutout (hole in the mesh)
    const eyePath = new THREE.Path();
    eyePath.moveTo(42, 16);
    eyePath.lineTo(52, 20);
    eyePath.lineTo(46, 23);
    eyePath.closePath();
    dragonShape.holes.push(eyePath);

    // Extrusion Settings
    const extrudeSettings = {
      steps: 2,
      depth: 6,
      bevelEnabled: true,
      bevelThickness: 1.5,
      bevelSize: 1.2,
      bevelOffset: 0,
      bevelSegments: 4,
    };

    const logoGeometry = new THREE.ExtrudeGeometry(dragonShape, extrudeSettings);
    logoGeometry.center(); // centers geometry on origin

    // 3. Metallic Crimson Shader/Material
    const logoMaterial = new THREE.MeshStandardMaterial({
      color: 0x880011,
      metalness: 0.9,
      roughness: 0.25,
      emissive: 0x330005,
      bumpScale: 0.05,
    });

    const logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
    logoMesh.scale.set(0.65, 0.65, 0.65);
    logoMesh.castShadow = true;
    logoMesh.receiveShadow = true;
    mainGroup.add(logoMesh);

    // 4. Glowing Orbiting Rings
    const ringsGroup = new THREE.Group();
    mainGroup.add(ringsGroup);

    const ringCount = 3;
    const rings: THREE.Mesh[] = [];
    const ringSpeeds: number[] = [0.015, -0.02, 0.01];

    for (let i = 0; i < ringCount; i++) {
      const radius = 48 + i * 14;
      const tubeRadius = 0.5 + (ringCount - i) * 0.2;
      const ringGeo = new THREE.TorusGeometry(radius, tubeRadius, 8, 64);
      
      const ringMat = new THREE.MeshBasicMaterial({
        color: i === 0 ? 0xff003c : i === 1 ? 0xff3b30 : 0x990011,
        transparent: true,
        opacity: 0.7 - i * 0.15,
        wireframe: true,
      });

      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      
      // Rotate rings to sit at cybernetic angles
      ringMesh.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.4;
      ringMesh.rotation.y = (Math.random() - 0.5) * 0.4;
      
      ringsGroup.add(ringMesh);
      rings.push(ringMesh);
    }

    // 5. Neural Particle Swarm
    const particleCount = 280;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    const particleRadii = new Float32Array(particleCount);
    const particleHeights = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 35 + Math.random() * 50;
      const height = (Math.random() - 0.5) * 60;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      particleSpeeds[i] = 0.005 + Math.random() * 0.01;
      particleRadii[i] = radius;
      particleHeights[i] = height;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Custom shader/canvas texture for glowing red circular particles
    const createCircleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.3, 'rgba(255, 0, 60, 0.8)');
        grad.addColorStop(1, 'rgba(255, 0, 60, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 16, 16);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const particleMaterial = new THREE.PointsMaterial({
      size: 2.2,
      map: createCircleTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    mainGroup.add(particles);

    // 6. Cybernetic Lighting System
    const ambientLight = new THREE.AmbientLight(0x1a0205, 1.5);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xff003c, 6.0);
    dirLight1.position.set(50, 40, 100);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x990011, 4.0);
    dirLight2.position.set(-80, -40, 50);
    scene.add(dirLight2);

    const corePointLight = new THREE.PointLight(0xff003c, 10, 120);
    corePointLight.position.set(0, 0, 15);
    mainGroup.add(corePointLight);

    // 7. Mouse Interaction Parallax Bindings
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      mouseRef.current.targetX = x * 0.4;
      mouseRef.current.targetY = y * 0.4;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 8. Animation & Render Loop
    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Slow rotation of dragon mesh
      logoMesh.rotation.y = elapsedTime * 0.22;
      
      // Breathing glow effect
      const breathe = Math.sin(elapsedTime * 2.5) * 0.5 + 0.5;
      logoMaterial.emissiveIntensity = 0.3 + breathe * 0.7;
      corePointLight.intensity = 8 + breathe * 6;

      // Animate orbiting rings
      rings.forEach((ring, idx) => {
        ring.rotation.z += ringSpeeds[idx];
        ring.rotation.x += ringSpeeds[idx] * 0.3;
      });

      // Animate particles circulating around
      const posAttr = particleGeometry.getAttribute('position') as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const speed = particleSpeeds[i];
        const r = particleRadii[i];
        
        // Calculate new angle based on speed
        const currentAngle = elapsedTime * speed * 8 + i;
        posArray[i * 3] = Math.cos(currentAngle) * r;
        posArray[i * 3 + 2] = Math.sin(currentAngle) * r;
        
        // Subtle vertical oscillation
        posArray[i * 3 + 1] = particleHeights[i] + Math.sin(elapsedTime + i) * 3;
      }
      posAttr.needsUpdate = true;

      // Interpolate mouse movements for smooth parallax drift
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      mainGroup.rotation.y = mouse.x;
      mainGroup.rotation.x = -mouse.y;

      // Adjust camera zoom depth depending on boot stage
      // Stage 1/2: Far away. Stage 3/4: Pull forward to establish detail.
      const targetZoom = bootStage >= 3 ? 120 : 155;
      camera.position.z += (targetZoom - camera.position.z) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 10. Clean-up Resources
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);

      // Clean up WebGL objects
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
