import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Contexts
import { useTheme } from "./contexts/ThemeContext";

// Layouts
import MainLayout from "./layouts/MainLayout";
import LoadingScreen from "./components/ui/LoadingScreen";

// Dynamic imports for better performance
const Dashboard = lazy(() => import("./pages/Dashboard"));
const BudgetDetails = lazy(() => import("./pages/BudgetDetails"));
const ExpensesPage = lazy(() => import("./pages/ExpensesPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));

function App() {
  const { theme } = useTheme();
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<LoadingScreen />}>
              <Dashboard />
            </Suspense>
          ),
        },
        {
          path: "budget/:id",
          element: (
            <Suspense fallback={<LoadingScreen />}>
              <BudgetDetails />
            </Suspense>
          ),
        },
        {
          path: "expenses",
          element: (
            <Suspense fallback={<LoadingScreen />}>
              <ExpensesPage />
            </Suspense>
          ),
        },
        {
          path: "analytics",
          element: (
            <Suspense fallback={<LoadingScreen />}>
              <AnalyticsPage />
            </Suspense>
          ),
        },
      ],
    },
  ]);

  return (
    <div className={`app ${theme}`}>
      <RouterProvider router={router} />
      <ToastContainer 
        position="bottom-right"
        theme={theme}
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
      />
    </div>
  );
}

export default App;
