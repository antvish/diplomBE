
router.post('/login', (req, res, next) => {
    if (validUser(req.body)) {
        //check if the in db
        User
            .getUserByLogin(req.body.login)
            .then(user => {
                if (user) {
                    //compare password with hashed password
                    bcrypt.compare(req.body.password, user.password)
                        .then((result) => {
                            //if the password match
                            if (result) {
                                //set cookie header
                                res.cookie('user_id', user.id, {
                                    httpOnly: true,
                                    signed: true,
                                    secure: true,
                                    expires: 0,
                                });
                                //res === true
                                res.json({
                                    result,
                                    message: 'Logged in...',
                                })
                            } else {
                                next(new Error('Invalid login or password'));
                            }

                        });

                } else {
                    next(new Error('Invalid login or password'))
                }
            })
    } else {
        next(new Error('Invalid login or password'))
    }
});
