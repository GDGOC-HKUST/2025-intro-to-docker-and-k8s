// components/TodoForm.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import TodoService, { Todo, CreateTodoDto } from "../lib/api"; // Adjust path as needed
import { Pencil, Trash2 } from "lucide-react";

export default function TodoForm() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<CreateTodoDto>({
    title: "",
    completed: false,
  });
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch todos on mount
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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTodo) return;
    try {
      setLoading(true);
      await TodoService.updateTodo(editingTodo.ID, {
        title: editingTodo.title,
        completed: editingTodo.completed,
      });
      setEditingTodo(null);
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
    <div className="max-w-2xl mx-auto p-4">
      {/* Create Todo Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create New Todo</CardTitle>
          <CardDescription>Add a new task to your list</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newTodo.title}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, title: e.target.value })
                }
                placeholder="Enter todo title"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="completed"
                checked={newTodo.completed}
                onCheckedChange={(checked) =>
                  setNewTodo({ ...newTodo, completed: checked as boolean })
                }
              />
              <Label htmlFor="completed">Completed</Label>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Todo"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Todo List */}
      <div className="space-y-4">
        {todos.map((todo) => (
          <Card key={todo.ID}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={todo.completed}
                    disabled
                  />
                  <span className={todo.completed ? "line-through" : ""}>
                    {todo.title}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditingTodo(todo)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Todo</DialogTitle>
                        <DialogDescription>
                          Update your todo item
                        </DialogDescription>
                      </DialogHeader>
                      {editingTodo && (
                        <form onSubmit={handleUpdate} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-title">Title</Label>
                            <Input
                              id="edit-title"
                              value={editingTodo.title}
                              onChange={(e) =>
                                setEditingTodo({
                                  ...editingTodo,
                                  title: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="edit-completed"
                              checked={editingTodo.completed}
                              onCheckedChange={(checked) =>
                                setEditingTodo({
                                  ...editingTodo,
                                  completed: checked as boolean,
                                })
                              }
                            />
                            <Label htmlFor="edit-completed">Completed</Label>
                          </div>
                          <Button type="submit" disabled={loading}>
                            {loading ? "Updating..." : "Update Todo"}
                          </Button>
                        </form>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(todo.ID)}
                    disabled={loading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}