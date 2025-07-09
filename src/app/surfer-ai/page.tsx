import { Suspense } from "react";
import Content from "./content";

export default function Page() {
  return (
    <Suspense
      fallback={<div className="text-center p-8 text-lg">Loading...</div>}
    >
      <Content />
    </Suspense>
  );
}
