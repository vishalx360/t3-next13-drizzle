"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const router = useRouter();
  const { status } = useSession();
  if (status === "authenticated") {
    router.push("/dashboard");
  }
  if (status === "unauthenticated") {
    router.push("/api/auth/signin");
  }
  return (
    <>
      <section className="bg-neutral-100 dark:bg-neutral-900">
        <div className="mx-auto flex h-screen flex-col items-center justify-center px-6 py-8 lg:py-0">
          <div className="my-10 block text-3xl dark:hidden lg:my-20">
            Todos App
          </div>
          Checking Authentication, please wait....
        </div>
      </section>
    </>
  );
}
