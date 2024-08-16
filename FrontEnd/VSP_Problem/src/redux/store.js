import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import slices from './slice.js';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers(slices);
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
export default store;

const register2 = (key) => {
  if (typeof key === 'function') {
    console.error('Non-serializable value detected in register action:', key);
    return;
  }
  store.dispatch({
    type: 'REGISTER',
    key
  });
};

// Example usage
register2('anotherSerializableKey');