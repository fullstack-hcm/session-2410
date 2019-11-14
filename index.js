let express         = require('express');
let app             = express();
let bodyPaser       = require('body-parser');
let expressSession  = require('express-session');
let { check, validationResult }  = require('express-validator');
let { renderCustom } = require('./helpers');
app.set('view engine', 'ejs');
app.set('views', './views/');

app.use(bodyPaser.json());
app.use(bodyPaser.urlencoded({ extended: true }));

app.use(expressSession({
    secret: 'MERN2410',
    saveUninitialized: true,
    resave: true,
    cookie: {
        maxAge: 10 * 60 * 1000 // milli
    }
}))
let gbDemo = 1;

app.get('/mua-ve', (req, res) => {
    req.session.isLogin = true;
    res.json({ message: 'mua_ve_thanh_cong' });
});

app.get('/vao-rap', (req, res) => {
    let { isLogin } = req.session;
    if (!isLogin) {
        res.json({ message: 'vui_long_mua_ve' });
    } else {
        res.json({ message: 'moi_xem_phim' })
    }
});

app.get('/register', (req, res) => {
    let username = '', email = '', pwd = '';
    let { errors, infoUser } = req.session;
    if (infoUser) {
        username    = infoUser.username;
        email       = infoUser.email;
        pwd         = infoUser.pwd;
    }
    req.session.errors = [];
    res.render('register', {
        errors,
        username, 
        email, 
        pwd
    });
});

app.post('/register', [
    check('email').isEmail().withMessage('Email Không Hợp Lệ'),
    check('username').isLength({ min: 2, max: 5 }).withMessage('Username Không Hợp Lệ')
], (req, res) => {
    let { username, email, pwd } = req.body;

    const errorsGl = validationResult(req);
    if (!errorsGl.isEmpty()) {
        req.session.errors = errorsGl.errors;
    }

    req.session.infoUser = {
        username, email, pwd
    };

    res.redirect('/register');
})

app.get('/demo1', (req, res) => {
    /**
     * infoUser -> DB
     */
    renderCustom(res, { demo1: 'a' }, 'abc')
})

app.get('/demo2', (req, res) => {
    renderCustom(res, { demo1: 'b' }, 'abc')
})

app.get('/demo2', (req, res) => {
    renderCustom(res, { demo1: 'c' }, 'abc')

})

app.listen(3000, () => console.log(`server start at port 3000`));