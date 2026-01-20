/* eslint-disable no-unused-vars */
import { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routersConfig from "./RoutersConfig";
import "../index.css";
import { AuthProvider } from "../features/auth/context/AuthContext";
import AuthRole from "./AuthRole";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLocation } from "react-router-dom";

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Router>
        <ConditionalNavbar />
        <div className="min-h-screen flex flex-col">
          <div className="flex-grow">
            <Suspense
              fallback={
                <div className="text-center align-middle text-3xl">
                  Loading...
                </div>
              }
            >
              <Routes>
                {Object.values(routersConfig).map(
                  ({ path, component: Component, requiredRole }) => {
                    const isPublic = requiredRole === null;

                    return (
                      <Route
                        key={path}
                        path={path}
                        element={
                          isPublic ? (
                            <Component />
                          ) : (
                            <AuthRole requiredRole={requiredRole}>
                              <Component />
                            </AuthRole>
                          )
                        }
                      />
                    );
                  },
                )}
              </Routes>
            </Suspense>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

const ConditionalNavbar = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isAuthPage = location.pathname.startsWith("/auth/");

  // Nie pokazuj navbara na stronie głównej i stronach auth (mają swoje navbary)
  if (isHomePage || isAuthPage) {
    return null;
  }

  return <Navbar />;
};

export default AppRoutes;
