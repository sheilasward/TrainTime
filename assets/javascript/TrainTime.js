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

    // Initialize DateTimePicker
    $('#picker').dateTimePicker(); 


    // Define variable for Firebase Database
    var database = firebase.database(); 

    // Define Array of Trains
    var trains = [];
    
    // Populate Array of Trains with data from Firebase
    database.ref().on('child_added', function (e){
        var train = e.val();
        trains.push(train);
        renderTrains();
    });

    function renderTrains () {
        // Empty Current Train Schedule
        $('tbody').empty();
        // Generate row of trains for each one in array
        for (var i=0; i < trains.length; i++) {
            // Make table row tag and 2 column tags
            var row = $("<tr />");
            var tName = trains[i].name;
            console.log("train name = " + tName);
            var td1 = $("<td>");
            td1.text(tName);
            td1.addClass("left-padding");
            var span1 = $("<span>");
            var i1 = $("<i>");           
            i1.addClass("fa fa-trash-o");
            span1.prepend(i1);
            td1.prepend(span1);
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
            td4.addClass("nxtTrain" + i);  // Need to add 'i' in order to adjust time of next train
            var td5 = $("<td>").text(tMinutesTillTrain);
            td5.addClass("minTillNxt" + i);  // Need to add 'i' in order to adjust minutes
            // Append table columns to table row, and append row to table body
            row.append(td1).append(td2).append(td3).append(td4).append(td5);
            $('tbody').append(row);
        }
    }

    // Procedure for when new train is added, and "Submit" button is clicked
    $('#formSubmit').on('click', function(e){
        e.preventDefault();
        // Get values from text-boxes
        name = $("#trainName").val();
        destination = $("#destination").val();
        firstTrainTime = $("#firstTrainTime").val();
        frequency = $("#frequency").val();
        // Create newTrain object
        const newTrain = {
            name: name,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: parseInt(frequency)
        };
        // Uploads new train object to the database
        // Note:  newTrain object will be added to array with "on Child Added" code
        database.ref().push(newTrain);
        // Reload train report
        renderTrains();
        // Clear values from text-boxes
        $("#train-form").get(0).reset();
    });

    // Procedure for when train is deleted
    // Click on trash can to delete table row
    $("tbody").on("click", "span",function(e) {
        $(this).parent().parent().fadeOut(500, function() {
            $(this).remove;
        });
        e.stopPropagation();
        // Now delete train from database
        //var train = $(this).name();
        //console.log("before: " + trains);
        //trains.pop(train);
        //console.log("after: " + trains);
    });

    // Every minute, change the time and update "Minutes Away" column
    // If any train "arrives", change data on "Next Arrival"
    function updateTime(){
        var now = moment().format('HH:mm');
        $('#curr-time').html( "Current time is: " + now);
        for (var i=0; i < trains.length; i++) {
            var tFrequency = trains[i].frequency;
            var firstTT = moment(trains[i].firstTrainTime, "YYYYMMDDHHmm"); 
            var diffTime = moment().diff(moment(firstTT), "minutes");
            var tRemainder = diffTime % tFrequency;
            var tMinutesTillTrain = tFrequency - tRemainder;
            if (tMinutesTillTrain == tFrequency) {
                $(".minTillNxt" + i).text(tFrequency);
                var nextTrain = moment().add(tFrequency, "minutes");
                $(".nxtTrain" + i).text((nextTrain.format("MM/DD/YYYY HH:mm")));
            }
            else {
                $(".minTillNxt" + i).text(tMinutesTillTrain);
            }
        }
    }

    updateTime();
    setInterval(function(){
        updateTime();
        },60000);
});    