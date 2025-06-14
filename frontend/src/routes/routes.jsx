import { createBrowserRouter, RouterProvider } from "react-router";
import Login from "../pages/Login";
import ApplyForm from "../pages/ApplyForm";
import Main from "../Layout/Main";
import DashboardLayout from "../Layout/DashboardLayout";
import NotFoundPage from "../pages/NotFoundPage";
import DashboardHome from "../pages/DashboardHome";
import Menu from "../pages/student/Menu";
import Notices from "../pages/Notices";
import Complaints from "../pages/student/Complaints";
import LostFoundItems from "../pages/student/LostFoundItems";
import ManageNotices from "../pages/official_stuff/ManageNotices";
import ManageComplaints from "../pages/official_stuff/ManageComplaints";
import HallApplicants from "../pages/official_stuff/HallApplicants";
import ManageStudents from "../pages/official_stuff/ManageStudents";
import Meetings from "../pages/official_stuff/Meetings";
import ManageMenu from "../pages/dining_canteen/ManageMenu";
import Reviews from "../pages/dining_canteen/Reviews";

// --- Placeholder Page Components (Define these in separate files or inline for now) ---
// const PlaceholderPage = ({ title }) => (
//   <div className="p-6 bg-white shadow-md rounded-lg border border-gray-100">
//     <h1 className="text-3xl font-bold mb-4 text-primary-600">{title}</h1>
//     <p className="text-gray-700 mb-4">Content for {title}.</p>
//     <div className="flex items-center">
//       <span className="mr-2">User Role:</span>
//       <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
//         {localStorage.getItem("userRole")}
//       </span>
//     </div>
//   </div>
// );
// const DashboardHomePage = () => <PlaceholderPage title="Dashboard Home" />;
// const ManageUsersPage = () => <PlaceholderPage title="Manage Users (Admin)" />;
// const ManageHallsPage = () => <PlaceholderPage title="Manage Halls (Admin)" />;
// const ManageServicesPage = () => (
//   <PlaceholderPage title="Manage Services (Admin)" />
// );
// const ManageStudentsPage = () => (
//   <PlaceholderPage title="Manage Students (Staff)" />
// );
// const ManageNoticesPage = () => (
//   <PlaceholderPage title="Manage Notices (Staff)" />
// );
// const MyProfilePage = () => <PlaceholderPage title="My Profile (Student)" />;
// const MealOrderPage = () => <PlaceholderPage title="Meal Order (Student)" />;
// const ManageOrdersPage = () => (
//   <PlaceholderPage title="Manage Orders (Service Provider)" />
// );
// const ManageMenuPage = () => (
//   <PlaceholderPage title="Manage Menu/Items (Service Provider)" />
// );

// --- End Placeholder Pages ---

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />, // or null if Login has no shared layout
    children: [
      { index: true, element: <Login /> },
      { path: "apply", element: <ApplyForm /> },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardHome /> },
      // students
      { path: "menu", element: <Menu /> },
      { path: "complaints", element: <Complaints /> },
      { path: "lost-found-items", element: <LostFoundItems /> },
      // official stuffs
      { path: "manage-hall-applicants", element: <HallApplicants /> },
      { path: "manage-complaints", element: <ManageComplaints /> },
      { path: "manage-notices", element: <ManageNotices /> },
      { path: "manage-students", element: <ManageStudents /> },
      { path: "meetings", element: <Meetings /> },
      { path: "hall-applicants", element: <HallApplicants /> },
      // dining canteen
      { path: "manage-menu", element: <ManageMenu /> },
      { path: "reviews", element: <Reviews /> },
      //common
      { path: "notices", element: <Notices /> },

      { path: "*", element: <NotFoundPage /> }, // Catch-all for /dashboard/*
    ],
  },
  {
    path: "*",
    element: (
      <Main>
        <NotFoundPage />
      </Main>
    ),
  },
]);
