import fetch from 'node-fetch'
var DomParser = require('dom-parser');
var parser = new DomParser();

require('dotenv').config()

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'djiss2917@gmail.com',
        pass: process.env.OHLALA
    }
});


var mailOptions = {
    from: 'djiss2917@gmail.com',
    to: 'djiss2917@gmail.com',
    subject: 'availability',
    text: ''
};

;
let found = false;
let count = 0;
let exit = setInterval(() => {
    fetch("https://floridastateparks.reserveamerica.com/camping/dr-julian-g-bruce-st-george-island-state-park/r/campgroundDetails.do?contractCode=FL&parkId=281068", {
  "headers": {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-language": "en-US,en;q=0.9,fr;q=0.8,zh-CN;q=0.7,zh;q=0.6",
    "cache-control": "no-store",
    "content-type": "application/x-www-form-urlencoded",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "cookie": "_ga=GA1.2.1571115330.1592536019; JSESSIONID=B0F76952524E87276BC86F1571D8DAF9.awoashprodweb14; NSC_BTIQSPE-VXQQM-GM-IUUQT=ffffffff09474f0f45525d5f4f58455e445a4a422e09; _gid=GA1.2.1171057747.1592704284; _gat=1"
  },
  "referrer": "https://floridastateparks.reserveamerica.com/camping/dr-julian-g-bruce-st-george-island-state-park/r/campgroundDetails.do?contractCode=FL&parkId=281068",
  "referrerPolicy": "no-referrer-when-downgrade",
  "body": "contractCode=FL&parkId=281068&siteTypeFilter=ALL&lob=&availStatus=&submitSiteForm=true&search=site&campingDate=Tue+Jul+14+2020&lengthOfStay=1&campingDateFlex=&currentMaximumWindow=12&loop=&siteCode=&lookingFor=&camping_2001_3013=&camping_2001_218=&camping_2002_3013=&camping_2002_218=&camping_2003_3012=&camping_3100_3012=&camping_10001_3012=&camping_10001_3018=&camping_3101_3012=&camping_3101_218=&camping_9002_3012=&camping_9002_3013=&camping_9002_218=&camping_9001_3012=&camping_9001_218=&camping_3001_3013=&camping_3102_3012=",
  "method": "POST",
  "mode": "cors"
})
        .then(res => res.text())
        .then(html => {

            var dom = parser.parseFromString(html);
            let element = dom.getElementsByClassName('matchSummary')
            let response = element[0].innerHTML.substring(0, 20)
            console.log(`#${count += 1}: ${response}`)
            if (element[0].innerHTML.includes('54 site(s) found')) {
                clearInterval(exit)
                mailOptions.text = 'Cookie expired'
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                        found = true;
                    }
                })
            }
            else if (!element[0].innerHTML.includes('0 site(s) available out of 54')) {
                mailOptions.text = element[0].innerHTML
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                        found = true;
                    }
                })
            }

        })
}, 1000)



