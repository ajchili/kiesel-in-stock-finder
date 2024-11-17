import { createRoot } from "react-dom/client";
import { Everything } from "./components/Everything.js";

import "./index.css";
import { ThemeProvider } from "@/components/theme-provider.js";

let $app = document.getElementById("app");

if (!$app) {
  $app = document.createElement("div");
  document.body.appendChild($app);
}

const root = createRoot($app);
root.render(
  <ThemeProvider defaultTheme="dark">
    <Everything />
  </ThemeProvider>
);
