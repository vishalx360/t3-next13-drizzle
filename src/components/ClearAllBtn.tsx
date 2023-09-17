import { Button } from "@/components/ui/button";
import { trpc } from "@/utils/trpc";

function ClearAllBtn({ refetchTodos }: { refetchTodos: () => void }) {
  const api = trpc.useContext();
  const { mutate: clearAll } = trpc.todo.clearAll.useMutation({
    onMutate: () => {
      api.todo.get.setData(undefined, (prev) => []);
    },
    onSuccess: async () => {
      await refetchTodos();
    },
  });
  function handelClearAll() {
    clearAll();
  }
  return (
    <Button
      onClick={handelClearAll}
      size="sm"
      className="w-full"
      variant="outline"
    >
      Clear All Tasks
    </Button>
  );
}

export default ClearAllBtn;
