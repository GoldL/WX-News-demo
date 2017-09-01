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

    //无返回的跳转，跳转的应用内非 tabBar 的页面的路径
    // wx.redirectTo({
    //   url: '../post/post',
    // })

    //跳转到tabBar页面
    wx.switchTab({
      url: '../post/post',
    })

  }
})