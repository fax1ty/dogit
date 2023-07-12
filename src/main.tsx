import "@fontsource/roboto/latin-400.css";
import "@fontsource/roboto/latin-700.css";
import "@fontsource/roboto/cyrillic-400.css";
import "@fontsource/roboto/cyrillic-700.css";
import "./index.scss";
import "keen-slider/keen-slider.min.css";

import ReactDOM from "react-dom/client";

import { App } from "./app";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);
