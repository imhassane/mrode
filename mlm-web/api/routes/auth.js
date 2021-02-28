const axios = require("axios");
const router = require("express").Router()

router.post("/login", async (req, res) => {
  try {
    let { code, password } = req.body;

    const {data: { data: {authenticateMlmMember}}} = await axios.post("http://localhost:4000", {
      query: `
      mutation ($code: String!, $password: String!) {
        authenticateMlmMember(code: $code, password: $password) {
          token
          user {
            id
            firstName, lastName, avatarUrl,
            address { street {name, number}, country, city, postalCode }
            favoritesCount
          }
        }
      }
    `,
      variables: { code, password }
    });

    return res.json(authenticateMlmMember);
  } catch {
    return res.status(500).send({ message: "Une erreur s'est produite" })
  }
});

router.get("/user", async (req, res) => {
  try {
    const strategy = req.cookies['auth.strategy'];
    if(!strategy)
      return res.status(400).send({ message: "Les informations ne sont pas correctes" });

    const token = req.cookies[`auth._token.${strategy}`];
    if(!token || !token.length)
      return res.status(400).send({ message: "Vous n'êtes pas identifié" });

    const { data: { data: { authenticatedMlmMember: user } } } = await axios.post(
      'http://localhost:4000',
      {
        query: `
          {
            authenticatedMlmMember {
              id
              firstName, lastName, avatarUrl,
              address { street {name, number}, country, city, postalCode }
              favoritesCount
            }
          }
        `
      },
      {
        headers: {
          lang: req.cookies["i18n_redirect"] || "fr",
          authentication: token.replace("Bearer", "mlm")
        }
      }
    );
    return res.json({ user });
  } catch (ex) {
    console.log(ex.message)
    return res.status(500).send({ message: "Une erreur s'est produite" });
  }
});

module.exports = router;
