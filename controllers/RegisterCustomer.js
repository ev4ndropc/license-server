const Admin = require('../models/Admin');
const Customer = require('../models/Customers');

module.exports = {
  async Index (request, response) {
    let sessionUser = request.session.user
    let message = ''
    response.render('pages/dashboard/register_customer', { sessionUser, message })
  },

  async Register (request, response) {
    const { name, email, product, domain, date } = request.body;
    let message = '';

    function stringGen(len) {
      var text = "";

      var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < len; i++)
        text += charset.charAt(Math.floor(Math.random() * charset.length));

      return text;
    }


    const isCustomer = await Customer.findOne({ where: { email } });

    if(isCustomer) {
      message = 'There is already a user with this registered email.'
      response.render('pages/dashboard/register_customer', { message })
    }else{
      message = 'User successfully registered.'
      await Customer.create({
        name,
        email,
        product,
        domain,
        date,
        isBanned: false,
        key: stringGen(255)
      });
      response.render('pages/dashboard/register_customer', { message })
    }

  }
}
