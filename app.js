const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const ejs = require('ejs');
const { check, validationResult } = require('express-validator/check');
const mongojs = require('mongojs');
const ObjectId = mongojs.ObjectID;
const db = mongojs('customerapp', ['users']);

const app = express();

/** View Engine */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/** Body Parser Middleware */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/** Set static path */
app.use(express.static(path.join(__dirname, 'public')));

/** Make a global variable */
app.use((req, res, next) => {
  res.locals.errors = null;
  next();
});

app.get('/', (req, res) => {
  /** Find Data */
  db.users.find((err, docs) => {
    res.render('index', {
      title: 'Customers',
      users: docs
    });
  });
});

/** Post data */
app.post(
  '/users/add',
  [
    check('first_name')
      .not()
      .isEmpty()
      .withMessage('First Name is Required'),
    check('last_name')
      .not()
      .isEmpty()
      .withMessage('Last Name is Required'),
    check('email')
      .not()
      .isEmpty()
      .withMessage('Email is Required')
      .isEmail()
      .withMessage('Email is Invalid')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      db.users.find((err, docs) => {
        res.render('index', {
          title: 'Customers',
          users: docs,
          errors: errors.array()
        });
      });
    } else {
      const newUser = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email
      };

      db.users.insert(newUser, (err, result) => {
        if (err) {
          console.log('err');
        } else {
          res.redirect('/');
        }
      });
    }
  }
);

/** Delete Data */
app.delete('/users/delete/:id', (req, res) => {
  db.users.remove({ _id: ObjectId(req.params.id) }, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send({ data: 'success' });
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
