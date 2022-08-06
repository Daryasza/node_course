const auth = require('./auth.js')
const util = require('./util.js')
const User = require('../models/user.js');

const requiredFields = [
  'id',
  'username',
  'permission'
]
const optionalFields = [
  'firstName',
  'middleName',
  'surName',
  'avatar',
  'image'
]
const requiredTokenFields = [
  'accessToken',
  'refreshToken',
  'accessTokenExpiredAt',
  'refreshTokenExpiredAt'
]
const editableUserFields = [
  'firstName',
  'middleName',
  'surName',
  'avatar'
]

exports.register = (req, res) => {
  const status = util.checkBody(req.body, [
    "username",
    "password"
  ])
  if (Object.keys(status).length)
    return res.status(status.code).send(status.message);

  User.findOne({ username: req.body.username })
    .then(data => {
      if (data)
        res.status(400).send({ message: 'The username is already taken' });
      else {
        // If no - create a new user
        const user = new User({
          username: req.body.username,
          firstName: req.body.firstName || '',
          middleName: req.body.middleName || '',
          surName: req.body.surName || '',
          avatar: '',
          permission: {
              chat: { C: false, R: false, U: false, D: false },
              news: { C: false, R: false, U: false, D: false },
              settings: { C: true, R: true, U: true, D: true }
          },
          passwordHash: auth.getHash(req.body.password)
        });
        user.save()
          .then(data => {
            auth.issueTokens(data._id).save()
              .then(data => {
                data.populate('user')
                  .then(populatedData => {
                    res.send({
                      ...util.cutResponse([populatedData.user], requiredFields, optionalFields)[0],
                      ...util.cutResponse([populatedData], requiredTokenFields)[0]
                    })
                  })
                  .catch(err => {
                    console.error(err);
                    res.status(500).send();
                  })
              })
              .catch(err => {
                console.error(err);
                res.status(500).send();
              })
          })
          .catch(err => {
            console.error(err);
            res.status(500).send()
          });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).send();
    })
};

exports.login = async (req, res) => {
  const status = util.checkBody(req.body, [
    "username",
    "password"
  ])
  if (Object.keys(status).length)
    return res.status(status.code).send(status.message);

  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).send({ message: "The user is not authenticated" });
    }
    const isCorrect = await auth.checkUserPassword(user.id, req.body.password)
    if (!isCorrect) return res.status(403).send({ message: "Access denied" });
    else {
      auth.issueTokens(user.id).save()
        .then(data => {
          data.populate('user')
            .then(populatedData => {
              res.send({
                ...util.cutResponse([populatedData.user], requiredFields, optionalFields)[0],
                ...util.cutResponse([populatedData], requiredTokenFields)[0]
              })
            })
            .catch(err => {
              console.error(err);
              res.status(500).send();
            })
        })
        .catch(err => {
          console.error(err);
          res.status(500).send();
        })
    }
  } catch(err) {
    console.error(err);
    return res.status(500).send();
  }
};

exports.getProfile = async (req, res) => {
  const authData = await auth.checkAuth(req);
  if (authData.code) return res.status(authData.code).send({ message: authData.message });

  const userId = await auth.getUserIdByAccessToken(authData.accessToken);
  if (!userId) res.status(500).send()

  User.findById(userId)
    .then(data => res.send(util.cutResponse([data], requiredFields, optionalFields)[0]))
    .catch(err => {
      console.error(err);
      res.status(500).send();
    })
};

exports.updateProfile = async (req, res) => {
  const authData = await auth.checkAuth(req);
  if (authData.code) return res.status(authData.code).send({ message: authData.message });

  const userId = await auth.getUserIdByAccessToken(authData.accessToken);
  if (!userId) res.status(500).send()

  const status = util.checkBody(req.body)
  if (Object.keys(status).length)
    return res.status(status.code).send(status.message);

  // Prepare all the acceptable fields
  const updatedFields = {}
  editableUserFields.forEach(field => {
    // This is a workaround for frontend bug
    if (
      req.body[field] &&
      req.body[field] !== 'undefined' &&
      req.body[field] !== 'null'
    ) updatedFields[field] = req.body[field];
  });

  // "avatar" field is an exception because we should convert bin to base64img
  // Let's assume that we can have only 1 file uploaded
  if (req.files.length) {
    // Supported image formats
    const supportFormats = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/svg+xml'
    ]
    if (!supportFormats.includes(req.files[0].mimetype))
      return res.status(400).send({
        message: `Supported image formats: ${supportFormats}`
      })

    // in frontend part, both variables are used periodically
    updatedFields.avatar = `data:${req.files[0].mimetype};base64,${req.files[0].buffer.toString('base64')}`
    updatedFields.image = `data:${req.files[0].mimetype};base64,${req.files[0].buffer.toString('base64')}`
  }

  // "password" fields is the 2nd exception because we should receive both old and new
  if (req.body.oldPassword || req.body.newPassword) {
    if (req.body.oldPassword && req.body.newPassword) {
      if (!await auth.checkUserPassword(userId, req.body.oldPassword))
        return res.status(403).send({ message: "Access denied" })
      updatedFields.passwordHash = auth.getHash(req.body.newPassword);
    } else {
      return res.status(400).send({
        message: "To change the password, you need to specify both 'newPassword' and 'oldPassword'"
      })
    }
  }

  User.findByIdAndUpdate(userId, updatedFields, { new: true })
    .then(data => res.send(util.cutResponse([data], requiredFields, optionalFields)[0]))
    .catch(err => {
      console.error(err);
      res.status(500).send();
    })
};

exports.refreshToken = async (req,res) => {
  if (!req.headers['authorization'])
    return res.status(401).send({ message: `The 'Authorization' header is required` });

  const status = util.checkBody(req.body, ["accessToken"])
  if (Object.keys(status).length)
    return res.status(status.code).send(status.message);

  const refreshedToken = await auth.refreshToken(
    req.body.accessToken, req.headers['authorization']
  );

  return refreshedToken ? res.send(refreshedToken) : res.status(403).send({
    message: "Access denied"
  });
}

exports.updatePermissions = async (req, res) => {
  const authData = await auth.checkAuth(req);
  if (authData.code) return res.status(authData.code).send({ message: authData.message });

  const status = util.checkBody(req.body, ["permission"])
  if (Object.keys(status).length)
    return res.status(status.code).send(status.message);

  for (const field of [
    "chat",
    "news",
    "settings"
  ]) {
    if (!req.body.permission[field]) {
      return res.status(400).send({ message: `The '${field}' field is required`});
    } else if (Object.keys(req.body.permission[field]).sort().join() !== "C,D,R,U") {
      return res.status(400).send({
        message: 'All fields are required for each category: C, D, R, U'
      });
    }
  }

  User.findByIdAndUpdate(
    req.params.id,
    { permission: req.body.permission },
    { new: true }
  )
    .then(data => res.send(util.cutResponse([data], requiredFields, optionalFields)[0]))
    .catch(err => res.status(500).send())
};

exports.list = async (req, res) => {
  const authData = await auth.checkAuth(req);
  if (authData.code) return res.status(authData.code).send({ message: authData.message });

  User.find()
    .then(data => res.send(util.cutResponse(data, requiredFields, optionalFields)))
    .catch(err => res.status(500).send());
};

exports.delete = async (req, res) => {
  const authData = await auth.checkAuth(req);
  if (authData.code) return res.status(authData.code).send({ message: authData.message });

  User.findByIdAndDelete(req.params.id)
    .then(data => res.status(data ? 204 : 404).send())
    .catch(err => res.status(500).send())
};
