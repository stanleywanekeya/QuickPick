const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');


exports.signup = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email});

    if (user) {
        return res.status(400).json({
            message: 'Admin already exists'
        });
    }

    const { firstName, lastName, email, password } = req.body;

    const _user = new User({
        firstName,
        lastName,
        email,
        password,
        username: Math.random().toString(),
		role: 'admin'
    });

    const data = await _user.save();

	if (data) {
		return res.status(201).json({
			message: 'Admin created successfully..!'
		});
	}
});

exports.signin = asyncHandler(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });

	if (user) {
		if (user.authenticate(req.body.password) && user.role === 'admin') {
			const token = jwt.sign({_id: user._id, role: user.role}, process.env.JWT_SECRET, { expiresIn: '1h' });
			const { _id, firstName, lastName, email, role, fullName } = user;
			res.status(200).json({
				token, 
				user: {
					_id, firstName, lastName, email, role, fullName
				}
			});
		} else {
			return res.status(400).json({
				message: 'Invalid password'
			});
		}
	} else {
		return res.status(400).json({message: 'Something went wrong'})
	}
});
