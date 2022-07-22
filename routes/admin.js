const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const formidable = require('formidable');
const { Database } = require('../db');

router.get('/', (req, res, next) => {
  res.render('pages/admin', { title: 'Admin page' });
})

router.post('/skills', async (req, res, next) => {
  try {
    await Database.updateDBSkill(req.body);
    res.redirect('/');

  } catch (error) {
    console.error(error);
  }
})

router.post('/upload', (req, res, next) => {
  const form = new formidable.IncomingForm();
  const upload = path.join('./public', 'upload');

  if (!fs.existsSync(upload)) {
    fs.mkdirSync(upload)
  }

  form.uploadDir = path.join(process.cwd(), upload);

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return next(err);
    }

    const validationResult = validation(fields, files);

    if (validationResult.err) {
      fs.unlinkSync(files.photo.filepath);

      res.render('pages/admin', {
        msgfile: 'validationResult.status',
      });
    }

    const fileName = path.join(upload, fields.name);

    try {
      await Database.addDBProduct({
        src: fileName,
        name: fields.name,
        price: fields.price,
      });

      res.render('pages/admin', {
        msgfile: 'Картинка успешно загружена',
      });

    } catch (err) {
      console.error(err.message);
      res.render('pages/admin', { msgfile: 'Ошибка при загрузке картинки' });
    }
  })
})

const validation = (fields, files) => {
  if (files.photo.size === 0) {
    return { status: 'Не загружена картинка!', err: true }
  } else if (!fields.name) {
    return { status: 'Не указано описание картинки!', err: true }
  } else if (!fields.price) {
    return { status: 'Не указана цена!', err: true }
  }

  return { status: 'Ok', err: false }
}

module.exports = router
