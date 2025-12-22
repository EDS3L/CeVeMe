import { Link } from "react-router-dom";
import SectionOneHome from "../components/SectionOneHome";
import SectionTwoHome from "../components/SectionTwoHome";
import DemoSection from "../components/DemoSection";

export default function Home() {
  return (
    <div>
      <SectionOneHome />
      <SectionTwoHome></SectionTwoHome>
      <DemoSection />
    </div>
  );
}
