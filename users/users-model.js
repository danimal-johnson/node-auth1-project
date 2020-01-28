const db = require('../data/dbConfig.js');

module.exports = {
  add,
  find,
  findBy,
  findById
}

function add(user) {
  return db('users')
    .insert(user, 'id')
    .then(ids => {
      const [id] = ids;
      return findById(id);
    });
}

// Get all usernames
function find() {
  return db('users').select('id', 'username');
}

function findBy(filter) {
  console.log("Filter:", filter);
  return db('users')
    .select('id', 'username', 'password')
    .where(filter);
}

function findById(id) {
  return db('users')
    .select('id', 'username')
    .where({ id })
    .first();
}