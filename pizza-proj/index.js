function saveJSON(obj)
{

  var jsonfile = require('jsonfile');

  var d = new Date();
  var extension = d.getTime();

  var file = './orders/order-' + extension + '.json';

  jsonfile.writeFile(file, obj, { flag: 'wx' }, function (err) {
    console.error(err);
  });

}


var jsonDoc = require('./pizzainfo.json');
const express = require('express');
const bodyParser = require('body-parser');
const dateFormat = require('dateformat');
const PriceCalculator = require('./PriceCalculator');

var obj;

const app = express();

//Set up the Template Engine
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));


//application specific routes
app.get('/', function(req, res){

    res.render('orderPage',
      { sizes : jsonDoc.sizes,
        crust : jsonDoc.crust,
        toppings : jsonDoc.toppings });

});


app.post('/', function(req, res){

    var pc = new PriceCalculator(req.body.optSizes,
                                 req.body.optCrust,
                                 req.body.optToppings,
                                 jsonDoc.sizes);
    var cost = pc.calcOrder();

    var now = new Date();
    var orderDate = dateFormat(now, "mmmm dS, yyyy, h:MM:ss TT");

    now.setHours(now.getHours() + 1);
    var deliveryDate = dateFormat(now, "mmmm dS, yyyy, h:MM:ss TT");

    obj = {
            order: {
              size: req.body.optSizes,
              crust : req.body.optCrust,
              toppings: req.body.optToppings,
              total : cost,
              orderDate: orderDate,
              deliveryDate: deliveryDate
            },
            customer: {
              name: req.body.name,
              phoneNumber : req.body.phoneNumber,
              address : req.body.address,
              city : req.body.city,
              province : req.body.province,
              postalCode : req.body.postalCode
            }
          };

    res.render('orderConfirmation',
        {size : req.body.optSizes, crust : req.body.optCrust,
         toppings: req.body.optToppings, cost : cost,
         name : req.body.name, phoneNumber : req.body.phoneNumber,
         address : req.body.address, city : req.body.city,
         province : req.body.province, postalCode : req.body.postalCode,
         message: deliveryDate});
});

app.post('/orderConfirm', function(req, res) {

  saveJSON(obj);

});

app.post('/orderCancel', function(req, res) {

  res.redirect("/");

});

app.listen(3000, function(){
  console.log("Listening on port 3000.....");
});
