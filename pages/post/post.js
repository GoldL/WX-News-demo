// pages/post/post.js
var postsData = require('../../data/posts-data.js')

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
    var postId = event.currentTarget.dataset.postid
    wx.navigateTo({
      url: '../posts/post-detail/post-detail?id=' + postId
    })
  }


})