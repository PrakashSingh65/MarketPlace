import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filters: {
    category: "",
    subCategory: "",
    keyword: "",
    page: 1,
  },
  selectedProductId: null,
  isAddProductModalOpen: false,
};

const productSlice = createSlice({
  name: "productUI",
  initialState,
  reducers: {
    setCategoryFilter: (state, action) => {
      state.filters.category = action.payload;
    },
    setSearchKeyword: (state, action) => {
      state.filters.keyword = action.payload;
    },
    setSubCategoryFilter: (state, action) => {
      state.filters.subCategory = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSelectedProductId: (state, action) => {
      state.selectedProductId = action.payload;
    },
    toggleAddProductModal: (state) => {
      state.isAddProductModalOpen = !state.isAddProductModalOpen;
    },
  },
});

export const {
  setCategoryFilter,
  setSearchKeyword,
  setSubCategoryFilter,
  resetFilters,
  setSelectedProductId,
  toggleAddProductModal,
} = productSlice.actions;

export default productSlice.reducer;