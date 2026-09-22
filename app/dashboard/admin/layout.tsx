import AdminSidebar from "@/components/AdminSidebar";
import Navbar from "@/components/Navbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <div className="flex-1 overflow-x-hidden overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}