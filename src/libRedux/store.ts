import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counter/counterSlice';

// Style Guide | Redux
// https://redux.js.org/style-guide/#structure-files-as-feature-folders-with-single-file-logic

// a function, makeStore, that we can use to create a store instance per-request
// https://redux-toolkit.js.org/usage/nextjs
export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
