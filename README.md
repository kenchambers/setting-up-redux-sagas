# Quick Start: Setting Up React Redux with Sagas

FEBRUARY 12, 2020

## This will be useful to you if

- you have never set up a react redux architecture with sagas
- you want to understand a very barebones minimal setup

## Assumptions
- you know react as well as redux, and i don't have to explain the details.
- You know how to send async calls using fetch api.

## Here we go!

first lets load create react app:

```
npx create-react-app my-app-name
```

after we have that set up, lets install our 4 packages:

```
npm i --save-dev redux react-redux redux-saga reselect
```

alright sick- now go into `/src/App.js` remove the boiler plate and import in our store (that we havent made yet ) as well as the provider ( that we will pas the store into):

> for this example we will be using `class` components, not hooks.

`./App.js`
```javascript
import React from 'react';
import './App.css';
import { Provider } from 'react-redux'
import { store } from './store'

class App extends React.Component {
  render() {
    return (
      // pass the store into the provider
      <Provider store={store}>
        <div>
        </div>
      </Provider>
    )
  }
}
export default App

```

Now that we have our highest level component created, lets add the code for our store.

notice below we are using a method from redux called `applyMiddleware` that we can use to load our `sagaMiddleware`

`./store.js`

```javascript
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas'

// we need an initialState otherwise , store will freak out
const initialState = {
  posts: {}
}

const sagaMiddleware = createSagaMiddleware()

// redux sagas is a middleware that we apply to the store
export const store = createStore(
  rootReducer,
  initialState,
  applyMiddlewhere(sagaMiddleware)
)
sagaMiddleware.run(rootSaga)

export default store;

```

Notice there are two things missing here, our rootReducer, and our rootSaga, lets build both of these now:


`./reducer-root.js`

```javascript

import { combineReducers } from 'redux';

import { postsReducer } from './reducer-posts';

// right now we have only 1 reducer, but lets use this format of combineReducers so you can add more later if you need to.
const rootReducer = combineReducers({
  posts: postsReducer,
});

export default rootReducer;

```

inside of each reducer we want to import our action constants as well! i like to abstract them out into a separate file. `./constants`

Now lets build our first reducer for our posts:

`./reducer-posts.js`

```javascript

import { Posts } from './constants'

const initialState = {}

export const postsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Posts.fetchPosts:
      // here we catch our payload data and pass it into the state of the store
      return {...state, action.payload}
    default:
      return state
  }
}
```

alright now lets set up our constants file where we will export a variable for each group of action constants we are building. I like to do this to keep actions organized:

`./constants`

```javascript
export const Posts = {
  fetchPosts: 'FETCH_POSTS',
  fetchPostsSuccess: 'FETCH_POSTS_SUCCESS',
  fetchPostsError: 'FETCH_POSTS_ERROR'
}
```

## Sagas

Great! now that we have our store & reducers set up, we need to create a root saga, so everything doesn't break.

you can think of sagas as another thing (like the reducers) that responds to actions that are called inside of our redux app.

What happens is that it uses the generator `function*` to pause and perform 'side effects' on the app.

You can think of this file as a side effects manager.

`sagas.js`

```javascript

import { call, put, takeEvery, takeLatest, all } from 'redux-saga/effects';

function* fetchPosts() {

}

function* fetchPostsSuccess() {

}

export default function* rootSaga() {
  yield all([
    fetchPosts(),
  ])
}

```

Great ! now we have the bare bones set up of our architecture for our react-redux-sagas app!!!!!

Now lets get started setting up our first `async` request that will:

A. call an action creator
B. emit an action
C. Sagas see action, perform async request
D. request payload is passed to reducer
E. Store gets updated, and success action triggered.

__Alright ! Lets DO this!__

lets go all the way back to our `/App.js` file.

