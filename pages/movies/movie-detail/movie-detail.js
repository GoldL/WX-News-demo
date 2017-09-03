// pages/movies/movie-detail/movie-detail.js
import {Movie} from 'class/Movie.js'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let movieId = options.id
    let url = app.globalData.doubanBase + "/v2/movie/subject/" + movieId
    let movie = new Movie(url)
    movie.getMovieData((movie) => {
      this.setData({
        movie: movie
      })
    })
  },
  viewMoviePostImg: function(event) {
    let src = event.currentTarget.dataset.src
    wx.previewImage({
      current: src,
      urls: [src]
    })
  }
 
})