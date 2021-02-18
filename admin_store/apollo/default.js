const API_GATEWAY_ENDPOINT = "http://localhost:4000";

export default function(context) {

  return {
    httpLinkOptions: {
      uri: API_GATEWAY_ENDPOINT,
      headers: {
        authentication: "Admin eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjYyMTM5NX0.D2J0irfP7ZY-M_GKiIPSTQ9-XFpYeQ28XrLz9BdvPfU"
      }
    },
    ...context
  };
}
