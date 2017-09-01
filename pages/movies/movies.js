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
    top250: {}
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
      if (data.statusCode === 200) {
        thiz.processDoubanData(data.data, settedKey, categoryTitle)
      } else {
        console.log('请求数据出错了')
      }
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
  }
})