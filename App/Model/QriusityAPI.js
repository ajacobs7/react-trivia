//NAME: Austin Jacobs
//SUNET ID: ajacobs7

// NOTE: Certificate expired for this API, not currently in use by the app

const baseURL = 'https://qriusity.com/v1'

const APIRequest = {

  searchCategories : async (searchTerm, page=1) => {
    try {
      let response = await fetch(baseURL + '/categories/search?name='+searchTerm+'&page='+page)
      let responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.log(error)
    }
    return null;
  },

  getQuestionFromCategory : async (id) => {
    try {
      let page = Math.floor(Math.random()*20)
      let response = await fetch(baseURL + '/categories/'+id+'/questions?page='+page)
      let responseJson = await response.json();
      let choice = responseJson[Math.floor(Math.random()*responseJson.length)]
      return choice
    } catch (error) {
      console.log(error)
    }
    return null
  },

}

export default APIRequest;
