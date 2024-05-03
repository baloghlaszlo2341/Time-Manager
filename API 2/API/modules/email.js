// email sendings opertions

const router = require('express').Router();
var nodemailer = require('nodemailer');
let clr = require('cli-color'); 

var error = clr.red.bold;
var notice = clr.blue;

var transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth:{
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

router.post('/send', (req, res)=>{

    var mailOptions = {
        from: process.env.SMTP_USER,
        to: req.body.to,
        subject: req.body.subject,
        html: req.body.message
    }

    transport.sendMail(mailOptions, (err, info)=>{
        if (err) {
            console.log(error(`E-mail sending failed! - ${err}`));
        }else
        {
            console.log(notice(`E-mail sent successfully! - ${info}`));
        }
    });

    res.send('Email sent to the target...');
});

module.exports = router;