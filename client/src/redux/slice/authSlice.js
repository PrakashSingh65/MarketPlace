import { createSlice } from '@reduxjs/toolkit';

const getInitialUser = () => {
  try {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const initialUser = getInitialUser();
const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('token');

const initialState = {
  user: initialUser,
  isAuthenticated: !!(initialUser && hasToken),
  isLoading: false,
  isError: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.isError = action.payload;
      state.isAuthenticated = false;
    },

    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isError = false;
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isError = false;
    },

    resetAuthState: () => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isError: false,
    }),
  },
});

export const { setLoading, setError, setUser, logout, resetAuthState } = authSlice.actions;

export default authSlice.reducer;