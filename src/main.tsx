
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import { OrchestratorProvider } from "@constructor/shells/DashboardShell/app/providers/OrchestratorProvider";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(
    <OrchestratorProvider>
      <App />
    </OrchestratorProvider>
  );
  