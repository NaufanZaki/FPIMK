import React, { useState, useEffect, useRef } from "react";
import type { FC, ReactNode } from "react";
import {
  Mail,
  Phone,
  MapPin,
  BrainCircuit,
  Code,
  Smartphone,
  Star,
  ArrowRight,
  Search,
  Edit3,
  Code2,
  Rocket,
  Eye,
  PenTool,
  Database,
  ShieldCheck,
  BarChart,
} from "lucide-react";
import * as THREE from "three";
import FloatingCard from "./components/FloatingCard";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import TentangSection from "./components/TentangSection";
import Header from "./components/Header";
import Chatbot from './components/Chatbot';

interface FadeInProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  className?: string;
}

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

interface SectionWrapperProps {
  id: string;
  children: ReactNode;
  className?: string;
}

interface SectionTitleProps {
  children: ReactNode;
}

const useOnScreen = (options?: IntersectionObserverInit) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, options);
    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, options]);
  return [ref, isVisible] as const;
};

const FadeIn: FC<FadeInProps> = ({
  children,
  direction = "up",
  delay = 0,
  className = "",
}) => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
  const directionClasses = {
    up: "translate-y-10",
    down: "-translate-y-10",
    left: "-translate-x-10",
    right: "translate-x-10",
  };
  const delayClass = `delay-${delay}`;
  return (
    <div
      ref={ref}
      className={`${className} transition-all ease-in-out duration-1000 ${delayClass} ${isVisible
          ? "opacity-100 translate-x-0 translate-y-0"
          : `opacity-0 ${directionClasses[direction]}`
        }`}
    >
      {children}
    </div>
  );
};

