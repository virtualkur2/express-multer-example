const authCtrl = require('../../controllers/auth.controller');
const userCtrl = require('../../controllers/user.controller');

const users = (router) => {
  router.route('/api/user/signup')
    .post(userCtrl.create);

  router.route('/api/user/id/:userId')
    .get(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.read)
    .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
    .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove);

  router.route('/api/user/email/:userEmail')
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove);

  router.param('userId', userCtrl.userById);
  router.param('userEmail', userCtrl.userByEmail);

  return router;
}

module.exports = users;
