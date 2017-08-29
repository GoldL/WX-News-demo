// pages/welcome/welcome.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  bindViewTap: function () {
    //带返回的跳转
    // wx.navigateTo({
    //   url: '../post/post',
    // })

    //无返回的跳转
    wx.redirectTo({
      url: '../post/post',
    })
  }
})