import { call, put, takeEvery, takeLatest, all } from 'redux-saga/effects';
import { Posts } from './constants';
import { PostsAPI } from './API';
import {
  fetchPosts,
  fetchPostsSuccess,
  fetchPostsError,
} from './actions'

const postsApi = new PostsAPI;

function* getPosts(action) {
  yield takeLatest(Posts.fetchPosts, getPostsFromAPI)
}

function* getPostsFromAPI(action) {
  try {
    // call the api
    const data = yield call(postsApi.fetchPosts, {response: action.payload})
    // call the success action with data
    yield put(fetchPostsSuccess(data));
  } catch (e) {
    // call the error action with data
    yield put(fetchPostsError(e));
  }

}

function* getPostsSuccess() {
  // do anything you want in here,
  // you can set up a redirect, or
  // trigger a notification

}

export default function* rootSaga() {
  yield all([
    getPosts(),
  ])
}
