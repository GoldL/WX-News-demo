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
//处理影人
function convertToCastString(casts) {
  let castsjoin = ''
  for (let idx in casts) {
    castsjoin = castsjoin + casts[idx].name + '/'
  }
  return castsjoin.substring(0, castsjoin.length-2)
}

//处理演员照片
function convertToCastInfos(casts) {
  let castsArray = []
  for (let idx in casts) {
    let cast = {
      img: casts[idx].avatars ? casts[idx].avatars.large : '',
      name: casts[idx].name,
      id: idx
    }
    castsArray.push(cast)
  }
  return castsArray
}

module.exports = {
  http: http,
  convertToStarsArray: convertToStarsArray,
  convertToCastString: convertToCastString,
  convertToCastInfos: convertToCastInfos
}