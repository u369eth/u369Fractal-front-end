import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isReferesh: false,
}

export const refreshFunctions = createSlice({
  name: 'userWallet',
  initialState,
  reducers: {
    refreshBalance: (state, action) => {
      state.isReferesh = action.payload;
    }
  }
})

export const { refreshBalance } = refreshFunctions.actions
export default refreshFunctions.reducer