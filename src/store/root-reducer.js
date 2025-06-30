import { combineReducers } from 'redux';

import { userReducer } from './user/user.reducer.ts';
import { categoriesReducer } from './categories/category.reducer.ts';
import { cartReducer } from './cart/cart.reducer.ts';

export const rootReducer = combineReducers({
  user: userReducer,
  categories: categoriesReducer,
  cart: cartReducer,
});
