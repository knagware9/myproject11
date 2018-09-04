import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { createLogger } from 'redux-logger';
import createHistory from 'history/createBrowserHistory';
import Thunk from 'redux-thunk';

//importing root reducers
import RootReducers from './reducers/index';

//browser history
export const history = createHistory();

// Build the middleware for intercepting and dispatching navigation actions
const historymiddleware = routerMiddleware(history);

const loggerMiddleware = createLogger();
const composeEnhancers =
	typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
		? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
		: compose;

const Enhancer = composeEnhancers(applyMiddleware(historymiddleware, Thunk, loggerMiddleware));

const Store = createStore(RootReducers, Enhancer);

export default Store;
