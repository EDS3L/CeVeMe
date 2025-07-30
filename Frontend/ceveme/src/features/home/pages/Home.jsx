import { Link } from 'react-router-dom';
import SectionOneHome from '../components/SectionOneHome';
import HomeNavBar from '../components/HomeNavBar';

export default function Home() {
  return (
    <div>
      <HomeNavBar />
      <SectionOneHome />
      <div className="h-screen w-screen bg-black">s</div>
    </div>
  );
}
