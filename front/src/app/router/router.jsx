import { createBrowserRouter } from "react-router";
import Layouts from "../layouts/layout";
import NoteFoundPage from "../../pages/404/note-foun-page";
import HomePage from "../../pages/home/home-page";
import SpacesIdPage from "../../pages/spaces/spaces-id-page";
import SpacesPage from "../../pages/spaces/spaces-page";
import BookingsPage from "../../pages/bookings/bookings-page";
import ReviewsPage from "../../pages/reviews/reviews-page";
import ReviewsManagePage from "../../pages/reviews/reviews-manage-page";
import RegisterPage from "../../pages/auth/register-page";
import LoginPage from "../../pages/auth/login-page";
import MePage from "../../pages/users/me-page";
import UsersPage from "../../pages/users/users-page";
import GuardProvider from "../../features/auth/provider/guard-provider";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layouts />,
    errorElement: <NoteFoundPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/spaces/:id",
        element: (
          <GuardProvider isRole={["manager", "client", "admin"]}>
            <SpacesIdPage />
          </GuardProvider>
        ),
      },
      {
        path: "/spaces",
        element: (
          <GuardProvider isRole={["manager", "client", "admin"]}>
            <SpacesPage />
          </GuardProvider>
        ),
      },
      {
        path: "/bookings",
        element: (
          <GuardProvider isRole={["manager", "client", "admin"]}>
            <BookingsPage />
          </GuardProvider>
        ),
      },
      {
        path: "/reviews/:id",
        element: (
          <GuardProvider isRole={["manager", "client", "admin"]}>
            <ReviewsPage />
          </GuardProvider>
        ),
      },
      {
        path: "/reviews/manage/:id",
        element: (
          <GuardProvider isRole={["manager", "admin"]}>
            <ReviewsManagePage />
          </GuardProvider>
        ),
      },
      {
        path: "/users/me",
        element: (
          <GuardProvider isRole={["manager", "client", "admin"]}>
            <MePage />
          </GuardProvider>
        ),
      },
      {
        path: "/users",
        element: (
          <GuardProvider isRole={["manager", "admin"]}>
            <UsersPage />
          </GuardProvider>
        ),
      },
      {
        path: "/auth/register",
        element: <RegisterPage />,
      },
      {
        path: "/auth/login",
        element: <LoginPage />,
      },
    ],
  },
]);
export default router;
