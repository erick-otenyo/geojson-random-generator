import { createStore, combineReducers } from "redux";
import mapReducer from "./reducers";

const reducer = combineReducers({
	map: mapReducer
});

const store = createStore(
	reducer,
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
