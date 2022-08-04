const auth = require('./auth.js');
const util = require('./util.js');
const News = require('../models/news.js');

const requiredNewsFields = [
  'id',
  'title',
  'text',
  'created_at',
  'user'
]
const requiredUserFields = [
  'id',
  'username',
  'firstName',
  'middleName',
  'surName',
  'image'
]
const editableNewsFields = [
  'title',
  'text'
]

async function getAllNews() {
  try {
    const news = await News.find().populate('user');
    const cuttedData = util.cutResponse(news, requiredNewsFields);
    cuttedData.forEach(news => {
      news.user = util.cutResponse([news.user], requiredUserFields)[0];
    });
    return cuttedData;
  } catch(err) {
    console.error(err);
    return;
  }
}

exports.create = async (req, res) => {
  const authData = await auth.checkAuth(req);
  if (authData.code) return res.status(authData.code).send({ message: authData.message });

  const userId = await auth.getUserIdByAccessToken(authData.accessToken);
  if (!userId) res.status(500).send()

  const status = util.checkBody(req.body, [
    'title',
    'text'
  ])
  if (Object.keys(status).length)
    return res.status(status.code).send(status.message);

  try {
    var news = new News({
      user: userId,
      title: req.body.title,
      text: req.body.text
    });
    await news.save()

    news = await getAllNews();
    return news ? res.send(news) : res.status(500).send();
  } catch(err) {
    console.error(err);
    res.status(500).send();
  }
};

exports.list = async (req, res) => {
  const authData = await auth.checkAuth(req);
  if (authData.code) return res.status(authData.code).send({ message: authData.message });

  const news = await getAllNews();
  return news ? res.send(news) : res.status(500).send();
};

exports.update = async (req, res) => {
  const authData = await auth.checkAuth(req);
  if (authData.code) return res.status(authData.code).send({ message: authData.message });

  const status = util.checkBody(req.body)
  if (Object.keys(status).length)
    return res.status(status.code).send(status.message);

  const updatedFields = {}
  editableNewsFields.forEach(field => {
    if (req.body[field]) updatedFields[field] = req.body[field];
  });

  try {
    await News.findByIdAndUpdate(req.params.id, updatedFields);
    const news = await getAllNews();
    return news ? res.send(news) : res.status(500).send();
  } catch(err) {
    console.error(err);
    res.status(500).send();
  }
};

exports.delete = async (req, res) => {
  const authData = await auth.checkAuth(req);
  if (authData.code) return res.status(authData.code).send({ message: authData.message });

  try {
    await News.findByIdAndDelete(req.params.id);

    const news = await getAllNews();
    return news ? res.send(news) : res.status(500).send();
  } catch(err) {
    console.error(err);
    res.status(500).send();
  }
};
