import { createSlice } from '@reduxjs/toolkit';

export const resultSlice = createSlice({
  name: 'result',
  initialState: null,
  reducers: {
    setResult: (state, action) => action.payload,
  },
});

export const zipcodeSlice = createSlice({
  name: 'zipcodes',
  initialState: [],
  reducers: {
    setZipcodes: (state, action) => action.payload,
  },
});

export const { setResult } = resultSlice.actions;
export const { setZipcodes } = zipcodeSlice.actions;

export default {
  result: resultSlice.reducer,
  zipcodes: zipcodeSlice.reducer,
};