// src/components/ThreeScene.js
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x20232a); // Set the background color

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Better lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);

    // Create a cube with a better color material
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x1f78b4 }); // Bright blue color
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Orbit controls for smooth camera movement
    const controls = new OrbitControls(camera, renderer.domElement);

    // Rotate on hover
    const handleMouseMove = (event) => {
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      cube.rotation.x = mouseY * Math.PI;
      cube.rotation.y = mouseX * Math.PI;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    
    return () => {
      mountRef.current.removeChild(renderer.domElement);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-96"></div>;
};

export default ThreeScene;
