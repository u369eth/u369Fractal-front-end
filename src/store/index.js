import { configureStore } from '@reduxjs/toolkit'
import refreshFunctions from './refresh'
 const store = configureStore({
  reducer: {
    refreshFunctions
  },
})

export default store;
