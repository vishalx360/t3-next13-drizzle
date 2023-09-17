"use client";

import { Todo } from "drizzle/schema";
import { motion } from "framer-motion";
import { LucideDelete, LucideLoader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/utils/trpc";

export default function TodoItem({
  todo,
  refetchTodos,
}: {
  todo: Todo;
  refetchTodos: () => void;
}) {
  const utils = trpc.useContext();
  const { mutate: updateTodo, isLoading } = trpc.todo.update.useMutation({
    onMutate: (updated) => {
      utils.todo.get.setData(undefined, (oldData) => {
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
    trpc.todo.delete.useMutation({
      onMutate: () => {
        utils.todo.get.setData(undefined, (oldData) => {
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      layoutId={todo.id}
      className="flex items-center justify-between space-x-2"
    >
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

      <Button
        variant="ghost"
        className="pr-2"
        size="sm"
        disabled={isDeleting}
        onClick={() => {
          deleteTodo({ id: todo.id });
        }}
      >
        {isDeleting ? <LucideLoader2 /> : <LucideDelete />}
      </Button>
    </motion.div>
  );
}
