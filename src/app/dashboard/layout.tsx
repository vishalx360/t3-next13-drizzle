import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import React from "react";

import { options } from "../api/auth/[...nextauth]/options";

async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const data = await getServerSession(options);

  return (
    <section className="bg-neutral-100 dark:bg-neutral-900">
      <div className="mx-auto flex h-screen flex-col items-center justify-center px-6 py-8 lg:py-0">
        {!data?.user ? (
          <div className="flex flex-col items-center justify-center gap-5">
            <AlertTriangle className="text-yellow-500" size={30} />
            <Link className="underline" href="/signin">
              Please Signin to visit dashboard
            </Link>
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

export default DashboardLayout;
