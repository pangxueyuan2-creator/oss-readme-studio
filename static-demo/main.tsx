import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ReadmeStudio } from "../components/readme-studio";
import "../app/globals.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("README Studio root element was not found.");
}

createRoot(root).render(
  <StrictMode>
    <ReadmeStudio />
  </StrictMode>,
);
