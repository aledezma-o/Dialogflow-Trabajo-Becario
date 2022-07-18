'use strict';
const axios = require('axios'); // axios para hacer consultas

const functions = require('firebase-functions'); // libreria de funciones de firebase
const {WebhookClient} = require('dialogflow-fulfillment'); // webhook para los fulfillments
const {Card, Suggestion} = require('dialogflow-fulfillment');
// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin'); // necesitamos el admin de firebase
const { Message } = require('firebase-functions/v1/pubsub');
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://dialogflowtestmessenger-muwf-default-rtdb.firebaseio.com/"
}); // iniciamos la app con el URL de la base de datos (de donde sacaremos los datos)
const db = admin.firestore(); // variable para operar con los datos en firebase

exports.chatbot = functions.https.onRequest((request, response) => {
    console.log("req***********: ", request.body);
    const agent = new WebhookClient({ request, response });
    console.log("Dialogflow Request headers: " + JSON.stringify(request.headers));
    console.log("Dialogflow Request body: " + JSON.stringify(request.body));

    // function Welcome(agent) { // ejemplo para sacar datos de la table Estudiantes
    //     const estudiante = db.collection("Estudiantes");
    //     const idEstudiante = "kw6A8oA3tQOtlAx8XKpx"; // id del estudiante
    //     //
    //     return estudiante.doc(idEstudiante).get().then((snapshot) => {
    //         //agent.add(`Codigo: ${snapshot.id}`); // id del objeto en firebase
    //         agent.add(`Codigo: ${snapshot.data().Codigo}`);
    //         agent.add(`Nombre: ${snapshot.data().Nombre} ${snapshot.data().Apellido}`);
    //         //agent.add(`Materias: ${snapshot.data().Materias}`);
    //         agent.add(message);
    //     }).catch(() => {
    //         agent.add('Buenos dias!');
    //     });
    //     //
    //     //agent.add(`Welcome to my agent!`);
    // }

    function Welcome(agent) { 
        agent.add(`Hola! ¿Cómo puedo ayudarle?`);
    }

    function fallback(agent) {
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }

    function horarioAcordeon(agent){
        agent.add("Su horario:");
        // foreach cantidadHorario in horario: // creamos un acordeon para cada materia
        const payload = {
            "richContent": [
              [
                {
                  "type": "accordion",
                  "title": "Matematicas para Ingenieria I",
                  "subtitle": "B: 10:00 - 12:00",
                  "text": "Docente: A, Aula: A-5"
                }
              ]
            ]
          };
          agent.add(
            new Payload(agent.UNSPECIFIED, payload, {rawPayload: false, sendAsMessage: true})
          );  
          //agent.add(horarioAcord);
    }

    function rhymingWordHandler(agent){
        const word = agent.parameters.any;
        agent.add(`Este es el agente de rimas!`);
        console.log("Este es el agente de rimas!");
        agent.add(`Las palabras que riman con  "${word} " son:`);
        return axios.get(`https://api.datamuse.com/words?rel_rhy=${word}`)
        .then((result) => {
            result.data.map(wordObj => {
                agent.add(wordObj.word); // en Actions en Parameters
                //agent.add(wordObj.numSyllables);
            });
        });
      }

      function pet(agent){
        agent.add(`which one u want`);
        const payload = {
         
          "richContent":[
            [
              {
                "type":"chips",
                "options":[
                  {
                    "text":"Dog",
                    "link" : "https://en.wikipedia.org/wiki/Dog"
                  },
                  {
                    "text":"Cat",
                    "link":"https://en.wikipedia.org/wiki/Cat"
                  },
                  {
                  "text":"Rabbit",
                  "link" : "https://en.wikipedia.org/wiki/Rabbit"
                  }
                ]
              }
            ]
          ]
         
        };
        agent.add(new Payload(agent.UNSPECIFIED, payload, {rawPayload: true, sendAsMessage: true}));
      }
    //////////////////////////////////////////////

    let intentMap = new Map();
    intentMap.set("Saludo", Welcome); // como el default welcome intent, en el nuestro lo cambiamos a: Saludo
    intentMap.set("Default Fallback Intent", fallback);

    //intentMap.set("Rhymes", rhymingWordHandler);
    intentMap.set("Rhymes", rhymingWordHandler); // handler de rimas del ejemplo

    // horarios
    intentMap.set("HorariosMateriasCodigo", horarioAcordeon);

    // ejemplo internet de como usar RICH RESPONSES en .js
    intentMap.set('mypet',pet);

    // intentMap.set('your intent name here', yourFunctionHandler);
    // intentMap.set('your intent name here', googleAssistantHandler);
    agent.handleRequest(intentMap);
});
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// ejemplo lista
// {
//     "richContent": [
//       [
//         {
//           "type": "list",
//           "subtitle": "Horario A: 7:45 - 9:45",
//           "event": {
//             "name": "",
//             "languageCode": "",
//             "parameters": {}
//           },
//           "title": "Calculo I"
//         },
//         {
//           "type": "divider"
//         },
//         {
//           "event": {
//             "languageCode": "",
//             "parameters": {},
//             "name": ""
//           },
//           "subtitle": "Horario C: 12:15 - 14:15",
//           "title": "Programacion I",
//           "type": "list"
//         }
//       ]
//     ]
//   }