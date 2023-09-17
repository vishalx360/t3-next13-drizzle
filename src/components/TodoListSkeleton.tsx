export default function TodoListSkeleton({
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
