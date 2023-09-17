import TodoItem from "./TodoItem";
import TodoListSkeleton from "./TodoListSkeleton";

function TodoList({
  todos,
  isLoading,
  refetchTodos,
}: {
  todos: any;
  isLoading: boolean;
  refetchTodos: () => void;
}) {
  return (
    <>
      {isLoading ? (
        <TodoListSkeleton NumberOfTasks={5} />
      ) : (
        <div className="my-5 max-h-64 space-y-2 overflow-y-scroll">
          {todos?.map((todo) => (
            <TodoItem refetchTodos={refetchTodos} key={todo.id} todo={todo} />
          ))}
        </div>
      )}
    </>
  );
}

export default TodoList;
