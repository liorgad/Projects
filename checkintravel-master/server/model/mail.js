const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const config = require('../config/database');

var EmailSchema = mongoose.Schema({
  email: String,
  create_dt: Date,
});

EmailSchema.pre('save', function (next) {
  var doc = this;
  doc.create_dt = Date.now();
  next();
});

const Email = mongoose.model('Email', EmailSchema, 'emails');

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(senderEmail, receiverEmail, subject, html) {

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  //let account = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  // let transporter = nodemailer.createTransport({
  //   host: "smtp.ethereal.email",
  //   port: 587,
  //   secure: false, // true for 465, false for other ports
  //   auth: {
  //     user: account.user, // generated ethereal user
  //     pass: account.pass // generated ethereal password
  //   }
  // });

  let transporter = nodemailer.createTransport({
    service: config.mail.type,
    auth: {
      user: config.mail.user,
      pass: config.mail.password
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: senderEmail, // sender address
    to: receiverEmail, // list of receivers
    subject: subject, // Subject line
    // text: "Hello world?", // plain text body
    html: html // html body
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions)

  console.log("Message sent: %s", JSON.stringify(info));
  // Preview only available when sending through an Ethereal account
  //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

// async..await is not allowed in global scope, must use a wrapper
async function sendMailText(senderEmail, receiverEmail, subject, text) {

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  //let account = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  // let transporter = nodemailer.createTransport({
  //   host: "smtp.ethereal.email",
  //   port: 587,
  //   secure: false, // true for 465, false for other ports
  //   auth: {
  //     user: account.user, // generated ethereal user
  //     pass: account.pass // generated ethereal password
  //   }
  // });

  let transporter = nodemailer.createTransport({
    service: config.mail.type,
    auth: {
      user: config.mail.user,
      pass: config.mail.password
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: senderEmail, // sender address
    to: receiverEmail, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    // html: html // html body
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions)

  console.log("Message sent: %s", JSON.stringify(info));
  //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}


async function test() {
  try {
    var res = await sendMail("checkintravel.flying@gmail.com", "liorgad@gmail.com", "eTicket", "<h1>Hello World!</h1>")
    console.log(JSON.stringify(res))
  } catch (err) {
    console.log(err)
  }
}

//test()

module.exports = {
  Email,
  sendMail,
  sendMailText,
}
