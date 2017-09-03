// pages/movies/more-movie/more-movie.js
const Util = require('../../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies: {},
    navigateTitle: "",
    requestUrl: "",
    totalCount: 0,
    isEmpty: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let categoryTitle = options.category
    this.data.navigateTitle = categoryTitle
    let dataUrl = ''
    switch (categoryTitle) {
      case '正在热映':
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters"
        break
      case '即将上映':
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon"
        break
      case '豆瓣Top250':
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250"
        break
    }
    this.data.requestUrl = dataUrl
    Util.http(dataUrl, this.processDoubanData)
    wx.showNavigationBarLoading()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })
  },
  processDoubanData: function (moviesDouban) {
    let movies = []
    for (let idx in moviesDouban.subjects) {
      let subject = moviesDouban.subjects[idx]
      let title = subject.title
      if (title.length >= 6) {
        title = title.substring(0, 6) + '...'
      }
      let temp = {
        stars: Util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }
    let totalMovies = {}
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies)
    } else {
      totalMovies = movies
      this.data.isEmpty = false
    }
    this.setData({
      movies: totalMovies
    })
    this.data.totalCount += 20
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let refreshUrl = this.data.requestUrl + '?start=0&count=20'
    this.data.movies = {}
    this.data.isEmpty = true
    this.data.totalCount = 0
    Util.http(refreshUrl, this.processDoubanData)
    wx.showNavigationBarLoading()
  },
  onScrollLower: function () {
    
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let nextUrl = this.data.requestUrl + '?start=' + this.data.totalCount + '&count=20'
    Util.http(nextUrl, this.processDoubanData)
    wx.showNavigationBarLoading()
  },
  onMovieTap: function (event) {
    let movieId = event.currentTarget.dataset.movieid
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId
    })
  }
})