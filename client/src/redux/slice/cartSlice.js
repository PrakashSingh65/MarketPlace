import { createSlice } from "@reduxjs/toolkit";

// cartSlice manages UI state only:
// - loading / error states
// - cart item count badge (derived from React Query cache)
// The actual cart data lives in React Query cache (useGetCart)

const initialState = {
  items: [],
  itemCount: 0,
  isCartOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload || [];
      state.itemCount = state.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    },
    setItemCount: (state, action) => {
      state.itemCount = action.payload;
    },
    incrementItemCount: (state) => {
      state.itemCount += 1;
    },
    decrementItemCount: (state) => {
      if (state.itemCount > 0) state.itemCount -= 1;
    },
    resetItemCount: (state) => {
      state.items = [];
      state.itemCount = 0;
    },
    toggleCartOpen: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    setCartOpen: (state, action) => {
      state.isCartOpen = action.payload;
    },
  },
});

export const {
  setCartItems,
  setItemCount,
  incrementItemCount,
  decrementItemCount,
  resetItemCount,
  toggleCartOpen,
  setCartOpen,
} = cartSlice.actions;

export default cartSlice.reducer;
