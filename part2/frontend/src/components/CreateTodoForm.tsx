import { Plus, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateTodoDto } from "../lib/api";

interface CreateTodoFormProps {
  newTodo: CreateTodoDto;
  setNewTodo: (todo: CreateTodoDto) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export default function CreateTodoForm({
  newTodo,
  setNewTodo,
  onSubmit,
  loading,
}: CreateTodoFormProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
        <div className="bg-blue-50 p-3 rounded-lg">
          <ListTodo className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight mb-1">
            Todo List
          </h1>
          <p className="text-sm text-gray-500 font-sans">
            Track your tasks with Docker Compose 🐳
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="relative">
          <Input
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            placeholder="What needs to be done?"
            className="pl-4 pr-4 py-3 h-12 text-base border-none outline-none rounded-lg shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
            required
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg py-3 h-12 text-base font-medium shadow-sm transition-all"
        >
          <Plus className="w-5 h-5 mr-3" />
          <span>Add Task</span>
        </Button>
      </form>
    </div>
  );
}
