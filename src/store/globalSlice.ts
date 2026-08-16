import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface GlobalState {
  user: null | {
    id: string
    name: string
    email: string
  }
  token: string | null
}

const initialState: GlobalState = {
  user: null,
  token: null,
}

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setLogin: (state, action: PayloadAction<{ user: GlobalState['user']; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
    },
    setLogout: (state) => {
      state.user = null
      state.token = null
    },
  },
})

export const { setLogin, setLogout } = globalSlice.actions
export default globalSlice.reducer
