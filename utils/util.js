//封装的get请求
function http(url, callbackFun) {
  wx.request({
    url: url,
    method: 'GET',
    header: {
      // 'content-type': 'application/json'
      "Content-Type": "json"
    },
    success: function (res) {
      if (200 !== res.statusCode) {
        wx.showToast({
          title: res.errMsg,
          icon: 'loading',
          duration: 2000
        })
      } 
      callbackFun(res.data)
    },
    fail: function (error) {
      wx.hideLoading()
      console.log(error)
    }
  })
}
//评论星星处理 
function convertToStarsArray(stars) {
  let num = stars.toString().substring(0, 1)
  let arr = []
  for (let i = 1; i <= 5; i++) {
    if (i <= num) {
      arr.push(1)
    } else {
      arr.push(0)
    }
  }
  return arr
}
module.exports = {
  http: http,
  convertToStarsArray: convertToStarsArray,
}