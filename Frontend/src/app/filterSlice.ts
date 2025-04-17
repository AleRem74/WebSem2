import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FiltersState {
  searchTerm: string;
  dateFilter: string | null;
}

const initialState: FiltersState = {
  searchTerm: '',
  dateFilter: null,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setDateFilter: (state, action: PayloadAction<string | null>) => {
      state.dateFilter = action.payload;
    },
    clearFilters: (state) => {
      state.searchTerm = '';
      state.dateFilter = null;
    },
  },
});

export const { setSearchTerm, setDateFilter, clearFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
