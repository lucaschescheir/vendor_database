const express = require('express');
const bodyparser = require('body-parser');
const mustache = require('mustache-express');
const server = express();
const Sequelize = require('sequelize');

server.use(bodyparser.urlencoded({
  extended: false
}));

server.use(express.static('./public'));

server.engine('mustache', mustache());
server.set('views', './public');
server.set('view engine', 'mustache');

const db = new Sequelize('vendor', 'lucaschescheir', '', {
  dialect: 'postgres',
});

const Item = db.define('item', {
  description: Sequelize.STRING,
  cost: Sequelize.INTEGER,
  quantity: Sequelize.INTEGER,

});

const Purchase = db.define('purchase', {
  ItemId: Sequelize.INTEGER,
  cost: Sequelize.INTEGER,
});

Purchase.sync().then(function() {
  console.log('Purchase is synced')
});

Item.sync().then(function() {
  console.log('Item model is synced');

});

//get list of items
server.get('/api/customer/items', function(req, res) {
  Item.findAll()
    .then(function(item) {
      res.send(item)
    });
});

//add an Item
server.post('/api/items', function(req, res) {
  Item.create({
    description: req.body.description,
    cost: parseInt(req.body.cost),
    quantity: parseInt(req.body.quantity),
  }).then(function() {
    res.redirect('/api/customer/items')
  });
});

// purchase an item
server.post('/api/customer/items/:itemId/purchases', function(req, res) {
  const id = parseInt(req.params.itemId);

  Item.find({
    where: {
      id: id,
    },
  })
  .then(function(item){
      item.update({
        quantity: item.quantity -1,
      }, {
        where: {
          id: id
        },
      });
      Purchase.create({
          ItemId: parseInt(item.id),
          cost: item.cost,
        });
    })
    .then(function() {
      res.redirect('/api/customer/items')
    });
  });

//update item data
server.put('/api/vendor/items/:itemId', function(req, res) {
  const id = parseInt(req.params.itemId);
  //what to update and where
  Item.update({
      description: req.body.description,
      cost: parseInt(req.body.cost),
      quantity: parseInt(req.body.quantity),
    }, {
      where: {
        id: id,
      },
    })
    .then(function() {
      res.redirect('/api/customer/items');
    });
});

//vendor what and when An item was purchsed
server.get('/api/vendor/purchases', function(req, res){
  Purchase.findAll()
  .then(function(purchase){
    res.send(purchase)
  })
})

//total amount of money machine has taken
// server.get('/api/vendor/money', function(req, res){
//   Purchase.sum({
//     where: {
//       cost: 230,
//     }
//   })
//   .then(function(count){
//     console.log(count)
//   })


//})
server.listen('3000');

console.log('connected to port 3000')
