import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../components/Navbar";

const NotFound = () => {
  return (
    <div className="flex flex-col min-h-screen bg-ivorylight">
      <Navbar showShadow={true} />
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-9xl font-bold text-kraft mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-slatedark mb-6">
          Strona nie znaleziona
        </h2>
        <p className="text-clouddark text-lg mb-8 max-w-md">
          Przepraszamy, ale strona której szukasz nie istnieje lub została
          przeniesiona.
        </p>
        <Link
          to="/"
          className="px-8 py-3 bg-kraft text-basewhite rounded-lg font-bold hover:bg-manilla transition-colors duration-200 shadow-lg"
        >
          Wróć na stronę główną
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
