require('dotenv').config();

const express = require('express');
const router = express.Router();
const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

router.get('/', (req, res, next) => {
  res.render('pages/login', { title: 'SigIn page' })
});

router.post('/', (req, res, next) => {

  const { email, password } = req.body;

  if (!email || !password) {
    res.render('pages/login', { msglogin: 'Необходимо заполнить все поля!' });

  } else if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    res.render('pages/login', {
      msglogin: 'Неверный имейл или пароль!',
    });
  };

  res.redirect('/admin');
});

module.exports = router;
