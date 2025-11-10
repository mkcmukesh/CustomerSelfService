
import "./globals.css";
import type { Metadata } from "next";
import AdminSidebarProvider from "@/components/admin/AdminSidebarProvider";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Customer Self Service",
  description: "Hybrid website + dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Provide sidebar state globally */}
        <AdminSidebarProvider>
          {/* Sidebar is mounted once and overlays any layout/content */}
          <AdminSidebar />
          {/* Your entire app */}
          {children}
        </AdminSidebarProvider>
      </body>
    </html>
  );
}


// import "./globals.css";
// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Your App",
//   description: "Hybrid website + dashboard",
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body>{children}</body>
//     </html>
//   );
// }
