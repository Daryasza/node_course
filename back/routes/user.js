const multer = require('multer');
const upload = multer();
const users = require('../controllers/user.js');

module.exports = (app) => {
  app.get('/api/users', users.list);
  app.get('/api/profile', users.getProfile);
  app.post('/api/login', users.login);
  app.post('/api/registration', users.register);
  app.post('/api/refresh-token', users.refreshToken);
  app.patch('/api/profile', upload.any(), users.updateProfile);
  app.patch('/api/users/:id([a-z0-9]{24})/permission', users.updatePermissions);
  app.delete('/api/users/:id([a-z0-9]{24})', users.delete);
}
