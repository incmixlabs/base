import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AutoformSummary } from "@incmix/autoform";
import { Button } from "@incmix/ui";

function App() {
  return (
    <main style={{ fontFamily: "Inter, system-ui, sans-serif", padding: 32 }}>
      <h1>Incmix Autoform</h1>
      <p>Public docs workspace for the Incmix UI and Autoform packages.</p>
      <AutoformSummary fields={["Customer", "Status", "Due date"]} />
      <Button label="View packages" />
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
