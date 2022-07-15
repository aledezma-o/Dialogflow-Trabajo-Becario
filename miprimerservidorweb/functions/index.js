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

    function Welcome(agent) { // ejemplo para sacar datos de la table Estudiantes


        
        const estudiante = db.collection("Estudiantes");
        const idEstudiante = "kw6A8oA3tQOtlAx8XKpx"; // id del estudiante
        //
        return estudiante.doc(idEstudiante).get().then((snapshot) => {
            //agent.add(`Codigo: ${snapshot.id}`); // id del objeto en firebase
            agent.add(`Codigo: ${snapshot.data().Codigo}`);
            agent.add(`Nombre: ${snapshot.data().Nombre}`);
            agent.add(message);
        }).catch(() => {
            agent.add('Puedes seleccionar otro estudiante');
        });
        //
        //agent.add(`Welcome to my agent!`);
    }

    function fallback(agent) {
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }

    let intentMap = new Map();
    intentMap.set("Saludo", Welcome); // como el default welcome intent, en el nuestro lo cambiamos a: Saludo
    intentMap.set("Default Fallback Intent", fallback);
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
