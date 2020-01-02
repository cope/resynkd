'use strict';

const redux = require('redux');
const reduxUndo = require('redux-undo');

const {combineReducers, createStore} = redux;
const {ActionCreators, default: undoable} = reduxUndo;
// const {applyMiddleware, bindActionCreators, combineReducers, compose, createStore} = redux;

module.exports = function () {
	console.log('\n...demo-redux');

	let counter = (state = 0, action) => {
		switch (action.type) {
			case 'INCREMENT':
				return state + 1;
			case 'DECREMENT':
				return state - 1;
			default:
				return state;
		}
	};

	// let store = createStore(counter); // <- normal store, without undo
	let store = createStore(combineReducers({counter: undoable(counter)}));	// with undo
	store.subscribe(() => console.log('redux counter', JSON.stringify(store.getState().counter.present)));

	store.dispatch({type: 'INCREMENT'});
	store.dispatch(ActionCreators.undo());

	setTimeout(() => store.dispatch({type: 'INCREMENT'}), 1000);
	setTimeout(() => store.dispatch(ActionCreators.undo()), 1500);
	setTimeout(() => store.dispatch({type: 'INCREMENT'}), 2000);
	setTimeout(() => store.dispatch({type: 'INCREMENT'}), 2500);
	setTimeout(() => store.dispatch({type: 'DECREMENT'}), 3000);
	setTimeout(() => store.dispatch({type: 'INCREMENT'}), 3500);
};
