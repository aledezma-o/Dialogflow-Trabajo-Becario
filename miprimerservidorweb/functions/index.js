'use strict';
const axios = require('axios'); // axios para hacer consultas a servicios

const functions = require('firebase-functions'); // libreria de funciones de firebase
const {WebhookClient, Payload} = require('dialogflow-fulfillment'); // webhook para los fulfillments de funciones en intents
const {Card, Suggestion} = require('dialogflow-fulfillment');
// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin'); // necesitamos el admin de firebase
const { Message } = require('firebase-functions/v1/pubsub');
const { json } = require('express');
// proporcionamos el url publico de firebase
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

    // function Welcome(agent) { // ejemplo para sacar datos de la table Estudiantes de firebase
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

    // funcion para el intent de Saludo (con el que se inicia)
    function Welcome(agent) { 
        agent.add(`Hola! ??C??mo puedo ayudarle?`);
        const payload = {
            richContent: [
                [
                    {
                        type: "chips",
                        options: [
                            {
                                text: "Dog",
                                link: "https://en.wikipedia.org/wiki/Dog",
                            },
                            {
                                text: "Cat",
                                link: "https://en.wikipedia.org/wiki/Cat",
                            },
                            {
                                text: "Rabbit",
                                link: "https://en.wikipedia.org/wiki/Rabbit",
                            },
                        ],
                    },
                ],
            ],
        };
        // Para enviar respuestas enriquecidas (chips, listas, imagenes, acordion)
        agent.add(
            new Payload(agent.UNSPECIFIED, payload, {rawPayload: true, sendAsMessage: true,})
        );
    }

    // funcion por si no entiende los inputs
    function fallback(agent) {
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }

    function horarioAcordeon(agent){
        const codigoAlumno = agent.parameters.number; // sacamos el codigo del estudiante
        agent.add("Horario del estudiante con codigo " + codigoAlumno + ":");
        console.log("estamos dentro del intent HorariosMateriasCodigo");
        return axios.get(`https://campusvirtual.upb.edu/oficinas-virtuales/get_horario.php?codigo=${codigoAlumno}`)
        //return axios.get("https://campusvirtual.upb.edu/oficinas-virtuales/get_horario.php?codigo=456456")
        .then((result) => { //"Docente: " + horarioObj.materias.Docente + "<br>Aula: A-5 <br>Fecha Inicio: "+ horarioObj.materias.Fecha_inicio +"<br>Fecha Fin: " + ,
            result.data.materias.foreach(mat => {
                console.log(mat.nombre);
            });
            // result.data.map(m1 => {
                

            //     console.log("consultamos horario")
            //     const payload = {
            //         richContent: [
            //           [
            //             {
            //               subtitle: horarioObj.materias.map(materia => materia.Horario),
            //               title: horarioObj.materias.map(materia => materia.nombre),
            //               text: horarioObj.materias.map(materia => materia.Docente),
            //               type: "accordion"
            //             }
            //           ]
            //         ]
            //       };
            //     agent.add(
            //         new Payload(agent.UNSPECIFIED, payload, {rawPayload: true, sendAsMessage: true})
            //     );  
                //agent.add(horarioObj.word); 
                //agent.add(wordObj.numSyllables); 
            //}); 
        });
        // codigo: 456456

        // ejemplo hardcodeado para las materias
        
        // const payload = {
        //     richContent: [
        //       [
        //         {
        //           subtitle: "B: 10:00 - 12:00",
        //           title: "Matematicas para Ingenieria I",
        //           text: "Docente: A <br>Aula: A-5 <br>Fecha Inicio: 14/05 <br>Fecha Fin: 14/06",
        //           type: "accordion"
        //         },
        //         {
        //           text: "Docente: B <br>Aula: Laboratorios A-17 <br>Fecha Inicio: 14/05 <br>Fecha Fin: 14/06",
        //           subtitle: "C: 12:15 - 14:15",
        //           title: "Programacion I",
        //           type: "accordion"
        //         },
        //         {
        //           text: "Docente: C <br>Aula: A-1 <br>Fecha Inicio: 15/06 <br>Fecha Fin: 15/07",
        //           type: "accordion",
        //           subtitle: "C: 12:15 - 14:15",
        //           title: "Algebra Lineal"
        //         },
        //         {
        //           type: "accordion",
        //           title: "Arquitectura de Computadoras",
        //           text: "Docente: D <br>Aula: Laboratorios A-17 <br>Fecha Inicio: 15/06 <br>Fecha Fin: 15/07",
        //           subtitle: "B: 10:00 - 12:00"
        //         }
        //       ]
        //     ]
        //   };
        //   agent.add(
        //     new Payload(agent.UNSPECIFIED, payload, {rawPayload: true, sendAsMessage: true})
        //   );  
    }

    // ejemplo de las rimas para consultar un servicio
    function rhymingWordHandler(agent){
        const word = agent.parameters.any; // en Actions en Parameters del dialogflow, el nombre del parametro es "any"
        agent.add(`Este es el agente de rimas!`);
        console.log("Este es el agente de rimas!");
        agent.add(`Las palabras que riman con  ${word}  son:`);
        return axios.get(`https://api.datamuse.com/words?rel_rhy=${word}`) // servicio consultado (devuelve rimas con la palabra "${word}")
        //return axios.get("https://api.datamuse.com/words?rel_rhy=pet")
        .then((result) => {
            result.data.map(wordObj => {
                //agent.add(`${wordObj.word}, score ${wordObj.score}`); 
                //agent.add("p: "+wordObj.word + ", score: "+wordObj.score); 
                agent.add(wordObj.word + ", score: " + wordObj.score);
            });
        });
      }

      function pet(agent){ // este intent ejemplo se llama escribiendole 'mypet' al bot
        agent.add(`which one u want`);
        const payload = {
          richContent:[
            [
              {
                type:"chips",
                options:[
                  {
                    text:"Dog",
                    link : "https://en.wikipedia.org/wiki/Dog"
                  },
                  {
                    text:"Cat",
                    link:"https://en.wikipedia.org/wiki/Cat"
                  },
                  {
                  text:"Rabbit",
                  link : "https://en.wikipedia.org/wiki/Rabbit"
                  }
                ]
              }
            ]
          ]
         
        };
        agent.add(new Payload(agent.UNSPECIFIED, payload, {rawPayload: true, sendAsMessage: true}));
        return payload;
      }
    
    function turnitinConsulta(agent){
        agent.add("Aqui hay algunos videos que te pueden ayudar:");
        const payload = {
            richContent: [
                [
                    {
                        type: "chips",
                        options: [
                            {
                                text: "Subir documento a Turnitin:",
                                link: "https://youtu.be/vHAIuj1Sog4?t=70"
                            }
                        ]
                    }
                ]
            ]
        };
        // 
        agent.add(
            new Payload(agent.UNSPECIFIED, payload, {rawPayload: true, sendAsMessage: true})
          ); 
    }
    function tareaConsulta(agent){
        agent.add("Aqui hay algunos videos que te pueden ayudar:");
        const payload = {
            richContent: [
                [
                    {
                        type: "chips",
                        options: [
                            {
                                text: "Subir tarea:",
                                link: "https://youtu.be/Xi5fJYEtCV8?t=35"
                            },
                            {
                                text: "Subir tarea 2:",
                                link: "https://youtu.be/iQ1Nr-Wwcjc?t=9"
                            }
                        ]
                    }
                ]
            ]
        };
        // 
        agent.add(
            new Payload(agent.UNSPECIFIED, payload, {rawPayload: true, sendAsMessage: true})
          ); 
    }

    // function ingresoConsulta(agent){

    //     agent.add(
    //         new Payload(agent.UNSPECIFIED, payload, {rawPayload: true, sendAsMessage: true})
    //       ); 
    // }

    //////////////////////////////////////////////
    // parte para settear y enviar las funciones a los intents en dialog flow
    let intentMap = new Map();
    intentMap.set("Saludo", Welcome); // como el default welcome intent, en el nuestro lo cambiamos a: Saludo
    intentMap.set("Default Fallback Intent", fallback);

    //intentMap.set("Rhymes", rhymingWordHandler);
    intentMap.set("Rhymes", rhymingWordHandler); // handler de rimas del ejemplo

    // horarios
    intentMap.set("HorariosMateriasCodigo", horarioAcordeon);
    intentMap.set("consultaSubirTarea", tareaConsulta); // consulta tarea
    intentMap.set("consultaSubirTurnitin", turnitinConsulta); // consulta turnitin

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
