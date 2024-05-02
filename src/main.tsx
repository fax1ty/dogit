import "./fonts/roboto/font.scss";
import "./index.scss";
import "keen-slider/keen-slider.min.css";

import ReactDOM from "react-dom/client";

import { App } from "./app";

const root = document.getElementById("root");

if (!root) throw new Error("No root div found!");

ReactDOM.createRoot(root).render(<App />);
