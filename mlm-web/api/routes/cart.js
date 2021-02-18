const router = require("express").Router();

const CART_COOKIE = "mlmCart";

router.get("/", async (req, res) => {
  let cart = { products: [], totalPrice: 0, quantity: 0 };
  if(req.cookies.mlmCart)
    cart = JSON.parse(req.cookies.mlmCart);

  return res.send({ data: cart })
});

module.exports = router;
