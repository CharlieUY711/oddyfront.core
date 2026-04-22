/* =====================================================
   ODDY Frontstore Standalone — App Root
   ===================================================== */
import { RouterProvider } from "react-router";
import { router } from "./routes";

export default function App() {
  return <RouterProvider router={router} />;
}
