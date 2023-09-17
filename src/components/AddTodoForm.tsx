"use client";

import { createId } from "@paralleldrive/cuid2";
import { Field, Form, Formik } from "formik";
import { LucidePlus } from "lucide-react";
import { toFormikValidationSchema } from "zod-formik-adapter";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/utils/trpc";
import { addTodoSchema } from "@/utils/ValidationSchema";

function AddTodoForm({
  userId,
  refetchTodos,
}: {
  userId: string | undefined;
  refetchTodos: () => void;
}) {
  const api = trpc.useContext();
  const { mutate: add } = trpc.todo.add.useMutation({
    onMutate: (variables) => {
      const newTodo = {
        id: variables.id || createId(),
        title: variables.title,
        completed: false,
        createdAt: new Date(),
        userId: userId ?? "userid",
      };
      api.todo.get.setData(undefined, (prev) =>
        prev ? [newTodo, ...prev] : [newTodo]
      );
    },
    onSuccess: async () => {
      await refetchTodos();
    },
  });
  return (
    <div>
      <Formik
        initialValues={{ title: "" }}
        validationSchema={toFormikValidationSchema(addTodoSchema)}
        onSubmit={(values, { resetForm }) => {
          add({
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
                className="w-full rounded border px-3 py-2 focus:border-blue-300 focus:outline-none focus:ring"
              />
              <Button
                LeftIcon={<LucidePlus size="16px" />}
                size="sm"
                variant="default"
                className="whitespace-nowrap"
                type="submit"
                disabled={isSubmitting}
              >
                Add Todo
              </Button>
            </div>
            {errors.title && touched.title && (
              <div className="text-sm text-red-500">{errors.title}</div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default AddTodoForm;
