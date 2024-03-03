export const createLoginSlice = (set) => ({
  message: null,
  status: null,
  isLoading: false,
  error: null,
  loginUser: async (username, password) => {
    set({ isLoading: true })
    try {
      const response = await fetch('http://localhost:9000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });
      const data = await response.json();
      set({ message: data.message, status: data.success, error: null, isLoading: false, });
    } catch (error) {
      set({ error, isLoading: false });
    }
  },
  logoutUser: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch('http://localhost:9000/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();
      set({ message: data.message, status: null, error: null, isLoading: false });
    } catch (error) {
      set({ error, isLoading: false });
    }
  },
  getStatus: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch('http://localhost:9000/login', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await response.json();
      set({ status: data.logged, error: null, isLoading: false });
    } catch (error) {
      set({ error, isLoading: false });
    }
  },
})