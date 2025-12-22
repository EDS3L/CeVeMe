import HomeNavBar from "./SectionOneComponents/HomeNavBar";
import HomeNavBarScroll from "./SectionOneComponents/HomeNavBarScroll";
import Hero from "./SectionOneComponents/Hero";

function SectionOneHome() {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <HomeNavBar />
      <HomeNavBarScroll />
      <Hero />
    </div>
  );
}
export default SectionOneHome;
