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
    var trains = [{name: "Trenton Express", destination: "Trenton", firstTrainTime: "201710310330", frequency: 25},
                {name: "Oregon Trail", destination: "Salem, Oregon", firstTrainTime: "201708310115", frequency: 3600},
                {name: "Midnight Carriage", destination: "Philadelphia", firstTrainTime: "201707260445", frequency: 15}];
    
    var firstTime = true;
    
    
    function renderTrains () {
        $('tbody').empty();
        
        for (var i=0; i < trains.length; i++) {
            // Make table row tag and 2 column tags
            var row = $("<tr>");
            var td1 = $("<td>").text(trains[i].name);
            var td2 = $("<td>").text(trains[i].destination);

            // Calculate "Minutes Away" and "Next Arrival"
            var tFrequency = trains[i].frequency;
            var firstTT = moment(trains[i].firstTrainTime, "YYYYMMDDHHmm");
            var diffTime = moment().diff(moment(firstTT), "minutes");
            var tRemainder = diffTime % tFrequency;
            // Minutes Away
            var tMinutesTillTrain = tFrequency - tRemainder;
            // Next Arrival
            var nextTrain = moment().add(tMinutesTillTrain, "minutes");

            // Finish column tags and add class names
            var td3 = $("<td>").text(tFrequency);
            var td4 = $("<td>").text((nextTrain.format("MM/DD/YYYY HH:mm")));
            td4.addClass("nxtTrain" + i);
            var td5 = $("<td>").text(tMinutesTillTrain);
            td5.addClass("minTillNxt" + i);

            // Append table columns to table row, and append row to table body
            row.append(td1).append(td2).append(td3).append(td4).append(td5);
            $("tbody").append(row);

            // Note:  Comment this code after running the first time - Seed the Database

            if (firstTime) {
                // Creates local "temporary" object for holding train data
                const existingTrain = {
                    name: trains[i].name,
                    destination: trains[i].destination,
                    firstTrainTime: trains[i].firstTrainTime,
                    frequency: trains[i].frequency
                };

                // Uploads employee data to the database
                database.ref().push(existingTrain);

                // Logs everything to console (as an object)
                console.log("existingTrain = " + JSON.stringify(existingTrain));
            }
        }
    }

    renderTrains();
    firstTime = false;
    console.log("firstTime = " + firstTime);
    alert("Database has now been 'seeded'.");


});
    