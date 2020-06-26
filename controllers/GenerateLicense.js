var JavaScriptObfuscator = require('javascript-obfuscator');
const Customer = require('../models/Customers')

module.exports = {
  async Index (request, response) {
    const sessionUser = request.session.user;

    const customers = await Customer.findAll({ where: { }, raw: true })
    response.render('pages/dashboard/generate_license', { sessionUser, customers })
  },

  async Generate (request, response) {
    const sessionUser = request.session.user;

    const { domain, product } = request.body;

    const getFullUrl = (request) =>{
      const url = 'https://' + request.get('host');
      return url;
    }

    const customerData = await Customer.findOne({ where: { domain }})

    const domainToRequest = getFullUrl(request)+'/style.css';


    var functionSent =
`
const myDomain = window.location.host;
const key = '${customerData.key}';


fetch("${domainToRequest}", {
  "method": "POST",
  "headers": {
    "content-type": "application/json",
    "domain": myDomain,
    "key": key
  }
})
.then(response => {
  return response.json();
}).then(data => {

  var d = new Date();

  var date = d.getDate();
  var month = d.getMonth() + 1;
  var year = d.getFullYear();

  if(month <= 9) {
      month = '0'+month
  }

  var dateString = year + "-" + month + "-" + date;

  var responseDate = data.findCustomer.date
  var currentDate = dateString


  if(data.ok == false){
    $('html').remove();
  }
  if(responseDate < currentDate) {
    $('html').remove();
  }
})
.catch(err => {
  $('html').remove();
});

`
  // var obfuscationResult = JavaScriptObfuscator.obfuscate(functionSent,
  //   {
  //       target: 'browser',
  //       compact: false,
  //       controlFlowFlattening: true,
  //       deadCodeInjection: true,
  //       domainLock: [customerData.domain],
  //       splitStrings: true,
  //       stringArray: true,
  //       transformObjectKeys: true,
  //       renameGlobals: true,
  //       shuffleStringArray: true,
  //       deadCodeInjectionThreshold: 0.4,
  //       // debugProtection: true,
  //       // debugProtectionInterval: true,
  //       // disableConsoleOutput: true,
  //   }
  // );

  // functionSent = obfuscationResult;
    response.render('pages/dashboard/generate_new_license',  {code: functionSent})

  }
}
