import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routersConfig from './RoutersConfig';
import '../index.css';

const AppRoutes = () => {
  return (
    <Router>
      <Suspense
        fallback={
          <div className="text-center align-middle text-3xl">Loading...</div>
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
            }
          )}
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
