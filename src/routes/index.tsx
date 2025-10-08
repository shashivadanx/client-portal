import Home from "@/pages/home";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
]);

export default router;
