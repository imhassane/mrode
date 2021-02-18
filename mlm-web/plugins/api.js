export default function ({ $axios }, inject) {

  const api = $axios.create({
    headers: {
      common: {
        Accept: 'application/json'
      }
    }
  })

  // Set baseURL to something different
  api.setBaseURL('http://localhost:3005/api/')

  // Inject to context as $api
  inject('api', api)
}
