const Util = require('../../../../utils/util.js')

class Movie {
  constructor(url) {
    this.url = url
  }

  getMovieData(cb) {
    this.cb = cb
    Util.http(this.url, this.processDoubanData.bind(this))
  }

  processDoubanData(data) {
    if (!data) {
      return
    }

    let director = {
      avator: '',
      name: '',
      id: ''
    }

    if (data.directors[0] != null) {
      if (data.directors[0].avatars != null) {
        director.avatar = data.directors[0].avatars.large
      }
      director.name = data.directors[0].name
      director.id = data.directors[0].id
    }

    let movie = {
      movieImg: data.images ? data.images.large : '',
      country: data.countries[0],
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentCount: data.comments_count,
      year: data.year,
      generes: data.genres.join('、'),
      stars: Util.convertToStarsArray(data.rating.stars),
      score: data.rating.average,
      director: director,
      casts: Util.convertToCastString(data.casts),
      castsInfo: Util.convertToCastInfos(data.casts),
      summary: data.summary
    }
    this.cb(movie)
  }
}

export {Movie}