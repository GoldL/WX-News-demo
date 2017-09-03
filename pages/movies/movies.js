// pages/movies/movies.js
const Util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult: {},
    containerShow: true,
    searchPanelShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3"
    let comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3"
    let top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3"
    this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映")
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映")
    this.getMovieListData(top250Url, "top250", "豆瓣Top250")
  },
  getMovieListData: function (url, settedKey, categoryTitle) {
    let thiz = this;
    wx.showLoading({
      title: '加载中',
    })

    Util.http(url, function (data) {
      wx.hideLoading()
      // console.log(data)
      thiz.processDoubanData(data, settedKey, categoryTitle)
    })
  },
  processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
    let movies = []
    for (let idx in moviesDouban.subjects) {
      let subject = moviesDouban.subjects[idx]
      let title = subject.title
      if (title.length >= 6) {
        title = title.substring(0, 6) + "..."
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
    // console.log(movies)
    let readyData = {}
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    }
    this.setData(readyData)
  },
  onMoreTap: function (event) {
    let categoryTitle = event.currentTarget.dataset.category
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + categoryTitle
    })
  },
  onMovieTap: function (event) {
    let movieId = event.currentTarget.dataset.movieid
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId
    })
  },
  onBindBlur: function (event) {
    let text = event.detail.value
    let searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text
    this.getMovieListData(searchUrl, 'searchResult', '')
  },
  onCancelImgTap: function (event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {}
    }
    )
  },

  onBindFocus: function (event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },
})