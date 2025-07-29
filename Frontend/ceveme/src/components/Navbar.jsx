import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md rounded-b-xl mb-8">
      <Link to="/" className="text-2xl font-bold text-indigo-600">
        CeVeMe
      </Link>
      <div>
        <Link
          to="/generator"
          className="text-lg text-gray-700 hover:text-indigo-500 font-medium"
        >
          CV
        </Link>
      </div>
    </nav>
  );
}
