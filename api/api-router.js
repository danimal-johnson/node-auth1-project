const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('../users/users-model.js');

// var salt = bcrypt.genSaltSync(10);


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
//   res.status(501).json({ message: "Not implemented. Yet."});
});


router.post('/login', (req, res) => {
  let { username, password } = req.body;
  
  // let hash = bcrypt.hashSync(password, 10);
  // console.log(`${username}: ${password} ==> ${hash}`);

  Users.findBy({ username })
    .first()
    .then(user => {
      console.log(user);
      if (user && bcrypt.compareSync(password, user.password)) {
        console.log("User:", user);
        res.status(200).json({ message: "Logged in." });
        // Also send cookie with userID
      }
      else {
        res.status(401).json({ message: "You shall not pass!"});
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Something went wrong!"});
    })
//  res.status(501).json({ message: "Not implemented. Yet."});
});

router.get('/users', (req, res) => {
  // TODO: If not logged in, respond with 401 "You shall not pass!"
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
  // res.status(501).json({ message: "Not implemented. Yet."});
});

module.exports = router;