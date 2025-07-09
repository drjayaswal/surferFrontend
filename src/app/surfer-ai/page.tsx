import { Suspense } from "react";
import Content from "./content";
import { Loader2 } from "lucide-react";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="animate-spin w-6 h-6 text-sky-500" />
          <p className="ml-2 text-sm text-gray-600">Loading...</p>
        </div>
      }
    >
      <Content />
    </Suspense>
  );
}
