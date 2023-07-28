import { createId } from "@paralleldrive/cuid2";
import { todos } from "drizzle/schema";
import { and, asc, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../[trpc]/trpc";

export const TodoRouter = createTRPCRouter({
  // CREATE
  addTodo: protectedProcedure
    .input(z.object({ title: z.string(), id: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.drizzle
        .insert(todos)
        .values({
          id: input.id || createId(),
          title: input.title,
          userId: ctx.session.user.id,
        })
        .returning();
    }),

  // READ
  getTodos: protectedProcedure.query(async ({ ctx }) => {
    return ctx.drizzle
      .select()
      .from(todos)
      .where(eq(todos.userId, ctx.session.user.id))
      .orderBy(desc(todos.createdAt));
  }),

  // UPDATE
  updateTodo: protectedProcedure
    .input(
      z.object({ id: z.string(), title: z.string(), completed: z.boolean() })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.drizzle
        .update(todos)
        .set({
          completed: input.completed,
          title: input.title,
        })
        .where(
          and(eq(todos.userId, ctx.session.user.id), eq(todos.id, input.id))
        )
        .returning();
    }),

  // DELETE
  deleteTodo: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.drizzle
        .delete(todos)
        .where(
          and(eq(todos.userId, ctx.session.user.id), eq(todos.id, input.id))
        );
    }),
});
