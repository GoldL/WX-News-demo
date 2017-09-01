// pages/post/post.js
const postsData = require('../../data/posts-data.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onLoad: function () {
    // this.data.postList = postsData.postList
    this.setData({
      posts_key: postsData.postList
    });
  },
  onPostTap: function (event) {
    let postId = event.currentTarget.dataset.postid
    wx.navigateTo({
      url: '../post/post-detail/post-detail?id=' + postId
    })
  },
  onSweiperTap: function (event) {
    let postId = event.target.dataset.postid
    wx.navigateTo({
      url: '../post/post-detail/post-detail?id=' + postId
    })
  }

})