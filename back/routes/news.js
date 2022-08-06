const news = require('../controllers/news.js');

module.exports = (app) => {
  app.get('/api/news', news.list);
  app.post('/api/news', news.create);
  app.patch('/api/news/:id([a-z0-9]{24})', news.update);
  app.delete('/api/news/:id([a-z0-9]{24})', news.delete);
}
