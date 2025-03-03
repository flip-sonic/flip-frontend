import Image from "next/image";
import Header from "./Components/Header";

export default function Home() {
  return (
    <div
      className="min-h-screen font-[family-name:var(--font-geist-sans)] 
             bg-[url('/mobile-bg.jpg')] md:bg-[url('/desktop-bg.jpg')] 
             bg-cover bg-center"
    >
      <Header />
    </div>
  );
}
