import { call } from 'typed-redux-saga/macro';
import { testSaga, expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';

import { getCategoriesAndDocuments } from '../../../utils/firebase/firebase.utils';

import {
  fetchCategoriesAsync,
  onFetchCategories,
  categoriesSaga,
} from '../category.saga.ts';
import {
  fetchCategoriesSuccess,
  fetchCategoriesFailed,
} from '../category.action.ts';
import { CATEGORIES_ACTION_TYPES } from '../category.types';

describe('category sagas', () => {
  test('categoriesSaga', () => {
    testSaga(categoriesSaga)
      .next()
      .all([call(onFetchCategories)])
      .next()
      .isDone();
  });

  test('onFetchCategories should takeLatest FETCH_CATEGORIES_START and call fetchCategoriesAsync', () => {
    testSaga(onFetchCategories)
      .next()
      .takeLatest(
        CATEGORIES_ACTION_TYPES.FETCH_CATEGORIES_START,
        fetchCategoriesAsync
      )
      .next()
      .isDone();
  });

  test('fetchCategoriesAsync success', () => {
    const mockCategoriesArray = [
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' },
      ];
      
    return expectSaga(fetchCategoriesAsync)
      .provide(
            [[call(getCategoriesAndDocuments), mockCategoriesArray]
        ])
      .put(fetchCategoriesSuccess(mockCategoriesArray))
      .run();
  });

  test('fetchCategoriesAsync failure', () => {
    const mockError = new Error('An error occurred');
    return expectSaga(fetchCategoriesAsync)
      .provide([
        [call(getCategoriesAndDocuments), throwError(mockError)]
    ])
      .put(fetchCategoriesFailed(mockError))
      .run();
  });
});