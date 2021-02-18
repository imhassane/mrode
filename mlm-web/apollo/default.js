const API_GATEWAY_ENDPOINT = "http://localhost:4000";

export default function(context) {

  const cookies = process.browser ? document.cookie : context.req.headers.cookie;
  let lang = "fr";
  let token = null;
  if(cookies) {
    for (const c of cookies.split(";")) {
      const [name, value] = c.split("=");
      if (name === "i18n_redirect")
        lang = value;
      else if (name.trim() === "authentication")
        token = value;
    }
  }

  return {
    httpLinkOptions: {
      uri: API_GATEWAY_ENDPOINT,
      headers: {
        authentication: "mlm " + token,
        lang,
      }
    },
    ...context
  };
}
