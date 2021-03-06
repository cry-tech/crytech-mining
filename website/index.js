const fs = require('fs');
const exphbs = require('express-hbs')
const express = require('express');
const app = express();
const pagesData = require('./data/pages').pages;

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
// var urlencodedParser = bodyParser.urlencoded({ extended: false })  

app.use(express.static('.'));

app.engine('hbs', exphbs.express4({
  partialsDir: 'views/partials',
  defaultLayout: 'views/layouts/default.hbs'
}));

app.set('view engine', 'hbs');
app.set('partials', __dirname + '/views/partials');

const token = "510961664:AAGCF1blO2s-PR4FmoB72q41JCcQ-jzi7jQ";
var bot = {
  sendMessage: function (message) {
    // message = this.markupText(message);
    this.httpGet(`https://api.telegram.org/bot${token}/sendMessage?chat_id=` +
      "-347499444" + "&parse_mode=Markdown&text=" + encodeURIComponent(message));
  },
  httpGet: function (theUrl, callback) {
    var request = require('request');
    request(theUrl, function (error, response, body) {
      // Get the response raw body
      if (callback)
        callback(body);
    });
  }
};

// Routing

app.post('/subscribe', function (req, res) {
  var msg = "Thank you for your interest. We have put your email (" +
    req.body.email + ") on the list. We will inform you via email.";
  bot.sendMessage(`new subscriber:\n${req.body.email}`);
  res.send(msg);  //JSON.stringify(response)
})
app.post('/contact', function (req, res) {
  var msg = "We got your message. \nYou will soon receive an email from us.";
  bot.sendMessage(`new contact message\n\nemail: ${req.body.email}\nname: ${req.body.name}\nmessage:\n${req.body.message}`);
  res.send(msg);  //JSON.stringify(response)
});

app.get('*', function (req, res) {
  
  var page = pagesData[req.path.toLowerCase()];
  if (!page)
    return res.status(404).render('404', { transparentNavBar: true });

  res.render(page.name,page);
});

app.listen(80);