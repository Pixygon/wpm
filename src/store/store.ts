import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import globalReducer from './globalSlice'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'token'], // Only persist auth state
}

const persistedReducer = persistReducer(persistConfig, globalReducer)

export const store = configureStore({
  reducer: {
    global: persistedReducer,
    // Add domain slices:  items: itemsReducer,
    // Add RTK Query APIs: [itemsApi.reducerPath]: itemsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
      // Add RTK Query middleware: }).concat(itemsApi.middleware),
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
