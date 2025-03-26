import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import TodoService, { Todo, CreateTodoDto } from "../lib/api";
import CreateTodoForm from "./CreateTodoForm";
import TodoItem from "./TodoItem";
import TodoCounter from "./TodoCounter";

export default function TodoList() {
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
      // Sort todos by createdAt in descending order (newest first)
      const sortedTodos = todosData.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setTodos(sortedTodos);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;

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

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-6 h-[80vh] p-4">
      {/* Left Section - Add Todo Form */}
      <div className="w-full md:w-2/5 md:sticky md:top-0 md:self-start">
        <Card className="bg-white/95 rounded-xl shadow-md overflow-hidden border border-gray-100 h-full">
          <CardContent className="">
            <CreateTodoForm
              newTodo={newTodo}
              setNewTodo={setNewTodo}
              onSubmit={handleCreate}
              loading={loading}
            />
          </CardContent>
        </Card>
      </div>

      {/* Right Section - Todo List */}
      <div className="w-full md:w-3/5 flex flex-col h-full">
        <Card className="bg-white/90 rounded-xl shadow-lg overflow-hidden h-full flex flex-col border-none outline-none">
          <CardContent className="p-6 flex-grow overflow-y-auto max-h-[80vh]">
            <div className="space-y-4">
              <TodoCounter count={todos.length} />

              {todos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No tasks yet. Add one to get started!
                </div>
              ) : (
                todos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    editingId={editingId}
                    setEditingId={setEditingId}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                    loading={loading}
                    todos={todos}
                    setTodos={setTodos}
                  />
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
