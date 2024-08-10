import { createRoot } from "react-dom/client";
import { Everything } from "./components/Everything.js";

import "./index.css";

let $app = document.getElementById("app");

if (!$app) {
  $app = document.createElement("div");
  document.body.appendChild($app);
}

const root = createRoot($app);
root.render(<Everything />);
