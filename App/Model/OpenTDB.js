//NAME: Austin Jacobs
//SUNET ID: ajacobs7

// Simple React Native specific changes

const baseURL = 'https://opentdb.com/'

export default class APIRequest {

  static async globalInfo(callback) {
    try {
      let response = await fetch(baseURL + 'api_count_global.php')
      let responseJson = await response.json();
      callback(responseJson)
    } catch (error) {
      console.log(error)
    }
  }

  static contains(x, y) {
    for(var i=0; i< y.length; i++) {
      if(x.indexOf(y[i]) == -1) { return false; }
    }
    return true;
  }

 //https://opentdb.com/api.php?amount=50&category=9
  static async searchCategories(searchTerm, callback) {
    try {
      this.globalInfo( async (info) => {
        var categories = []
        Promise.all(Object.keys(info.categories).map( (id) => {
          return this.getQuestionFromCategory(id, (question) => {
            categories.push({id: id, name: question.category})
          })
        })).then( (res) => {
          var filtered = categories.filter((c) => this.contains(c.name, searchTerm))
          callback(filtered)
        })
        
      })      
    } catch (error) {
      console.log(error)
    }
  }

  static getQuestionFromCategory(id, callback) {
    var unescape = require('recursive-unescape');
    try {
      //+'&encode=url3986'
      return fetch(baseURL + 'api.php?amount=1&category='+id).then( async (response) => {
        let responseJson = await response.json();
        let responseEscaped = unescape(responseJson)
        let responseCleaned = JSON.parse(JSON.stringify(responseEscaped).replace(/&#039;/g, '\''))
        callback(responseCleaned.results[0])
      })
    } catch (error) {
      console.log(error)
    }
  }

}
