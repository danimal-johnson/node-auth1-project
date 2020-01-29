const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('../users/users-model.js');
const restricted = require('./restricted-middleware.js');

router.post('/register', (req, res) => {
  let user = req.body;
  let hash = bcrypt.hashSync(req.body.password, 10);
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved)
    })
    .catch(err => {
      res.status(500).json(err);
    });
});


router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      console.log(user);
      if (user && bcrypt.compareSync(password, user.password)) {
        console.log("User:", user);
        req.session.loggedIn = true;
        req.session.userId = user.id;
        res.status(200).json({ message: "Logged in." });
      }
      else {
        res.status(401).json({ message: "You shall not pass!"});
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Something went wrong!"});
    })
});

// Boilerplate logout code.
router.get("/logout", (req, res) => {
  if (req.session) {
      req.session.destroy(err => {
          if (err) {
              res.status(500).json({
                  errorMessage: err,
              });
          } else {
              res.status(200).json({ message: "You have successfully logged out." });
          }
      });
  } else {
      res.status(204);
  }
});

router.get('/users', restricted, (req, res) => {
  // Middleware "restricted" takes care of access.
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
});

module.exports = router;