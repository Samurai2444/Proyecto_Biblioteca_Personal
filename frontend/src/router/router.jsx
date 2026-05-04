import React from "react";
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layout/RootLayout";
import BookList from "../pages/BookList";
import BookDesc from "../pages/BookDesc";
import User from "../pages/User";
import AdminPage from "../pages/AdminPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import LibraryPage from "../pages/LibraryPage";
import AdminUsers from "../pages/AdminUsers";
import AdminBooks from "../pages/AdminBooks";
import ProtectedRoute from "../components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        path: "book",
        element: <BookList />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },

      {
        path: "book/:id",
        element: <BookDesc />,
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute requiredRoles={["admin"]}>
            <AdminPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "user",
        element: (
          <ProtectedRoute>
            <User />
          </ProtectedRoute>
        ),
      },
      {
        path: "library",
        element: (
          <ProtectedRoute requiredRoles={["bibliotecario", "admin"]}>
            <LibraryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/users",
        element: (
          <ProtectedRoute requiredRoles={["admin"]}>
            <AdminUsers />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/books",
        element: (
          <ProtectedRoute requiredRoles={["admin"]}>
            <AdminBooks />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
