const express = require('express');
const router = express.Router();
const { signup, signin } = require('../../controllers/admin/auth');
const { requireSignin } = require('../../common-middleware/index');
const { validateSignupRequest, validateSigninRequest, isRequestValidated } = require('../../validators/auth');


router.post('/admin/signin', validateSigninRequest, isRequestValidated, signin);
router.post('/admin/signup', validateSignupRequest, isRequestValidated, signup);

module.exports = router;
