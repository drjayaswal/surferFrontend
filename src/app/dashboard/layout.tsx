import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";
import SidebarToggleButton from "@/components/sidebarToggleButton";
import WaveBackground from "@/components/waveBackground";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <main className="md:m-2 md:ml-0.5 w-full min-h-full md:max-h-[calc(100svh-16px)] bg-black rounded-xl overflow-scroll shadow-none relative z-10">
        <SidebarToggleButton />
        {children}
      </main>
    </SidebarProvider>
  );
}
