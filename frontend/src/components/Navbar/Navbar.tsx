"use client";
import NavbarAdmin from "./navbar-admin/NavBarAdmin";
import NavbarClient from "./navbar-client/NavbarClient";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  if (pathname === "/admin") {
    return null;
  }
  // Kolla om adressparametern är "/admin"
  const isAdminRoute = pathname.startsWith("/admin");

  // Returnera NavbarAdmin bara om adressparametern är "/admin"
  return <>{isAdminRoute ? <NavbarAdmin /> : <NavbarClient />}</>;
}
