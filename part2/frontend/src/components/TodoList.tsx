// components/TodoForm.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import TodoService, { Todo, CreateTodoDto } from "../lib/api";
import { Check, Pencil, Trash2, X } from "lucide-react";

export default function TodoForm() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<CreateTodoDto>({
    title: "",
    completed: false,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const todosData = await TodoService.getAllTodos();
      setTodos(todosData);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await TodoService.createTodo(newTodo);
      setNewTodo({ title: "", completed: false });
      await fetchTodos();
    } catch (error) {
      console.error("Failed to create todo:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: number, updates: Partial<Todo>) => {
    try {
      setLoading(true);
      await TodoService.updateTodo(id, updates);
      setEditingId(null);
      await fetchTodos();
    } catch (error) {
      console.error("Failed to update todo:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await TodoService.deleteTodo(id);
      await fetchTodos();
    } catch (error) {
      console.error("Failed to delete todo:", error);
    } finally {
      setLoading(false);
    }
  };

  const CustomCheckbox = ({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: (checked: boolean) => void;
  }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
        checked
          ? "bg-green-500 border-green-500"
          : "border-gray-300 hover:border-gray-400"
      }`}
    >
      {checked && <Check className="w-3 h-3 text-white" />}
    </button>
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Create Todo Form */}
      <Card className="mb-6 shadow-sm">
        <CardContent className="pt-6">
          <form onSubmit={handleCreate} className="flex items-center gap-4">
            <Input
              value={newTodo.title}
              onChange={(e) =>
                setNewTodo({ ...newTodo, title: e.target.value })
              }
              placeholder="Add a new task..."
              className="flex-1"
              required
            />
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Adding..." : "Add"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Todo List */}
      <div className="space-y-2">
        {todos.map((todo) => (
          <Card
            key={todo.id}
            className="shadow-sm hover:shadow-md transition-shadow border-0"
          >
            <CardContent className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <CustomCheckbox
                  checked={todo.completed}
                  onChange={(checked) =>
                    handleUpdate(todo.id, { completed: checked })
                  }
                />
                {editingId === todo.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <Input
                      value={todo.title}
                      onBlur={(e) => {
                        handleUpdate(todo.id, { title: e.target.value });
                        setEditingId(null);
                      }}
                      autoFocus
                      className="h-8"
                    />
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <span
                    onClick={() => setEditingId(todo.id)}
                    className={`flex-1 cursor-pointer ${
                      todo.completed
                        ? "line-through text-gray-400"
                        : "text-gray-800 hover:text-gray-600"
                    }`}
                  >
                    {todo.title}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingId(todo.id)}
                  className="text-gray-500 hover:text-blue-600 p-1"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(todo.id)}
                  disabled={loading}
                  className="text-gray-500 hover:text-red-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
