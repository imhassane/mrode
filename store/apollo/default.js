const API_GATEWAY_ENDPOINT = "http://localhost:4000";

export default function(context) {

  return {
    httpLinkOptions: {
      uri: API_GATEWAY_ENDPOINT
    },
    ...context
  };
}
