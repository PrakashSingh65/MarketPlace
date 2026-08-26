import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isError: false
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
            state.isAuthenticated = true;
        },

        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
        resetAuthState: () => initialState,
    }
})

export const { setLoading, setError, setUser, logout, resetAuthState } = authSlice.actions;

export default authSlice.reducer;