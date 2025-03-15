"use client";
import React from "react";
import Header from "../components/Header";
import Swap from "../components/Swap";
import Image from "next/image";
import { BlurhashCanvas } from "react-blurhash";
import Hero from "../Components/swap/Hero";

const Page = () => {
  return (
    <div className="relative min-h-screen font-inter bg-blue-900/30">
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
        {/* <Swap/> */}
        <Hero />
      </div>
      
    </div>
  );
};

export default Page;
