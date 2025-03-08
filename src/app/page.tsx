import Header from "./components/Header";
import Claim from "./components/Claim";

export default function Home() {
  return (
    <div
      className="min-h-screen h-full font-inter overflow-hidden"
    >
      <Header />
      <Claim/>
    </div>
  );
}
