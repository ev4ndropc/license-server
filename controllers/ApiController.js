const nodemailer = require('nodemailer');
const Customer = require('../models/Customers');

const getFullUrl = (request) =>{
  const url = 'https://' + request.get('host');
  return url;
}

module.exports = {
  async CheckLicense (request, response) {
    const { key, domain } = request.headers;

    if(!key ||!domain)
    return response.status(404).json({ ok: false, messsage: 'The domain or key is missing.' })

    const findCustomer = await Customer.findOne({ where: { key } })

    if(!findCustomer)
    return response.status(404).json({ ok: false, message: 'There is no user with the key entered.' })

    if(findCustomer.domain != domain) {

      if(findCustomer.isBanned == 0){

        var remetente = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: process.env.SMTP_SECURE,
          auth:{
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS }
        });

        var emailData = `
        <p>Name: ${findCustomer.name}<p>
        <p>Domain: ${domain}<p>
        <p>Domain allowed: ${findCustomer.domain}<p>
        <p>Contact: <a href="mailto:${findCustomer.email}">${findCustomer.email}</a></p>
        <a href="${getFullUrl(request)}/">Ban this user?</a>
        `

        var emailASerEnviado = {
          from: process.env.SMTP_FROM,
          to: process.env.SMTP_TO,
          subject: 'License Server - Access not allowed',
          html: 'Estou te enviando este email com node.js',
        };

        remetente.sendMail(emailASerEnviado, function(error){
          if (error) {
          console.log(error);
          } else {

          }
        });

      }

      response.status(400).json({ ok: false })

    }else if(findCustomer.isBanned == 1){
      response.status(400).json({ ok: false, message: `This user is banned.` })
    }else{
      response.status(200).json({ ok: true, findCustomer })
    }
  }
}
