import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export interface Todo {
  title: string;
  completed: boolean;
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface CreateTodoDto {
  title: string;
  completed: boolean;
}

const TodoService = {
  getAllTodos: async (): Promise<Todo[]> => {
    const response = await axios.get(`${API_URL}/todos`);
    return response.data;
  },

  getTodoById: async (id: number): Promise<Todo> => {
    const response = await axios.get(`${API_URL}/todos/${id}`);
    return response.data;
  },

  createTodo: async (todo: CreateTodoDto): Promise<Todo> => {
    const response = await axios.post(`${API_URL}/todos`, todo);
    return response.data;
  },

  updateTodo: async (
    id: number,
    todo: Partial<CreateTodoDto>
  ): Promise<Todo> => {
    const response = await axios.put(`${API_URL}/todos/${id}`, todo);
    return response.data;
  },

  deleteTodo: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/todos/${id}`);
  },
};

export default TodoService;
