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

        async function main() {

          var emailData = `
          <a href="${getFullUrl(request)}" style="display: flex; justify-content: center; align-items: center;">
            <img src="https://license-eyvindur.herokuapp.com/images/logo.png" widt="150px"/>
          </a>
          <p><strong>Name:</strong> ${findCustomer.name}<p>
          <p><strong>Domain:</strong> <a href="${domain}">${domain}</a><p>
          <p><strong>Domain allowed:</strong> <a href="${findCustomer.domain}">${findCustomer.domain}</a><p>
          <p><strong>Contact:</strong> <a href="mailto:${findCustomer.email}">${findCustomer.email}</a></p>
          <a style="text-decoration:none; padding: 12px; display: flex; justify-content: center; align-items: center;" href="${getFullUrl(request)}/ban/${key}"><span style="max-width:250px border-radius: 8px; background: #603ba9; color: #fff">Ban this user?</span></a>
          `

          let testAccount = await nodemailer.createTestAccount();


          let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS
            },
          });


          let info = await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: process.env.SMTP_TO,
            subject: "✔ License Server - Access not allowed",
            text: "Hello world?",
            html: emailData,
          });

          console.log("Message sent: %s", info.messageId);

          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }

        main().catch(console.error);

      }

      response.status(400).json({ ok: false })

    }else if(findCustomer.isBanned == 1){
      response.status(400).json({ ok: false, message: `This user is banned.` })
    }else{
      response.status(200).json({ ok: true, findCustomer })
    }
  }
}
