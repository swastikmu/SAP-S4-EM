const express = require("express");
const request = require("request");
const dotenv = require('dotenv').config();
const {desc} = require("@sap/cloud-sdk-core");
const {ServiceEntrySheet} = require("@sap/cloud-sdk-vdm-service-entry-sheet-service");
const xsenv = require("@sap/xsenv");
const {Client} = require("@sap/xb-msg-amqp-v100");

const app = express(); 

var payload = {"message" : "hey swastik"};

auth = "Basic " + new Buffer.from(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET).toString("base64");


console.log(process.env.CLIENT_ID);
console.log(process.env.CLIENT_SECRET);

// var options = {
//     method: 'GET',
//     url: 'https://p1940372748trial.authentication.eu10.hana.ondemand.com/oauth/token?grant_type=client_credentials&response_type=token',
//     headers: {
//         'cache-control': 'no-store',
//          'Content-Type': 'application/json;charset=UTF-8',
//          'Authorization': auth,
//     },
//     form: {
//         'grant_type': 'client_credentials'
//     }
// }

// request(options, function(err, res, body) {
//   token = JSON.parse(body);
//   console.log(token);
//  console.log(res.statusCode);
// });


const getAuth = () => {

    var token;
    var options = {
        method: 'GET',
        //url: 'https://p1940372748trial.authentication.eu10.hana.ondemand.com/oauth/token?grant_type=client_credentials&response_type=token',
        url: process.env.TOKEN_ENDPOINT,
        headers: {
            'cache-control': 'no-store',
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': auth,
        },
        form: {
            'grant_type': 'client_credentials'
        }
    }
    return new Promise(function(resolve, reject) {
        request(options, function(err, resp, body) {
            if (err) {
                reject(err);
                console.log(err);
            } else {
                token = JSON.parse(body).access_token;
                resolve(token);
                console.log(token);
            }
        })
    })
}

const sendMessage = (payload, token) => {
    let dataPayload = payload;
    var options = {
        method: 'POST',
       // url: 'https://enterprise-messaging-pubsub.cfapps.eu10.hana.ondemand.com/messagingrest/v1/topics/topic1/messages',
        url: process.env.TOPIC_ENDPOINT,
        headers: {
            'Content-Type': 'application/json',
             Authorization: 'Bearer ' + token,
             'x-qos' : '0'
        },
        body: JSON.stringify(dataPayload),
        datatype: "json"
    };
    return new Promise(function(resolve, reject) {

        request(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(body);
                console.log(body);
            }
        })
    })
}

async function sendToEM(ServiceEntrySheet) {
var authPromise = await getAuth();
console.log(authPromise);
var bod = await sendMessage(ServiceEntrySheet , authPromise);
console.log(bod);
}




//auth token generated 



function getServiceEntrySheeets() {
	return ServiceEntrySheet.requestBuilder()
		.getAll()
		.top(3)
		.execute({
       // url: 'https://my300532-api.s4hana.ondemand.com:443',
        url: process.env.HOSt,
        username: process.env.COMM_USER,    
        password: process.env.PASSKEY
		});
}

app.get("/service-sheet", function (req, res) {
	getServiceEntrySheeets()
		.then(ServiceEntrySheet => {

			res.status(200).json(ServiceEntrySheet);
            sendToEM(ServiceEntrySheet);

		});
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
	console.info("Listening on port: " + port);
});