inside here lets add our `<PostsComponent/>` that will load our new posts from our fake json API at: [JSON Placeholder](https://jsonplaceholder.typicode.com/)

`./App.js`

```javascript
import React from 'react';
import './App.css';
import { Provider } from 'react-redux'
import { store } from './store'
import PostsComponent from './posts-component'

class App extends React.Component {
  render() {
    return (
      // pass the store into the provider
      <Provider store={store}>
        <div>
          <PostsComponent/>
        </div>
      </Provider>
    )
  }
}

export default App
```

alright dope lets build our `<PostsComponent/>`

were going to do a couple of things here at the same time:
- attach an action to redux inside of `mapDispatchToProps`
- slice out a piece of the store to use it (with reselect)
- add some simple css styles
- create our fetch button that will call our fake api

`./posts-component.js`

```javascript
import React from 'react';
import { fetchPosts } from './actions';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

class PostsComponent extends React.Component {

  onClick = () => {

  }

  render(){

    return (
      <div className="app-container">
        <div className="posts-container">

        </div>
        <div className="posts-button-container">
          <div className="button_cont" align="center">
            <a className="example_a" onClick={this.onClick} >
              Fetch Posts
            </a>
          </div>
        </div>
      </div>
    )
  }
}

const structuredSelector = createStructuredSelector({
  posts: state => state.posts,
})

const mapDispatchToProps = { fetchPosts }
export default connect(structuredSelector, mapDispatchToProps)(PostsComponent)

```

## Actions

Alright its time to wire up our actions, i forgot that we didn't build that critical part of redux architecture-

i will set up a separate file for our actions:
note : we will need to import our constants into this actions file

`./actions.js`

```javascript
import { Posts } from './constants'

// *********************************
// NOTE: Fetch Posts
// *********************************

export const fetchPostsSuccess = (data) => {
  return {
    type: Posts.fetchPostsSuccess,
    payload: data
  };
}

export const fetchPosts = (data) => {
  return {
    type: Posts.fetchPosts,
    payload: data
  }
}

export const fetchPostsError = (data) => {
  return {
    type: Posts.fetchPostsError,
    payload: data
  }
}

```

OK! sick we got our actions in place! notice how they just return an object with the type ( of action ), and also the payload!

Now lets go all the way back to our sagas file! we need to tell our sagas to respond to these different actions. we are going to change some names and stuff from our existing sagas file, so pay attention! dont just copy pasta!

- import constants
- import actions
- import API file
- modify sagas to respond and send actions
- `yield all` sagas, (basically turn them on)

`./sagas.js`

```javascript
import { call, put, takeLatest, all } from 'redux-saga/effects';
import { Posts } from './constants';
import { PostsAPI } from './API';
import {
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



```

Notice here we got a new file we are requiring called `./API` this is our file that will make api requests, i like to separate it out into its own little class method guy, to make it all nice and neat, it will return & resolve promises for us.

we need to import it and instantiate it into our sagas file

Sick, lets build it -

- import actions
- build `fetchPosts` that returns a promise

`./API`

```javascript

export class PostsAPI {
  fetchPosts = () => {
    return new Promise(function(resolve,reject) {
      const url = "https://jsonplaceholder.typicode.com/posts/"
      const options = {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            }
      fetch(url, options)
        .then((res) => {return res.json()})
        .then((response) => {
          resolve(response)
        })
        .catch(error => console.log(error))
    })
  }
}
```

Alright SICK!

now that our api call is set up, we basically just need to wire it into our component , so lets go all the way back to our component where we are calling fetch posts :

- import action into `./posts-component.js`
- call action from button

`/posts-component.js`

```javascript

import React from 'react';
import { fetchPosts } from './actions';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

class PostsComponent extends React.Component {

  onClick = () => {
    this.props.fetchPosts()
  }

  render(){

    return (
      <div className="app-container">
        <div className="posts-container">

        </div>
        <div className="posts-button-container">
          <div className="button_cont" align="center">
            <a className="example_a" onClick={this.onClick} >
              Fetch Posts
            </a>
          </div>
        </div>
      </div>
    )
  }
}

const structuredSelector = createStructuredSelector({
  data: state => state.posts,
})

const mapDispatchToProps = { fetchPosts }
export default connect(structuredSelector, mapDispatchToProps)(PostsComponent)

```

Alright now that we have our action firing, our saga should be picking up the action of `FETCH_POSTS` and sending out an api request , and then triggering the action `FETCH_POSTS_SUCCESS`. once this success happens , an action should be fired with a `payload`. We can tap into this from the reducer, lets go there now:

- here we will use the spread operator to spread the posts into the store

`/reducer-post.js`

```javascript
import { Posts } from './constants'

const initialState = {
  posts: []
}

export const postsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Posts.fetchPosts:
      return state
    case Posts.fetchPostsSuccess:
      return {
        ...state,
        posts: action.payload
      }
    default:
      return initialState
  }
}
```

Now that we have our posts properly going into our store, we can set up our front end component to display our posts.


`./posts-component.js`


```javascript
import React from 'react';
import { fetchPosts } from './actions';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

class PostsComponent extends React.Component {

  onClick = () => {
    this.props.fetchPosts()
  }

  render() {

    const { posts } = this.props.data;

    return (
      <div className="app-container">
        <div className="posts-container">
          {
            posts.length > 0 &&
            posts.slice(0,10).map((post,i)=>{
              return (
                <div key={i} className="each-post">
                  <b>Post#{i.toString()}</b> - {post.title}
                </div>
              )
            })
          }
        </div>
        <div className="posts-button-container">
          <div className="button_cont" align="center">
            <a className="example_a" onClick={this.onClick} >
              Fetch Posts
            </a>
          </div>
        </div>
      </div>
    )
  }
}

const structuredSelector = createStructuredSelector({
  data: state => state.posts
})

const mapDispatchToProps = { fetchPosts }
export default connect(structuredSelector, mapDispatchToProps)(PostsComponent)

```

# Styles

alright , lets add some really basic styles so it doesn't look like complete trash!

`./App.css`

```css
.App {
  text-align: center;
}

body {
  background: #D66D75;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #E29587, #D66D75);  /* Chrome 10-25, Safari 5.1-6 */

}

.app-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 50vh;
  width: 80vw;
  background: linear-gradient(to bottom, #323232 0%, #3F3F3F 40%, #1C1C1C 150%), linear-gradient(to top, rgba(255,255,255,0.40) 0%, rgba(0,0,0,0.25) 200%);
  background-blend-mode: multiply;
  box-shadow: 0 6px 15px rgba(36, 37, 38, 0.08);
}

.each-post {
  padding: 5px;
  color: #ffa532;
  margin: 5px;
}

/* BUTTON CSS */
/* i know its extra */
/* Credit: https://www.fabriziovanmarciano.com/button-styles/ */

.example_a {
  color: #fff !important;
  text-transform: uppercase;
  text-decoration: none;
  background: #ed3330;
  padding: 20px;
  border-radius: 5px;
  display: inline-block;
  border: none;
  transition: all 0.4s ease 0s;
}
.example_a:hover {
  cursor: pointer;
  background: #434343;
  letter-spacing: 1px;
  -webkit-box-shadow: 0px 5px 40px -10px rgba(0,0,0,0.57);
  -moz-box-shadow: 0px 5px 40px -10px rgba(0,0,0,0.57);
  box-shadow: 5px 40px -10px rgba(0,0,0,0.57);
  transition: all 0.4s ease 0s;
}

```

# Alright great!

I hope you guys learned something from building , if theres any bugs or issues feel free to hit me up in the comments!!!!!

Thanks for reading!


