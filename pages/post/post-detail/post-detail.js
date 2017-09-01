// pages/post/post-detail/post-detail.js
const postsData = require('../../../data/posts-data.js')
const app = getApp()
Page({

  data: {
    isPlayingMusic: false
  },

  onLoad: function (options) {
    let postId = options.id
    this.data.currentPostId = postId
    let postData = postsData.postList[postId]
    this.setData({
      postData: postData
    })
    //初始化文章收藏状态
    let postsCollected = wx.getStorageSync('posts_collected')
    if (postsCollected) {
      let postCollected = postsCollected[postId]
      this.setData({
        collected: postCollected
      })
    } else {
      let postsCollected = {}
      postsCollected[postId] = false
      wx.setStorageSync('posts_collected', postsCollected)
    }
    //初始化音乐播放
    if (app.g_isPlayingMusic && app.g_currentMusicPostId === postId) {
      this.setData({
        isPlayingMusic: true
      })
    }
    this.setMusicMonitor()
  },
  setMusicMonitor: function () {
    let thiz = this
    //监听背景音乐
    wx.onBackgroundAudioPlay(function (event) {
      // 打开多个post-detail页面后，每个页面不会关闭，只会隐藏。通过页面栈拿到到
      // 当前页面的postid，只处理当前页面的音乐播放。
      let pages = getCurrentPages()
      let currentPage = pages[pages.length - 1]
      // 打开多个post-detail页面后，每个页面不会关闭，只会隐藏。通过页面栈拿到到 当前页面的postid，只处理当前页面的音乐播放。
      if (currentPage.data.currentPostId === thiz.data.currentPostId) {
        // 播放当前页面音乐才改变图标
        thiz.setData({
          isPlayingMusic: true
        })
      }
      app.globalData.g_isPlayingMusic = true
    })
    wx.onBackgroundAudioPause(function () {
      let pages = getCurrentPages()
      let currentPage = pages[pages.length - 1]
      if (currentPage.data.currentPostId === thiz.data.currentPostId) {
        if (app.globalData.g_currentMusicPostId == thiz.data.currentPostId) {
          thiz.setData({ isPlayingMusic: false })
        }
      }
      app.globalData.g_isPlayingMusic = false
    })
    wx.onBackgroundAudioStop(function () {
      thiz.setData({ isPlayingMusic: false })
      app.globalData.g_isPlayingMusic = false;
      // app.globalData.g_currentMusicPostId = null;
    })
  },
  onMusicTap: function (event) {
    let currentPostId = this.data.currentPostId
    let postData = postsData.postList[currentPostId]
    let isPlayingMusic = this.data.isPlayingMusic
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio()
      this.setData({
        isPlayingMuisc: false
      })
      app.globalData.g_isPlayingMusic = false
    } else {
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg
      })
      this.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true
      app.globalData.g_currentMusicPostId = currentPostId
    }
  },
  onColletionTap: function (event) {
    //同步存储数据
    this.getPostsCollectedAsy()

  },
  getPostsCollectedAsy: function () {
    let thiz = this;
    wx.getStorage({
      key: 'posts_collected',
      success: function (res) {
        let postsCollected = res.data
        let postCollected = postsCollected[thiz.data.currentPostId]
        //改变收藏状态
        postCollected = !postCollected
        postsCollected[thiz.data.currentPostId] = postCollected
        thiz.showToat(postsCollected, postCollected)
        // thiz.showModel(postsCollected, postCollected)
      }
    })
  },
  showToat: function (postsCollected, postCollected) {
    //更新文章收藏状态
    wx.setStorageSync('posts_collected', postsCollected)
    this.setData({
      collected: postCollected
    })
    wx.showToast({
      title: postCollected ? '收藏成功' : '取消成功',
      duration: 1000,
      icon: 'success'
    })
  },
  showModel: function (postsCollected, postCollected) {
    let thiz = this
    wx.showModal({
      title: '收藏',
      content: postCollected ? '收藏该文章？' : '取消收藏该文章？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '＃333',
      confirmText: '确定',
      confirmColor: '#405f80',
      success: function (res) {
        if (res.confirm) {
          wx.setStorageSync('posts_collected', postsCollected)
          thiz.setData({
            collected: postCollected
          })
        }
      },
    })
  },
  onShareTap: function (event) {
    let shareList = ['分享给微信好友', '分享到朋友圈', '分享到QQ', '分享到微博']
    wx.showActionSheet({
      itemList: shareList,
      itemColor: "#405f80",
      success: function (res) {
        wx.showModal({
          // res.cancel 用户是不是点击了取消按钮 res.tapIndex 数组元素的序号，从0开始
          title: shareList[res.tapIndex],
          content: '现在无法实现分享功能，什么时候能支持呢'
        })
      }
    })
  },
  /*
    * 定义页面分享函数
    */
  onShareAppMessage: function (event) {
    return { title: this.data.postData.title, desc: this.data.postData.content, path: '/pages/posts/post-detail/post-detail?id=' + this.data.currentPostId }
  }
})