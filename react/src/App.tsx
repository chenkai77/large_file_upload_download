import { Suspense } from "react";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <Suspense fallback="loading...">
      <Outlet />
    </Suspense>
  );
}
