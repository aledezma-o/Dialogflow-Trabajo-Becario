const functions = require('firebase-functions');
const admin = require('firebase-admin');
//admin.initializeApp();
const express = require('express');
const app = express();
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
admin.initializeApp();

// iniciar servidor web
app.use(express.static(__dirname + "/public"));
app.listen('3000', function () {
    console.log("servidor web iniciado, escuchando en puerto 3000. http://localhost:3000/");
})