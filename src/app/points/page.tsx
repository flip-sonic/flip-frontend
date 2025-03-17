"use client";

import { BlurhashCanvas } from "react-blurhash";
import Image from "next/image";
import Header from "../components/Header";
import ClaimComponent from "../components/point/Claim";

export default function Home() {
  return (
    <div className="relative bg-blue-900/30">
      {/* Blurhash Placeholder */}
      <BlurhashCanvas
        hash="L03R#7s;9DogVra$sjjZ5MRiD|WU"
        width={700}
        height={500}
        punch={1}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Lazy Loaded Image */}
      <Image
        src="/desktop-bg.jpg"
        alt="Background"
        layout="fill"
        objectFit="cover"
        quality={100}
        priority={false} // Allow lazy loading
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Main Content */}
      <div className="relative z-10">
        <Header />
        <ClaimComponent />
      </div>
    </div>
  );
}
