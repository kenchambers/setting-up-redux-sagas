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
