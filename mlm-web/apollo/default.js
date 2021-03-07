const API_GATEWAY_ENDPOINT = "http://localhost:4000";

export default function(context) {

  const cookies = process.browser ? document.cookie : context.req.headers.cookie;
  let lang = "fr";
  let token = "", strategy = "local";
  if(cookies) {
    for (const c of cookies.split(";")) {
      let [name, value] = c.split("=");
      name = name.trim();

      if (name === "i18n_redirect")
        lang = value;
      else if(name === "auth.strategy")
        strategy = value;
      else if(name === `auth._token.${strategy}`)
        token = value;
      else if (name === "authentication")
        token = value;
    }
  }

  return {
    ...context,
    httpLinkOptions: {
      uri: API_GATEWAY_ENDPOINT,
      headers: {
        authentication: token.replace("Bearer", "mlm"),
        lang,
      }
    },
  };
}
