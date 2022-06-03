// node_modules
import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";
import { getData } from "../utils/colonyData";

// type
import Event from "../types/Event";

type eventsState = {
  events: Event[];
  count: number;
  status: string;
  error: string;
};

const initialState: eventsState = {
  events: [],
  count: 0,
  status: '',
  error: '',
};

const eventsSlice = createSlice({
  name: "events",
  initialState: initialState,
  reducers: {
    eventsRequest(state: eventsState, action: PayloadAction<{}>) {
      state.error = '';
      state.status = 'pending';
  },
  eventsRequestSuccess(state: eventsState, action: PayloadAction<{ events: Event[], count: number }>) {
      state.events = state.events.concat(action.payload.events);
      state.count = action.payload.count;
      state.status = 'success';
  },
  eventsRequestFail(state: eventsState, action: PayloadAction<string>) {
      state.error = action.payload;
      state.status = 'failure';
  }

  },
});

const eventsActions = eventsSlice.actions;

export const getEvents = (
  pageIndex: number,
  itemCount: number
) => {
  return async (dispatch: Dispatch) => {
    dispatch(eventsActions.eventsRequest({}));
    try {
      const result = await getData(
          pageIndex, itemCount
      );

      const { events, count } = result;
      dispatch(eventsActions.eventsRequestSuccess(result));
    } catch (error) {
      dispatch(eventsActions.eventsRequestFail('error'));
    }
  };
};

export default eventsSlice;
