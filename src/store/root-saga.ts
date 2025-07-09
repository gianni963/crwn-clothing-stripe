import { all, call } from 'typed-redux-saga/macro';

import { categoriesSaga } from './categories/category.saga.ts';
import { userSagas } from './user/user.saga.ts';

export function* rootSaga() {
  yield* all([call(categoriesSaga), call(userSagas)]);
}