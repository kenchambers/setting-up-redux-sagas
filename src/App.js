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