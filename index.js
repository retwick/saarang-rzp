var express   = require('express');
var app       = express();
var swig = require('swig');
var bodyParser = require('body-parser');

var Razorpay = require('razorpay');
var instance = new Razorpay({
  key_id: 'rzp_test_2LJTA0baC5T5ER',
  key_secret: 'BeGQT6njfhjfkNacqd4ARzum'
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.set('views', __dirname + '/views');
var swig = new swig.Swig();
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

var amount= 250,
    receipt = '1234',
    payment_capture =true,
    notes ="someCrazyStuff",
    order_id,payment_id;

app.get('/', (req, res) => {
  instance.orders.create({amount, receipt, payment_capture, notes}).then((response) => {
    console.log(response);
    order_id=response.id;
  }).catch((error) => {
    console.log(error);
    })
  res.render(
      'index',
      {order_id:order_id,amount:amount}
    );
});


app.post('/purchase', (req,res) =>{
    payment_id =  req.body;
    instance.payments.fetch(payment_id.razorpay_payment_id).then((response) => {
    instance.payments.capture(payment_id.razorpay_payment_id, response.amount).then((response) => {
    res.redirect("https://www.saarang.org");
  }).catch((error) => {
  console.log(error);
  });
}).catch((error) => {
  console.log(error);
});
})

app.listen(3000, () => {
    console.log('Enjoy istening to port 3000!')
})