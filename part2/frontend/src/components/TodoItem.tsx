import { Pencil, Trash2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Todo } from "../lib/api";
import CustomCheckbox from "./Checkbox";

interface TodoItemProps {
  todo: Todo;
  editingId: number | null;
  setEditingId: (id: number | null) => void;
  onUpdate: (id: number, updates: Partial<Todo>) => void;
  onDelete: (id: number) => void;
  loading: boolean;
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
}

export default function TodoItem({
  todo,
  editingId,
  setEditingId,
  onUpdate,
  onDelete,
  loading,
  todos,
  setTodos,
}: TodoItemProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between gap-4 mb-3">
      <div className="flex items-center gap-4 flex-1">
        <CustomCheckbox
          checked={todo.completed}
          onChange={(checked) => onUpdate(todo.id, { completed: checked })}
        />
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex-1 flex items-center gap-2">
            {editingId === todo.id ? (
              <>
                <Input
                  value={todo.title}
                  onChange={(e) => {
                    const updatedTodos = todos.map((t) =>
                      t.id === todo.id ? { ...t, title: e.target.value } : t
                    );
                    setTodos(updatedTodos);
                  }}
                  onBlur={(e) => {
                    onUpdate(todo.id, { title: e.currentTarget.value });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onUpdate(todo.id, { title: e.currentTarget.value });
                    } else if (e.key === "Escape") {
                      setEditingId(null);
                      const originalTodos = [...todos];
                      setTodos(originalTodos);
                    }
                  }}
                  autoFocus
                  className="h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  onClick={() => setEditingId(null)}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <span
                onClick={() => setEditingId(todo.id)}
                className={`cursor-pointer ${
                  todo.completed
                    ? "line-through text-gray-400"
                    : "text-gray-800 hover:text-gray-600"
                }`}
              >
                {todo.title}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-400">
            {formatDate(todo.createdAt)}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setEditingId(todo.id)}
          className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          disabled={loading}
          className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-gray-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
