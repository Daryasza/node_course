require('dotenv').config();
const { NODEMAILER_HOST, NODEMAILER_PORT, NODEMAILER_TO } = process.env;

const express = require('express');
const router = express.Router();
const { Database } = require('../db');
const nodemailer = require("nodemailer");

router.get('/', async (req, res, next) => {

  const products = await Database.getDBProducts();
  const skills = await Database.getDBSkills();

  res.render('pages/index', { title: 'Main page', products, skills })
});

router.post('/', async (req, res, next) => {

  const products = await Database.getDBProducts();
  const skills = await Database.getDBSkills();

  if (!req.body.name || !req.body.email || !req.body.message) {
    return res.render('pages/index', {
      msgemail: 'Необходимо заполнить все поля!',
      products,
      skills,
      status: 'Error',
    })
  }

  (async function () {
    let testAccount = await nodemailer.createTestAccount();
  
    let transporter = nodemailer.createTransport({
      host: NODEMAILER_HOST,
      port: NODEMAILER_PORT,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  
    transporter.sendMail({
      from: `<${req.body.email}>`,
      to: NODEMAILER_TO, 
      text: req.body.message,
    }, (error, info) => {
      if (error) {
        return res.render('pages/index', {
          msgemail: 'При отправке письма произошла ошибка!',
          products,
          skills,
          status: 'Error',
        })
      }

      res.render('pages/index', {
        msgemail: 'Письмо отправлено!',
        products,
        skills,
        status: 'Ok',
      })
    });
  }())
});

module.exports = router;
