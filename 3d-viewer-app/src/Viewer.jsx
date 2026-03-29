import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Float, PresentationControls } from "@react-three/drei";

// Thuật toán dựng Mô Hình Vật Thể Kim Loại Sáng Bóng Dạng Xoắn bằng WebGL
function GlowingObject({ color }) {
  const meshRef = useRef();
  
  // Xoay liên tục thời gian thực 60FPS
  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * 0.4;
    meshRef.current.rotation.x += delta * 0.2;
  });

  return (
    <mesh ref={meshRef} castShadow>
      <torusKnotGeometry args={[1.2, 0.4, 200, 40]} />
      {/* Tính Toán Phản Quang Ánh Sáng Môi Trường Vật Lý (Physical Material) y hệt Thủy Tinh Khối Apple */}
      <meshPhysicalMaterial 
        color={color || "#6366f1"}
        metalness={0.9}
        roughness={0.05}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </mesh>
  );
}

// Bảng Tương Tác Kính Thực Tế Ảo Chiếm Màn Hình
export default function Viewer({ color, onClose }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(25px)', zIndex: 99999, display: 'flex', flexDirection: 'column' }}>
      
      {/* Vách điều hướng thoát AR */}
      <div style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: 'white', margin: 0, fontWeight: '800', fontFamily: 'sans-serif' }}>Trạm Render Không Gian Thực Tế Ảo (3D AR) 🕶️</h2>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 25px', borderRadius: '99px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: 'all 0.2s' }} onMouseOver={e => e.target.style.background = 'rgba(239,68,68,0.8)'} onMouseOut={e => e.target.style.background = 'rgba(255,255,255,0.1)'}>
          ❌ Rút Kính (Thoát AR)
        </button>
      </div>

      <div style={{ flex: 1, position: 'relative' }}>
        {/* Máy Quay Phim Đèn Studio ảo 3 Chiều (Three.js Canvas) */}
        <Canvas shadows camera={{ position: [0, 0, 6], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <spotLight position={[10, 15, 10]} angle={0.2} penumbra={1} intensity={2} castShadow />
          
          {/* Môi trường phản chiếu ánh sáng giả lập của STUDIO */}
          <Environment preset="studio" />
          
          {/* Thuật toán Kéo nhả đàn hồi Chuột y hệt xem đồ táo */}
          <PresentationControls 
            global 
            config={{ mass: 2, tension: 500 }} 
            snap={{ mass: 4, tension: 1500 }} 
            rotation={[0, 0.3, 0]} 
            polar={[-Math.PI / 3, Math.PI / 3]} 
            azimuth={[-Math.PI / 1.4, Math.PI / 2]}
          >
            {/* Phao Lơ Lửng Rung Lắc Xung Quanh Trục */}
            <Float speed={2.5} rotationIntensity={1.5} floatIntensity={2}>
              <GlowingObject color={color} />
            </Float>
          </PresentationControls>

          {/* Đổ Bóng Xuống Mặt Đất Ảo (Ground Reflection Contact Shadow) */}
          <ContactShadows position={[0, -2.5, 0]} opacity={0.6} scale={15} blur={2.5} far={4.5} color="#000" />
          
          {/* Controls quay tay 360 nhưng bị khóa Pan ngang vì đang xài PresentationControls */}
          <OrbitControls enableZoom={true} enablePan={false} autoRotate={false} />
        </Canvas>
      </div>
      
      <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.6)', padding: '12px 30px', borderRadius: '30px', color: '#f8fafc', pointerEvents: 'none', border: '1px solid rgba(255,255,255,0.1)', fontWeight: '600', boxShadow: '0 0 20px rgba(0,0,0,0.5)', fontFamily: 'sans-serif' }}>
        <span>👇 Kéo giữ chuột để xoay vật thể 360° - Cuộn chuột để Thu Phóng Nhìn Sâu</span>
      </div>
    </div>
  );
}
