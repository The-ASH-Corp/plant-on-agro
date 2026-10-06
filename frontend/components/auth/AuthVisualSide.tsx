"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "../../public/Screenshot_From_2026-09-17_15-39-39-removebg-preview.png";


interface AuthVisualSideProps {
  onBack?: () => void;
}

export function AuthVisualSide({ onBack }: AuthVisualSideProps) {
  return (
    <div className="relative w-full md:w-5/12 lg:w-1/2 h-56 sm:h-64 md:h-full md:min-h-screen overflow-hidden flex flex-col justify-between p-6 md:p-12 shrink-0">
      {/* Background Image */}
      <img
        src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&h=1600&fit=crop&auto=format"
        alt="Lush forest canopy"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(23,51,36,0.85) 0%, rgba(23,51,36,0.3) 100%)",
        }}
      />

      {/* Top Bar / Back Button */}
      <div className="relative z-10">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium cursor-pointer"
          >
            <span>←</span> Back to site
          </button>
        ) : (
          <Link
            href="/"
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium"
          >
            <span>←</span> Back to site
          </Link>
        )}
      </div>

      {/* Bottom Branding Copy (Desktop) */}
      <div className="relative z-10 mt-auto hidden md:block">
        <button className="flex items-center gap-2.5 group *:hover:cursor-pointer duration-200 my-5">
            <Image
              src={Logo}
              alt="Logo"
              width={200}
              height={200}
              priority
              className="w-auto h-10 sm:h-12 md:h-14 object-contain"
            />
          </button>
        <h2
          style={{ fontFamily: "var(--font-display)" }}
          className="text-white text-5xl lg:text-6xl mb-4 leading-tight"
        >
          You Plant.
          <br />
          <em className="text-[#95d5b2] not-italic">We Grow.</em>
        </h2>
        <p className="text-white/80 max-w-md text-lg font-light leading-relaxed">
          Join a community of individuals and companies restoring the earth, one
          tree at a time.
        </p>
      </div>
    </div>
  );
}
