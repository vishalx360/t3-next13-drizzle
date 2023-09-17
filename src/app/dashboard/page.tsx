"use client";

import { createId } from "@paralleldrive/cuid2";
import { Todo } from "drizzle/schema";
import { Field, Form, Formik } from "formik";
import { motion } from "framer-motion";
import { Loader, LucideDelete, LucideLoader2, LucidePlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useDebouncedCallback } from "use-debounce";
import { toFormikValidationSchema } from "zod-formik-adapter";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { trpc } from "@/utils/trpc";
import { addTodoSchema } from "@/utils/ValidationSchema";

function Dashboard() {

  const api = trpc.useContext();
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
  const { data: todos, isLoading, refetch } = trpc.todo.getTodos.useQuery();

  const refetchTodos = useDebouncedCallback(refetch, 3000);

  const { mutate: addTodo } = trpc.todo.addTodo.useMutation({
    onMutate: (variables) => {
      const newTodo = {
        id: variables.id || createId(),
        title: variables.title,
        completed: false,
        createdAt: new Date(),
        userId: session?.user?.id ?? "userid",
      };
      api.todo.getTodos.setData(undefined, (prev) =>
        prev ? [newTodo, ...prev] : [newTodo]
      );
    },
    onSuccess: async () => {
      await refetchTodos();
    },
  });
  return (
    <section className="bg-neutral-100 dark:bg-neutral-900">
      <div className="mx-auto flex h-screen flex-col items-center justify-center px-6 py-8 lg:py-0">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "anticipate" }}
          className="w-full rounded-xl bg-white shadow-lg dark:border dark:border-neutral-700 dark:bg-neutral-800 sm:max-w-md md:mt-0 xl:p-0"
        >
          <div className="space-y-6 p-6 sm:p-8 md:space-y-6">
            <div className="flex items-center gap-5">
              <h1 className="text-xl font-medium leading-tight tracking-tight text-neutral-900 dark:text-white md:text-2xl">
                TODOS
              </h1>
            </div>
            <div>
              <Formik
                initialValues={{ title: "" }}
                validationSchema={toFormikValidationSchema(addTodoSchema)}
                onSubmit={(values, { resetForm }) => {
                  addTodo({
                    ...values,
                    id: createId(),
                  });
                  resetForm();
                }}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form>
                    <div className="flex items-center gap-2">
                      <Field
                        as={Input}
                        type="title"
                        id="todo"
                        name="title"
                        placeholder="New todo"
                        className="w-full"
                      />
                      <Button
                        LeftIcon={<LucidePlus size="16px" />}
                        size="sm"
                        variant={"outline"}
                        className="whitespace-nowrap"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        Add Todo
                      </Button>
                    </div>
                    {errors.title && touched.title && (
                      <div className=" px-2 text-sm text-red-500">
                        {errors.title}
                      </div>
                    )}
                  </Form>
                )}
              </Formik>
              {isLoading ? (
                <TodoListSkeleton NumberOfTasks={5} />
              ) : (
                <div
                  className="my-5 max-h-52 space-y-5 overflow-y-scroll"
                >
                  {todos?.map((todo) => (
                    <TodoItem
                      refetchTodos={refetchTodos}
                      key={todo.id}
                      todo={todo}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
        {status !== "loading" && (
          <>
            <div className="mt-10 flex items-center gap-3">
              {session?.user?.image && (
                <img
                  className="h-10 w-10 rounded-full"
                  src={session?.user?.image}
                  height={100}
                  width={100}
                  alt={"avatar"}
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
    </section>
  );
}

function TodoItem({
  todo,
  refetchTodos,
}: {
  todo: Todo;
  refetchTodos: () => void;
}) {
  const utils = trpc.useContext();
  const { mutate: updateTodo, isLoading } = trpc.todo.updateTodo.useMutation({
    onMutate: (updated) => {
      utils.todo.getTodos.setData(undefined, (oldData) => {
        if (!oldData) return;
        const index = oldData.findIndex((current) => current.id === todo.id);
        const newData = [...oldData];
        if (index !== -1)
          newData[index] = {
            ...updated,
            userId: todo.userId,
            createdAt: todo.createdAt,
          };
        return newData;
      });
    },
    onSuccess: async () => {
      await refetchTodos();
    },
  });
  const { mutate: deleteTodo, isLoading: isDeleting } =
    trpc.todo.deleteTodo.useMutation({
      onMutate: () => {
        utils.todo.getTodos.setData(undefined, (oldData) => {
          if (!oldData) return;
          const index = oldData.findIndex((current) => current.id === todo.id);
          const newData = [...oldData];
          if (index !== -1) {
            newData.splice(index, 1);
          }
          return newData;
        });
      },
      onSuccess: async () => {
        await refetchTodos();
      },
    });
  return (
    <div className="flex items-center justify-between space-x-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={todo.id}
          disabled={isLoading}
          checked={todo.completed}
          onCheckedChange={() => {
            updateTodo({
              id: todo.id,
              completed: !todo.completed,
              title: todo.title,
            });
          }}
        />
        <label
          htmlFor={todo.id}
          className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {todo.title}
        </label>
      </div>

      <button
        className="pr-2"
        size="sm"
        disabled={isDeleting}
        onClick={() => {
          deleteTodo({ id: todo.id });
        }}
      >
        {isDeleting ? <LucideLoader2 /> : <LucideDelete />}
      </button>
    </div>
  );
}

export default Dashboard;

export function TodoListSkeleton({
  NumberOfTasks: NumberOfTodos,
}: {
  NumberOfTasks: number;
}) {
  const Tasks = [];
  for (let i = 0; i < NumberOfTodos; i++) {
    Tasks.push(
      <div className="flex items-center gap-2 px-2">
        <div className=" animate-pulse rounded-xl border-gray-400 bg-gray-400/50 p-3" />
        <div
          key={"skeleton" + i}
          className="border-1 min-h-[10px] w-full animate-pulse rounded-xl border-gray-400 bg-gray-400/50 px-4 py-3 "
        />
      </div>
    );
  }
  return (
    <div className="my-5 max-h-52 space-y-5 overflow-y-scroll">{Tasks}</div>
  );
}
