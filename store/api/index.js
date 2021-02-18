const express = require('express');
const cookies = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cookies());

const COOKIES_CONFIG = { maxAge: 3600000 * 24 * 7, httpOnly: true };

app.get('/cart', (req, res) => {
  let { cart } = req.cookies;
  if(!cart)
    cart = { items: [], totalPrice: 0 };

  return res.json(cart);
});

app.delete('/remove-cart', async (req, res) => {
  res.clearCookie('cart');
  return res.json({items: [], totalPrice: 0} );
});

app.post('/cart/add', (req, res) => {
  let cart = req.cookies.cart;
  if(!cart)
    cart = { items: [], totalPrice: 0, };
  cart.totalPrice = 0;

  const { body } = req;
  let [exists] = cart.items.filter(p => p.id === body.optionId);
  if(!exists)
    cart.items.push(body);
  else
    for(let c of cart.items)
      if(c.id === body.optionId)
        c.quantity = body.quantity;

  let totalPrice = 0;
  cart.items = cart.items.filter(c => {
    if(c.quantity)
      totalPrice += parseFloat(c.price) * parseFloat(c.quantity);
    return c.quantity > 0;
  });

  cart.totalPrice = totalPrice;
  totalPrice = 0;

  res.cookie('cart', cart, { httpOnly: true });
  return res.json(cart);
});

app.post('/save-customer', async (req, res) => {
  const { body } = req;

  // Expires in 1 day.
  const session = {
    user: body,
    ...(req.cookies.session || {})
  };
  res.cookie('session', session, COOKIES_CONFIG);
  return res.json({ data: body });
});

app.post('/remove-customer', async (req, res) => {
  res.clearCookie('session');
  return res.json({ data: null });
});

app.get('/get-customer', async (req, res) => {
  if(!req.cookies.session)
    return res.json({ data: null });
  return res.json({ data: req.cookies.session.user });
});

module.exports = {
  path: '/api',
  handler: app
};
