$(document).ready(function() {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyA9sMD7OyR7KtCNraSMYjWU_fHCo2TDp7M",
        authDomain: "traintime-c93bf.firebaseapp.com",
        databaseURL: "https://traintime-c93bf.firebaseio.com",
        projectId: "traintime-c93bf",
        storageBucket: "traintime-c93bf.appspot.com",
        messagingSenderId: "542478315828"
    };
    firebase.initializeApp(config);

    // Define variable for Firebase Database
    var database = firebase.database(); 

    // Define Array of Trains running at the beginning
    var trains = [{name: "Trenton Express", destination: "Trenton", frequency: 25, arrival: "17:35"},
                {name: "Oregon Trail", destination: "Salem, Oregon", frequency: 3600, arrival: "13:39"},
                {name: "Midnight Carriage", destination: "Philadelphia", frequency: 15, arrival: "17:35"}];
    
    // Define variables for train information
    var name = "";
    var destination = "";
    var firstTrainTime = "";
    var frequency = "";

    // Procedure for when new train is added, and "Submit" button is clicked
    $('#formSubmit').on('click', function(e){
        e.preventDefault();
        console.log('clicked');
        console.log($('#trainName').val());

        // Grabbed values from text-boxes
        name = $("#trainName").val();
        destination = $("#destination").val();
        firstTrainTime = $("#firstTrainTime").val();
        frequency = $("#frequency").val();

        database.ref().push({
            name: $('[id=trainName]').val(),
            destination: $('[id="destination"]').val(),
            firstTrainTime: $('[id="firstTrainTime"]').val(),
            frequency: $('[id="frequency"]').val()
        });
    });

    document.querySelectorAll('.form-control').innerHTML = '';

    database.ref().on('child_added', function (e){
        var train = e.val();
        trains.push(train);
        renderTrains();
    });

    function renderTrains () {
        $('tbody').empty();
        
        for (var i=0; i < trains.length; i++) {
            var row = $("<tr>");
            var td1 = $("<td>").text(trains[i].name);
            var td2 = $("<td>").text(trains[i].destination);
            
            // var stDate = employees[i].startDate;
            // var dateFormat = "MM/DD/YYYY";
            // var convDate = moment(stDate, dateFormat);
            var td3 = $("<td>").text(trains[i].frequency);
            var td4 = $("<td>").text(trains[i].arrival);
            var x = trains[i].arrival;
            // var mthsWorked = moment().diff(moment(convDate), "months");
            var nxtArrival = moment(x).format("HH:mm");
            var now = moment().format("HH:mm");


            console.log("nxtArrival = " + nxtArrival);
            console.log("now = " + now);
            // var before = moment('2017.02.12 09:00','YYYY.MM.DD HH:mm');
            console.log("now - nxtArrival = " + moment().diff(moment(nxtArrival), "HH:mm"));

            row.append(td1).append(td2).append(td3).append(td4);
            $("tbody").append(row);
        }
    }


    function updateTime(){
        var now = moment().format('HH:mm');
        $('#curr-time').html( "Current time is: " + now);
    }

    updateTime();
    setInterval(function(){
        updateTime();
        },1000);
    renderTrains();
});
    