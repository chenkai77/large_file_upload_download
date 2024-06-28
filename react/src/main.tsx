import { createRoot } from "react-dom/client";
import "./index.css";
// import reportWebVitals from "./reportWebVitals";
import { RouterProvider } from "react-router-dom";
import router from "./route";

const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(<RouterProvider router={router} />);

// reportWebVitals(console.log);
