import TodoForm from "./TodoForm";

export default function TodoList() {
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  // if (isLoading) return <div className="text-center p-6">Loading todos...</div>;

  // if (error) return <div className="text-red-500 p-6">{error}</div>;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Todo List</h1>

      <TodoForm />
    </div>
  );
}
