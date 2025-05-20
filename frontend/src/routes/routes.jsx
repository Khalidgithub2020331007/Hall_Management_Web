import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Login from "../pages/Login";
import ApplyForm from "../pages/ApplyForm";
import Main from "../Layout/Main";
export const router = createBrowserRouter([
  {
  path: "/",
  element: <Main />, // or null if Login has no shared layout
  children: [
    { index: true, element: <Login/> },
    { path: "apply", element: <ApplyForm /> }
  ]
},
]);