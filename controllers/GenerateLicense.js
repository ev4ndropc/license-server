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
      const url = request.protocol + '://' + request.get('host');
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
  console.log(data)
  if(data.ok == false){
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
  //   }
  // );

  // functionSent = obfuscationResult;
    response.render('pages/dashboard/generate_new_license',  {code: functionSent})

  }
}
