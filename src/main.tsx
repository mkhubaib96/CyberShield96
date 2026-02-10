import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const root = document.getElementById("root");

if (!root) {
    console.error("Root element not found");
    document.body.innerHTML = '<h1 style="color:red">Fatal Error: Root element not found</h1>';
} else {
    try {
        createRoot(root).render(<App />);
    } catch (e) {
        console.error("Render error:", e);
        root.innerHTML = '<h1 style="color:red">Application Crashed. Check Console.</h1>';
    }
}