const SpotlightCard: FC<SpotlightCardProps> = ({
  children,
  className = "",
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [transform, setTransform] = useState("");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const rotateY = (mouseX / rect.width - 0.5) * -15;
    const rotateX = (mouseY / rect.height - 0.5) * 15;

    setPosition({ x: mouseX, y: mouseY });
    setTransform(
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    );
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };
  const handleMouseLeave = () => {
    setOpacity(0);
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg)");
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ transform }}
      className={`relative p-8 rounded-2xl bg-slate-800/70 border border-slate-700/80 shadow-2xl overflow-hidden transition-transform duration-300 ease-out ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(34, 211, 238, 0.1), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
};

const HeroCanvas: FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    // Main Crystal Object
    const geometry = new THREE.IcosahedronGeometry(1.5, 0);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00aaff,
      emissiveIntensity: 0.3,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: true,
    });
    const crystal = new THREE.Mesh(geometry, material);
    scene.add(crystal);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    const pointLight = new THREE.PointLight(0x00ffff, 3, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xff00ff, 2, 100);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    // Starfield
    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
      starVertices.push(
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000
      );
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starVertices, 3)
    );
    const starMaterial = new THREE.PointsMaterial({
      color: 0xaaaaaa,
      size: 0.03,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Handle Mouse Move (merged)
    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Animation Loop
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      crystal.rotation.x = elapsedTime * 0.1;
      crystal.rotation.y = elapsedTime * 0.2;
      stars.rotation.y = elapsedTime * 0.01;

      // Smooth camera parallax
      camera.position.x += (mouse.current.x * 2 - camera.position.x) * 0.02;
      camera.position.y += (mouse.current.y * 2 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
      currentMount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={mountRef} className="absolute top-0 left-0 w-full h-full z-0" />
  );
};

const Hero: FC = () => {
  return (
    <section
      id="hero"
      className="relative h-screen grid md:grid-cols-2 items-center bg-slate-900 overflow-hidden"
    >
      <div className="z-20 relative px-6 sm:px-12 md:px-16 space-y-6 text-white">
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl sm:text-6xl md:text-7xl font-black leading-tight tracking-tighter uppercase"
        >
          Transform Your <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-br from-cyan-400 to-purple-400">
            Digital Future
          </span>
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-gray-300 text-lg max-w-lg"
        >
          Partner teknologi untuk Mahasiswa & UMKM. Dari MVP hingga produk siap
          rilis.
        </motion.p>

        <motion.a
          href="#kontak"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="inline-block bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          Mulai Proyek Anda
        </motion.a>
      </div>

      <div className="absolute inset-0 md:relative md:inset-auto h-full w-full z-10">
        <HeroCanvas />
        <div className="absolute inset-0 pointer-events-none">
          <FloatingCard
            text="Web Development"
            style={{ top: "20%", left: "10%" }}
          />
          <FloatingCard
            text="Artificial Intelligence"
            style={{ top: "40%", right: "8%" }}
          />
          <FloatingCard
            text="IoT & Devices"
            style={{ bottom: "18%", left: "15%" }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
      </div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 animate-bounce text-cyan-400">
        <a href="#tentang" className="flex flex-col items-center">
          <svg
            className="w-6 h-6 mb-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
          <span className="text-xs uppercase tracking-wide">Scroll</span>
        </a>
      </div>
    </section>
  );
};

const SectionWrapper: FC<SectionWrapperProps> = ({
  id,
  children,
  className = "",
}) => (
  <section id={id} className={`py-24 sm:py-28 md:py-32 relative ${className}`}>
    <div className="absolute inset-0 bg-grid-slate-800/[0.07] [mask-image:linear-gradient(to_bottom,white_10%,transparent_90%)]"></div>
    <div className="container mx-auto px-6 relative z-10">{children}</div>
  </section>
);

const SectionTitle: FC<SectionTitleProps> = ({ children }) => (
  <FadeIn>
    <div className="text-center mb-16 md:mb-20">
      <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
        {children}
      </h2>
      <div className="w-24 h-1 bg-cyan-400 mx-auto rounded-full"></div>
    </div>
  </FadeIn>
);

const About: FC = () => (
  <section id="tentang" className="relative">
    <SectionTitle>Tentang Kami</SectionTitle>
    <div className="relative z-10 bg-slate-900">
      <div className="container mx-auto px-6 py-24 sm:py-28 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <FadeIn direction="left">
            <div>
              <h3 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-400">
                Partner Inovasi Digital Anda.
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed mb-4 text-justify">
                INOVYTE adalah partner teknologi yang berdedikasi mengubah ide
                brilian menjadi kenyataan, dengan fokus pada pemberdayaan
                mahasiswa HMIT dan UMKM di seluruh Indonesia.
              </p>
              <p className="text-gray-300 mb-8 text-justify">
                Kami percaya setiap orang berhak mendapatkan akses ke teknologi
                berkualitas. Kami menyediakan keahlian teknis, dari pengembangan
                Minimum Viable Product (MVP) untuk validasi ide, hingga aplikasi
                skala penuh yang siap untuk pasar global.
              </p>
              <div className="my-6 p-6 bg-slate-800/60 border border-slate-700 rounded-xl text-gray-300 text-md italic shadow-inner backdrop-blur">
                "Visi kami adalah menjadi katalisator yang menghubungkan potensi
                kreatif dengan solusi teknologi transformatif."
              </div>
              <a
                href="#layanan"
                className="group inline-flex items-center text-cyan-400 font-bold transition-all duration-300"
              >
                Lihat Layanan Kami{" "}
                <ArrowRight
                  size={20}
                  className="ml-2 group-hover:translate-x-2 transition-transform"
                />
              </a>
            </div>
          </FadeIn>
          <FadeIn direction="right">
            <div className="relative flex items-center justify-center overflow-hidden min-h-[24rem]">
              <div className="absolute inset-0 -inset-x-16 -inset-y-16">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-br from-purple-400/15 via-pink-400/10 to-transparent rounded-full blur-3xl animate-blob" />
                <div className="absolute top-1/3 right-1/4 w-56 h-64 bg-gradient-to-tl from-cyan-400/20 via-blue-400/15 to-transparent rounded-full blur-2xl animate-blob animation-delay-2000" />
                <div className="absolute bottom-1/4 left-1/3 w-48 h-56 bg-gradient-to-tr from-violet-400/12 via-fuchsia-400/18 to-transparent rounded-full blur-3xl animate-blob animation-delay-4000" />
              </div>

              <div className="absolute -inset-8">
                <div className="absolute top-[15%] right-[20%] w-2 h-2 bg-cyan-300/70 rounded-full animate-pulse" />
                <div className="absolute bottom-[25%] left-[12%] w-1.5 h-1.5 bg-purple-300/80 rounded-full animate-pulse animation-delay-2000" />
                <div className="absolute top-[35%] left-[15%] w-1 h-1 bg-pink-300/60 rounded-full animate-pulse animation-delay-4000" />
                <div
                  className="absolute bottom-[18%] right-[25%] w-2.5 h-2.5 bg-blue-300/50 rounded-full animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                />
                <div
                  className="absolute top-[28%] right-[35%] w-1.5 h-1.5 bg-violet-300/70 rounded-full animate-pulse"
                  style={{ animationDelay: "2.5s" }}
                />
                <div className="absolute top-[45%] left-[25%] w-1 h-1 bg-cyan-300/60 rounded-full animate-pulse animation-delay-4000" />
                <div
                  className="absolute bottom-[35%] right-[15%] w-1.5 h-1.5 bg-pink-300/70 rounded-full animate-pulse"
                  style={{ animationDelay: "1.8s" }}
                />
              </div>

              <div className="absolute -inset-12">
                <div
                  className="absolute top-[20%] left-[28%] w-6 h-6 border border-cyan-300/20 rotate-12 animate-spin"
                  style={{
                    animationDuration: "25s",
                    animationDirection: "reverse",
                  }}
                />
                <div
                  className="absolute bottom-[22%] right-[32%] w-4 h-4 border border-purple-300/25 rounded-full animate-bounce"
                  style={{ animationDelay: "1.2s", animationDuration: "3s" }}
                />
                <div
                  className="absolute top-[38%] right-[18%] w-3 h-8 border-l border-pink-300/15 rotate-45 animate-pulse"
                  style={{ animationDelay: "3s" }}
                />
                <div
                  className="absolute bottom-[40%] left-[22%] w-5 h-5 border border-violet-300/20 rotate-45 animate-spin"
                  style={{ animationDuration: "20s", animationDelay: "2s" }}
                />
              </div>

              {/* Central content with improved spacing */}
              <div className="relative text-center z-10 px-4 py-8">
                <div className="mb-6 flex justify-center">
                  <div className="w-14 h-0.5 bg-gradient-to-r from-cyan-300/60 via-purple-300/80 to-transparent rounded-full" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-gray-200 via-gray-50 to-gray-300 leading-relaxed tracking-wide">
                  Mewujudkan Visi
                  <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-br from-cyan-300 via-purple-300 to-fuchsia-300">
                    Melalui Kode
                  </span>
                </h1>
                <div className="mt-6 flex justify-center">
                  <div className="w-10 h-0.5 bg-gradient-to-l from-transparent via-purple-300/70 to-cyan-300/60 rounded-full" />
                </div>
              </div>

              {/* Subtle grid overlay with natural masking */}
              <div className="absolute inset-0 bg-grid-slate-800/[0.02] [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black_70%)]" />
            </div>
          </FadeIn>
        </div>
      </div>
    </div>

    <TentangSection />
  </section>
);

const Services: FC = () => {
  type ServiceKey = "AI" | "Web" | "IoT";

  const [activeTab, setActiveTab] = useState<ServiceKey>("AI");

  const servicesData = {
    AI: {
      icon: <BrainCircuit size={24} />,
      title: "Layanan AI",
      description:
        "Mengubah data kompleks menjadi keunggulan kompetitif dengan solusi AI yang cerdas dan terukur.",
      details: [
        {
          icon: <Eye size={18} />,
          name: "Computer Vision",
          desc: "Deteksi objek, pengenalan wajah, dan analisis gambar.",
        },
        {
          icon: <PenTool size={18} />,
          name: "Natural Language Processing (NLP)",
          desc: "Chatbot, analisis sentimen, dan pemrosesan teks.",
        },
        {
          icon: <BarChart size={18} />,
          name: "Predictive Analytics",
          desc: "Prediksi tren, permintaan pasar, dan perilaku pengguna.",
        },
      ],
    },
    Web: {
      icon: <Code size={24} />,
      title: "Pengembangan Web",
      description:
        "Menciptakan pengalaman web yang mulus, responsif, dan aman untuk menjangkau audiens Anda.",
      details: [
        {
          icon: <PenTool size={18} />,
          name: "Company Profile & Landing Page",
          desc: "Desain modern untuk citra perusahaan yang kuat.",
        },
        {
          icon: <Database size={18} />,
          name: "Aplikasi Web & Dashboard",
          desc: "Sistem dinamis untuk manajemen data dan operasional.",
        },
        {
          icon: <ShieldCheck size={18} />,
          name: "Integrasi API & Sistem",
          desc: "Menghubungkan web Anda dengan layanan pihak ketiga.",
        },
      ],
    },
    IoT: {
      icon: <Smartphone size={24} />,
      title: "Pengembangan IoT",
      description:
        "Menghubungkan perangkat fisik ke dunia digital untuk otomatisasi dan monitoring cerdas.",
      details: [
        {
          icon: <Rocket size={18} />,
          name: "Prototipe & MVP",
          desc: "Pengembangan perangkat keras untuk validasi konsep.",
        },
        {
          icon: <BarChart size={18} />,
          name: "Dashboard Monitoring Real-time",
          desc: "Visualisasi data sensor untuk pengambilan keputusan.",
        },
        {
          icon: <Code2 size={18} />,
          name: "Sistem Otomatisasi Cerdas",
          desc: "Mengontrol perangkat dari jarak jauh berbasis data.",
        },
      ],
    },
  };

  const activeService = servicesData[activeTab];

  return (
    <SectionWrapper id="layanan">
      <SectionTitle>Layanan Unggulan</SectionTitle>
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <FadeIn direction="left" className="lg:col-span-1">
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
            {(Object.keys(servicesData) as ServiceKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`w-full p-4 sm:p-6 rounded-xl text-left transition-all duration-300 border-2 ${activeTab === key
                    ? "bg-slate-700/80 border-cyan-400"
                    : "bg-slate-800/50 border-slate-700 hover:bg-slate-700/50"
                  }`}
              >
                <div className="flex items-center flex-wrap gap-3 sm:gap-4">
                  <div
                    className={`${activeTab === key ? "text-cyan-400" : "text-gray-400"
                      }`}
                  >
                    {servicesData[key].icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-white">
                    {servicesData[key].title}
                  </h3>
                </div>
              </button>
            ))}
          </div>
        </FadeIn>
        <FadeIn direction="right" className="lg:col-span-2">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {activeService.title}
            </h3>
            <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">
              {activeService.description}
            </p>
            <div className="space-y-4 sm:space-y-6 border-t border-slate-700 pt-4 sm:pt-6">
              {activeService.details.map((detail) => (
                <div
                  key={detail.name}
                  className="flex items-start gap-3 sm:gap-4"
                >
                  <div className="flex-shrink-0 p-2 bg-slate-700/50 rounded-md text-cyan-400 border border-slate-600">
                    {detail.icon}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-white text-sm sm:text-base">
                      {detail.name}
                    </h4>
                    <p className="text-gray-500 text-xs sm:text-sm break-words">
                      {detail.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </SectionWrapper>
  );
};

const Process: FC = () => {
  const processSteps = [
    {
      icon: <Search size={32} />,
      title: "01. Konsultasi & Riset",
      description:
        "Kami memahami visi dan kebutuhan Anda secara mendalam untuk merancang strategi yang paling efektif dan terukur.",
    },
    {
      icon: <Edit3 size={32} />,
      title: "02. Desain & Prototipe",
      description:
        "Membuat desain antarmuka (UI/UX) yang intuitif dan prototipe interaktif untuk validasi konsep sebelum pengembangan.",
    },
    {
      icon: <Code2 size={32} />,
      title: "03. Pengembangan",
      description:
        "Tim developer kami menulis kode yang bersih, efisien, dan skalabel untuk membangun produk Anda sesuai spesifikasi.",
    },
    {
      icon: <Rocket size={32} />,
      title: "04. Peluncuran & Dukungan",
      description:
        "Men-deploy produk ke server dan memberikan dukungan berkelanjutan untuk memastikan performa yang optimal dan aman.",
    },
  ];

  return (
    <SectionWrapper id="proses">
      <SectionTitle>Proses Kerja Kami</SectionTitle>
      <div className="relative max-w-2xl mx-auto px-4 sm:px-6">
        {/* Garis vertikal */}
        <div className="absolute top-10 bottom-10 left-[49px] sm:left-[64px] w-0.5 bg-slate-700 z-0" />

        <div className="space-y-16 relative z-10">
          {processSteps.map((step, index) => (
            <FadeIn key={index} direction="up">
              <div className="flex items-start gap-6">
                {/* Bullet Icon */}
                <div className="w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center rounded-full border-2 border-slate-700 bg-slate-800 text-cyan-400 shrink-0">
                  {step.icon}
                </div>
                {/* Text */}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

const Testimonials: FC = () => {
  const testimonialsData = [
    {
      quote: "INOVYTE mengubah ide lomba kami menjadi MVP yang fungsional dan impresif. Dukungan teknis mereka sangat berharga. Berkat mereka, tim kami meraih juara pertama!",
      name: "Andi Pratama",
      title: "Ketua Tim Robotika, UGM",
      image: "https://placehold.co/100x100/14b8a6/ffffff?text=AP"
    },
    {
      quote: "Website baru dari INOVYTE benar-benar meningkatkan citra brand kami. Prosesnya kolaboratif dan hasilnya melebihi ekspektasi. Penjualan online meningkat 40%!",
      name: "Aldi Santos",
      title: "Pemilik, Batik Lestari (UMKM)",
      image: "https://placehold.co/100x100/8b5cf6/ffffff?text=RS"
    },
    {
      quote: "Sistem IoT untuk monitoring Parfum Mobil kami berjalan sempurna. Sangat membantu efisiensi operasional. Tim INOVYTE sangat profesional dan responsif.",
      name: "Budi Speed",
      title: "Pengusaha Parfum Mobil, Kenjeran",
      image: "https://placehold.co/100x100/f59e0b/ffffff?text=BS"
    },
    {
      quote: "INOVYTE dapat mengimprove kandang ayam saya sedemikian rupa dengan menggunakan Computer Vision mereka.",
      name: "Yoga Hartono",
      title: "Pengusaha Ayam, Solo",
      image: "https://placehold.co/100x100/f59e0b/ffffff?text=YH"
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const controls = useAnimation();
  const slideInterval = 3000; // Set interval to 3 seconds for faster animation

  // Function to handle changing slides
  const goToSlide = (index: number) => {
    const newIndex = (index + testimonialsData.length) % testimonialsData.length;
    setActiveIndex(newIndex);
    controls.set({ width: "0%" });
    controls.start({ width: "100%", transition: { duration: slideInterval / 1000, ease: "linear" } });
  };

  // Auto-play and progress bar functionality
  useEffect(() => {
    controls.start({ width: "100%", transition: { duration: slideInterval / 1000, ease: "linear" } });
    const interval = setInterval(() => {
      goToSlide(activeIndex + 1);
    }, slideInterval);
    return () => clearInterval(interval);
  }, [activeIndex, controls]);

  // Drag handling logic
  const handleDragEnd = (event: any, info: any) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -100 || velocity < -500) {
      goToSlide(activeIndex + 1);
    } else if (offset > 100 || velocity > 500) {
      goToSlide(activeIndex - 1);
    }
  };

  return (
    <SectionWrapper id="testimoni" className="bg-slate-900/50 overflow-hidden">
      <SectionTitle>Apa Kata Klien Kami?</SectionTitle>
      <div className="relative w-full h-[450px] sm:h-[400px] md:h-[380px] flex items-center justify-center" style={{ perspective: "1000px" }}>
        <AnimatePresence>
          {testimonialsData.map((testimonial, index) => {
            const offset = index - activeIndex;

            // Only render the active, previous, and next slides for performance
            if (Math.abs(offset) > 1) {
              return null;
            }

            return (
              <motion.div
                key={index}
                className="absolute w-11/12 max-w-3xl h-full"
                initial={{
                  x: `${offset * 100}%`,
                  scale: 1 - Math.abs(offset) * 0.2,
                  opacity: 1 - Math.abs(offset) * 0.5,
                  zIndex: testimonialsData.length - Math.abs(offset),
                }}
                animate={{
                  x: `${offset * 80}%`, // Adjust spacing between cards
                  scale: 1 - Math.abs(offset) * 0.2,
                  opacity: 1 - Math.abs(offset) * 0.4,
                  zIndex: testimonialsData.length - Math.abs(offset),
                }}
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
              >
                <SpotlightCard className="h-full">
                  <div className="flex flex-col h-full text-center">
                    <div className="mb-4 text-yellow-400 flex justify-center">
                      {[...Array(5)].map((_, i) => <Star key={i} className="mr-1" fill="currentColor" />)}
                    </div>
                    <p className="text-gray-300 italic text-lg lg:text-xl mb-6 flex-grow">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center justify-center mt-auto">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full mr-4 border-2 border-slate-600"
                        onError={(e) => { e.currentTarget.src = "https://placehold.co/100x100/1E293B/FFFFFF?text=Err"; }}
                      />
                      <div>
                        <h4 className="font-bold text-white text-lg">{testimonial.name}</h4>
                        <p className="text-gray-400">{testimonial.title}</p>
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      {/* Progress Bar and Navigation Dots */}
      <div className="flex justify-center items-center space-x-3 mt-12">
        {testimonialsData.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${activeIndex === index ? 'bg-cyan-400 scale-125' : 'bg-slate-600 hover:bg-slate-500'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      <div className="w-48 mx-auto mt-4 h-1 bg-slate-700 rounded-full overflow-hidden">
        <motion.div className="h-full bg-cyan-400" animate={controls} />
      </div>
    </SectionWrapper>
  );
};

const Portfolio: FC = () => {
  const portfolioItems = [
    {
      title: "Dashboard Prediksi Penjualan",
      category: "AI / Web",
      image: "/images/dashboard-sales-example.png",
    },
    {
      title: "Smart Irrigation Sistem",
      category: "IoT",
      image: "/images/smart-irrigation-example.jpeg",
    },
    {
      title: "Website Company Profile",
      category: "Web",
      image: "/images/web-compro-example.png",
    },
    {
      title: "Chatbot Kampus",
      category: "AI",
      image: "/images/chabot-kampus-example.png",
    },
  ];
  return (
    <SectionWrapper id="portofolio">
      <SectionTitle>Portofolio Pilihan</SectionTitle>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {portfolioItems.map((item, index) => (
          <FadeIn key={index} direction="up" delay={index * 150}>
            <div className="group bg-slate-800 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-cyan-500/20 hover:-translate-y-2 border border-slate-700">
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/600x400/334155/FFFFFF?text=Error";
                  }}
                />
                <div className="absolute top-3 right-3 bg-slate-900/50 text-white text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm border border-slate-700">
                  {item.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white">
                  {item.title}
                </h3>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </SectionWrapper>
  );
};

const Contact: FC = () => {
  const [formStatus, setFormStatus] = useState("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus(
      "Terima kasih! Pesan Anda terkirim. Kami akan segera menghubungi Anda."
    );
    (e.target as HTMLFormElement).reset();
    setTimeout(() => setFormStatus(""), 5000);
  };
  return (
    <SectionWrapper id="kontak" className="bg-slate-900/50">
      <FadeIn>
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Siap Memulai Proyek Anda?
          </h2>
          <p className="text-lg text-gray-400">
            Punya ide brilian? Mari kita diskusikan. Isi form di bawah atau
            hubungi kami langsung.
          </p>
        </div>
      </FadeIn>
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 bg-slate-800/50 border border-slate-700/80 rounded-2xl p-6 sm:p-10 backdrop-blur-sm">
        <FadeIn direction="left">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-300 block mb-2"
              >
                Nama
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-300 block mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="text-sm font-medium text-gray-300 block mb-2"
              >
                Jelaskan Kebutuhan Anda
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                className="w-full bg-slate-700/50 border-slate-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition-all"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/20"
            >
              Kirim Permintaan Proyek
            </button>
            {formStatus && (
              <p className="text-center text-green-400 mt-4 text-sm">
                {formStatus}
              </p>
            )}
          </form>
        </FadeIn>
        <FadeIn direction="right" delay={200}>
          <div className="text-white space-y-6 h-full flex flex-col justify-center">
            <h3 className="text-2xl font-semibold mb-2 text-cyan-400">
              Info Kontak
            </h3>
            <div className="flex items-start space-x-4">
              <Mail size={20} className="text-cyan-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Email</h4>
                <a
                  href="mailto:contact@inovyte.com"
                  className="text-gray-300 hover:text-cyan-400 transition-colors"
                >
                  contact@inovyte.com
                </a>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Phone size={20} className="text-cyan-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Telepon</h4>
                <a
                  href="tel:+621234567890"
                  className="text-gray-300 hover:text-cyan-400 transition-colors"
                >
                  +62 123 4567 890
                </a>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <MapPin size={20} className="text-cyan-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Lokasi</h4>
                <p className="text-gray-300">
                  Tulungagung, Jawa Timur, Indonesia
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </SectionWrapper>
  );
};

const Footer: FC = () => (
  <footer className="bg-slate-900 border-t border-slate-800/50 text-gray-400 py-10">
    <div className="container mx-auto px-6 text-center">
      <p className="font-bold text-lg text-white mb-2">
        INOVYTE<span className="text-cyan-400">.</span>
      </p>
      <p>
        &copy; {new Date().getFullYear()} INOVYTE. Semua Hak Cipta Dilindungi.
      </p>
      <p className="text-sm mt-2">Dibuat dan dilindungi oleh HMIT ITS</p>
    </div>
  </footer>
);

const App: FC = () => {
  return (
    <div className="bg-slate-900 text-white font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
        html { scroll-behavior: smooth; }
        body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        .bg-grid-slate-800\\[\\/0\\.07\\] {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(51 65 85 / 0.3)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
        }
        .animate-blob { animation: blob 10s infinite cubic-bezier(0.6, 0, 0.4, 1); }
        .animation-delay-2000 { animation-delay: -3s; }
        .animation-delay-4000 { animation-delay: -1.5s; }
        @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(40px, -60px) scale(1.2); }
            66% { transform: translate(-30px, 30px) scale(0.8); }
            100% { transform: translate(0px, 0px) scale(1); }
        }
      `}</style>
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Process />
        <Testimonials />
        <Portfolio />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}

export default App;
