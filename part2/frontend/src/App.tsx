import TodoList from "./components/TodoList";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 bg-[linear-gradient(90deg,#e8e8e8_1px,transparent_1px),linear-gradient(#e8e8e8_1px,transparent_1px)] bg-[length:40px_40px] flex items-center justify-center p-5 font-sans">
      <div className="container max-w-4xl mx-auto flex flex-col">
        <TodoList />
      </div>
    </div>
  );
}

export default App;
