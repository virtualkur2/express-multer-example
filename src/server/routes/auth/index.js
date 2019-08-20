const authCtrl = require('../../controllers/auth.controller');
const auth = (router) => {
  router.route('/api/auth/signin')
    .post(authCtrl.signin);
}

module.exports = auth;
