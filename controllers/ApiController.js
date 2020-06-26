const Customer = require('../models/Customers');

module.exports = {
  async CheckLicense (request, response) {
    const { key, domain } = request.headers;

    if(!key ||!domain)
    return response.status(404).json({ ok: false, messsage: 'The domain or key is missing.' })

    const findCustomer = await Customer.findOne({ where: { key } })

    if(!findCustomer)
    return response.status(404).json({ ok: false, message: 'There is no user with the key entered.' })

    if(findCustomer.domain != domain) {
      await Customer.update(
        { isBanned: true },
        { where: { key } }
      ).then(res => {
        response.status(400).json({ ok: false })
      })
    }else if(findCustomer.isBanned == 1){
      response.status(400).json({ ok: false, message: `This user is banned.` })
    }else{
      response.status(200).json({ ok: true, findCustomer })
    }
  }
}
