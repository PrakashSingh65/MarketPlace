import { createSlice } from "@reduxjs/toolkit";

// cartSlice manages UI state only:
// - loading / error states
// - cart item count badge (derived from React Query cache)
// The actual cart data lives in React Query cache (useGetCart)

const initialState = {
  // Optimistic local count — updated on add/remove for instant UI feedback
  itemCount: 0,
  // Whether the cart drawer/sidebar is open (if applicable)
  isCartOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
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
  setItemCount,
  incrementItemCount,
  decrementItemCount,
  resetItemCount,
  toggleCartOpen,
  setCartOpen,
} = cartSlice.actions;

export default cartSlice.reducer;
