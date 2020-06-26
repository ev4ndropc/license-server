const Customer = require('../models/Customers');

module.exports = {
  async Index (require, response) {
    const customerData = await Customer.findAll({ where: {}});

    response.render('pages/dashboard/customers', { customerData })
  },
  async DeleteCustomer (request, response) {
    let sessionUser = request.session.user;
    const id = request.params.id;
    if(sessionUser){
      await Customer.destroy({
        where:{
          id
        }
      });
      response.redirect('/customers')
    }
  },

  async Ban (request, response) {
    let sessionUser = request.session.user;
    const id = request.params.id;
    if(sessionUser){
      await Customer.update(
        { isBanned: true },
        { where: { id } }
      )
      response.redirect('/customers')
    }
  },

  async Unban (request, response) {
    let sessionUser = request.session.user;
    const id = request.params.id;
    if(sessionUser){
      await Customer.update(
        { isBanned: false },
        { where: { id } }
      )
      response.redirect('/customers')
    }
  },

  async Edit (request, response) {
    let sessionUser = request.session.user;
    const id = request.params.id;
    const { name, email, product, domain, date } = request.body;
    if(sessionUser){
      await Customer.update(
        { name, email, product, domain, date },
        { where: { id } }
      )
      response.redirect('/customers')
    }
  },

  async BanThis (request, response) {
    const key = request.params.key;
    await Customer.update(
      { isBanned: true },
      { where: { key } }
    )
    response.status(200).json({ ok: true })

  }
}
