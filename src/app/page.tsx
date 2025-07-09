import { Suspense } from "react";
import Home from "./content";

export default function Page() {
  return (
    <Suspense
      fallback={<div className="text-center p-8 text-lg">Loading...</div>}
    >
      <Home />
    </Suspense>
  );
}
