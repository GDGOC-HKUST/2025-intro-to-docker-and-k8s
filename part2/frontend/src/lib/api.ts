import axios from "axios";

const API_URL = "http://localhost:8080";

export interface Todo {
  title: string;
  completed: boolean;
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;
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
    console.log(id);
    await axios.delete(`${API_URL}/todos/${id}`);
  },
};

export default TodoService;
