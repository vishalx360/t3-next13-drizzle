"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useDebouncedCallback } from "use-debounce";

import AddTodoForm from "@/components/AddTodoForm";
import ClearAllBtn from "@/components/ClearAllBtn";
import TodoList from "@/components/TodoList";
import { trpc } from "@/utils/trpc";

function Dashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      return {
        redirect: {
          destination: "/signin",
          permanent: false,
        },
      };
    },
  });

  const { data: todos, isLoading, refetch } = trpc.todo.get.useQuery();
  const refetchTodos = useDebouncedCallback(refetch, 3000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "anticipate" }}
      className="w-full rounded-xl bg-white shadow-lg dark:border dark:border-neutral-700 dark:bg-neutral-800 sm:max-w-md md:mt-0 xl:p-0"
    >
      <div className="space-y-6 p-6 sm:p-8 md:space-y-6">
        <div className="flex items-center gap-5">
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
            TODOS
          </h1>
        </div>
        <div>
          <AddTodoForm refetchTodos={refetchTodos} userId={session?.user.id} />
          <TodoList
            refetchTodos={refetchTodos}
            todos={todos}
            isLoading={isLoading}
          />
          <ClearAllBtn refetchTodos={refetchTodos} />
          {status !== "loading" && (
            <>
              <div className="mt-10 flex items-center gap-3">
                {session?.user?.image && (
                  <Image
                    unoptimized
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full"
                    src={session?.user?.image}
                    alt="avatar"
                  />
                )}
                <h1>{session?.user?.email}</h1>
              </div>
              <Link href="/api/auth/signout" className="text-red-500">
                Sign out
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default Dashboard;
