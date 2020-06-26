const bcrypt = require('bcryptjs');

const Admin = require('../models/Admin');

module.exports = {
  async Index (request, response) {
    let sessionUser = request.session.user
    message = '';

    if(sessionUser) {
      response.redirect('/dashboard');
    }else{
      response.render('pages/auth/login', { message });
    }

  },


  async Login (request, response) {
    const { email, password } = request.body;
    let message = '';


    const isAdmin = await Admin.findOne({ where:{ email } });

    if(isAdmin) {
      var correct = bcrypt.compareSync(password, isAdmin.password);

      if(correct){
        request.session.user = {
          id: isAdmin.id,
          email: isAdmin.email,
          name: isAdmin.name,
        }
        response.redirect('/dashboard');
      }else{
          message = 'Email or password is worng.'
          response.render('pages/auth/login', { message });
      }
    }else{
      message = 'Account not found.'
      response.render('pages/auth/login', { message });
    }
  },

}
