window.addEventListener('dfMessengerLoaded', function(event){
    console.log("Chatbot cargando e inicializando" + event);

    const dfMessenger = document.querySelector('df-messenger');
    //dfMessenger.renderCustomText('Que tal, buenos dias!');
    
    // evento que te dice cuando se da click a un chip
    dfMessenger.addEventListener('df-chip-clicked', function (event) {
        console.log("df-chip-clicked: " + event.detail.query)
    });

    // ejemplo de eventos en dialogflowMessenger
    dfMessenger.addEventListener('df-user-input-entered', function (event) {
        if (Number.isInteger(parseInt(event.detail.input)))
            if(parseInt(event.detail.input) > 10000 && parseInt(event.detail.input) < 600000)
                console.log("se ingreso un codigo de estudiante");
                //dfMessenger.renderCustomText('Su codigo es: ' + event.detail.input + " y sus materias son: ");
    });
});