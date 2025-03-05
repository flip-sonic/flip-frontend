import Image from "next/image";
import Header from "./components/Header";
import Claim from "./components/Claim";

export default function Home() {
  return (
    <div
      className="min-h-screen font-inter 
             bg-[url('/mobile-bg.jpg')] md:bg-[url('/desktop-bg.jpg')] 
             bg-cover bg-center"
    >
      <Header />
      <Claim/>
    </div>
  );
}
