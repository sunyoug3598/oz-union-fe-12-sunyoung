// client/src/app/router.jsx
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import CalendarPage from "../features/schedule/pages/CalendarPage";
import NotesPage from "../features/notes/pages/NotesPage";
import CategoryPage from "../features/category/pages/CategoryPage";
import MyPage from "../features/mypage/pages/MyPage";
import LoginPage from "../features/auth/pages/LoginPage";
import SignUpPage from "../features/auth/pages/SignUpPage";
import NotFound from "../shared/pages/NotFound.jsx";     
import ProtectedRoute from "../features/auth/components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <CalendarPage /> },
      { path: "notes", element: <NotesPage /> },
      { path: "categories", element: <CategoryPage /> },
      {
        path: "mypage",
        element: (
          <ProtectedRoute>
            <MyPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignUpPage /> },
  { path: "*", element: <NotFound /> },
]);
