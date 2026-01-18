import { Link } from "react-router-dom";
import SectionOneHome from "../components/SectionOneHome";
import SectionTwoHome from "../components/SectionTwoHome";
import SectionThreeHome from "../../../components/SectionThreeHome";
import DemoSection from "../components/DemoSection";
import TestimonialsSection from "../components/TestimonialsSection";
import FinalCTASection from "../components/FinalCTASection";

export default function Home() {
  return (
    <div>
      <SectionOneHome />
      <SectionTwoHome />
      <SectionThreeHome />
      <DemoSection />
      <TestimonialsSection />
      <FinalCTASection />
    </div>
  );
}
