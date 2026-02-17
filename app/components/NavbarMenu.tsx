"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function NavbarMenu() {
  const pathname = usePathname();

  return (
    <>
      <div className="hidden items-center gap-6 md:flex md:gap-8">
        <Link
          href="/hakkimda"
          className={`whitespace-nowrap text-sm font-bold transition-colors hover:text-blue-600 ${
            isActivePath(pathname, "/hakkimda")
              ? "text-blue-600"
              : "text-gray-600"
          }`}
        >
          HAKKIMDA
        </Link>
      </div>

      <details className="relative md:hidden">
        <summary className="cursor-pointer list-none rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
          Menu
        </summary>
        <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-100 bg-white p-3 shadow-2xl">
          <Link
            href="/hakkimda"
            className={`block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-slate-50 ${
              isActivePath(pathname, "/hakkimda")
                ? "text-blue-600"
                : "text-slate-700"
            }`}
          >
            Hakkimda
          </Link>
        </div>
      </details>
    </>
  );
}
