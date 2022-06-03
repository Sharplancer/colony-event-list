// node_modules
import {
  AnyAction,
  combineReducers,
  configureStore,
  Reducer,
} from "@reduxjs/toolkit";

// slices
import eventSlice from "./event-slice";

const combinedReducer = combineReducers({
  events: eventSlice.reducer,
});

export type RootState = ReturnType<typeof combinedReducer>;

export type AppDispatch = typeof store.dispatch;

const rootReducer: Reducer = (
  state: ReturnType<typeof store.getState>,
  action: AnyAction
) => {
  return combinedReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
