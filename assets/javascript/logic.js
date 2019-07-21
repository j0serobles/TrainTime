$( document ).ready(function() {

        var config = {
            apiKey: "AIzaSyCDw43NH-kOZIBGwoYo7R8OxYVVBTEQ0Pc",
            authDomain: "jrr-proj-firebase.firebaseapp.com",
            databaseURL: "https://jrr-proj-firebase.firebaseio.com",
            projectId: "jrr-proj-firebase",
            storageBucket: "",
            messagingSenderId: "481457808049",
            appId: "1:481457808049:web:9f8561538539db74"
        };

        firebase.initializeApp(config);

        // Assign the reference to the database to a variable named 'database'
        var database = firebase.database();

        console.log ("Database inited");

        // trainsRef references a specific location in our database.
        // All of our connections will be stored in this directory.
        var trainsRef = database.ref("/trains");

 
        ///////////////////////////////////////////////////////////////////////
        // At the page load and subsequent value changes, get a snapshot of the local data.
        // This callback allows the page to stay updated with the values in firebase node "trains"
        database.ref("/trains").on("child_added", function(snapshot) {
            // Print the local data to the console.  Will print NULL the first time.
            console.log("child_added event received: Snapshot:" + snapshot.val());

            if (snapshot.val() !== null) {
                console.log("child_added event received: Snapshot:" + JSON.stringify(snapshot.val()));
                console.log("train name is:" + snapshot.val().trainName );
                //Create the row element for the trains table
                var tr = $("<tr>"); 
                //Create a <td> element for each data field from the snapshot
                var trainNumber      = $("<td>").text(snapshot.val().trainNumber); 
                var trainName        = $("<td>").text(snapshot.val().trainName); 
                var trainDestination = $("<td>").text(snapshot.val().trainDestination); 
                var trainFirstTime   = $("<td>").text(snapshot.val().trainFirstTime);
                var trainFrequency   = $("<td>").text(snapshot.val().trainFrequency);
                var minsToArrival    = minutesToArrival(snapshot.val().trainFirstTime, snapshot.val().trainFrequency); 
                var trainMinsAway    = $("<td>").text(minsToArrival); 
                var nextArrival      = arrivalTime(minsToArrival); 
                
                var trainNextArrival = (minsToArrival <= 1) ? $("<td>").text("Arriving") : $("<td>").text(arrivalTime(minsToArrival));
                // var trainNextArrival = $("<td>").text(arrivalTime(minsToArrival));

                // var monthsWorked = moment().diff( moment( snapshot.val().empStartDate,"MM/DD/YYYY" ), 'months'); 
                //Append the <td>'s to the <tr>
                tr.append(trainNumber).append(trainName).append(trainDestination).append(trainFrequency).append(trainNextArrival).append(trainMinsAway);
                //Append the row to the <tbody>
                $("#train-tbody").append(tr);
                //Clear the form
                $( '#add-train-form' ).each(function(){
                    this.reset();
                });
            }
        }); 

        ///////////////////////////////////////////////////////////////////////
        // Whenever a user clicks the "Submit" button in the form
        $("#submit-train").on("click", function(event) {
          event.preventDefault();
          //Create the object to be pushed to the DB.

          var newTrain = {
              trainNumber      : $("#trainNumber").val().trim(),
              trainName        : $("#trainName").val().trim(),
              trainDestination : $("#trainDestination").val().trim(),
              trainFirstTime   : $("#trainFirstTime").val().trim(),
              trainFrequency   : $("#trainFrequency").val().trim()
          }
          // Log the Bidder and Price (Even if not the highest)
          console.log ("train number = " + newTrain.trainNumber + ", train name = " + newTrain.trainName  + ",destination " 
          +  newTrain.trainDestination + ", first time = "  + newTrain.trainFirstTime + ", frequency = "  + newTrain.trainFrequency ); 
          // Save the new Train in Firebase
          database.ref("/trains").push(newTrain); 
        });

        ///////////////////////////////////////////////////////////////////////////////
        $("#details-collapse-button").on("click", function() {
            
            if ( $(this).attr("aria-expanded") === "true") {
                
                //Train detail area was collapsed and has been expanded.  Change icon to "-" 
                $("#link-text-icon").removeClass("fa-minus-square");
                $("#link-text-icon").addClass("fa-plus-square");
            }
            else if ( $(this).attr("aria-expanded") === "false") {
                
                //Train detail area was expanded and has been collapsed.  Change icon to "+" 
                $("#link-text-icon").removeClass("fa-plus-square");
                $("#link-text-icon").addClass("fa-minus-square");
            }
        });

        function minutesToArrival ( trainFirstTime , trainFrequency ) {

            //Given values for the train's first time and frequency,
            //return the minutes until next arrival.
            // trainFirstTime = a string in "HH:mm" format.
            // trainFrequency = an integer > 0
            //---------------------------------------------------------
            
            // First Time (pushed back 1 year to make sure it comes before current time)
            var firstTimeConverted = moment(trainFirstTime, "HH:mm").subtract(1, "years");
            console.log("First Time: " + trainFirstTime + ", First time converted: " + firstTimeConverted);

            // Current Time
            var currentTime = moment();
            console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

            // Difference between the times
            var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
            console.log("DIFFERENCE IN TIME: " + diffTime);

            // Time apart (remainder)
            var tRemainder = diffTime % trainFrequency;
            console.log("Remainder: " + tRemainder);

            // Minute Until Train
            var tMinutesTillTrain = trainFrequency - tRemainder;
            console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

            return tMinutesTillTrain; 

            // // Next Train
            // var nextTrain = moment().add(tMinutesTillTrain, "minutes");
            // console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
            //
        }

        function arrivalTime ( minutesToArrival) {

            //Given the minutes to arrival, return the arrival time in HH:mm format
             return ( moment().add(minutesToArrival, "minutes").format("HH:mm") ) ;

        }

        function displayClock () {
            //Updates the <div> element with the current time
            $("#rt-clock").text( moment().format("HH:mm:ss") ) ; 
            setTimeout(displayClock, 500)
        }

        function refreshTrainTable() {
            //Retrieve the entire list of trains from the databas and refresh the HTML table
            trainsRef.once('value', function(snapshot) {
                $("#train-tbody").empty();
                snapshot.forEach( function(childSnapshot) {
                    
                    //Create the row element for the trains table
                    var tr = $("<tr>"); 
                    //Create a <td> element for each data field from the snapshot
                    var trainNumber      = $("<td>").text(childSnapshot.val().trainNumber); 
                    var trainName        = $("<td>").text(childSnapshot.val().trainName); 
                    var trainDestination = $("<td>").text(childSnapshot.val().trainDestination); 
                    var trainFirstTime   = $("<td>").text(childSnapshot.val().trainFirstTime);
                    var trainFrequency   = $("<td>").text(childSnapshot.val().trainFrequency);
                    var minsToArrival    = minutesToArrival(childSnapshot.val().trainFirstTime, childSnapshot.val().trainFrequency); 
                    var trainMinsAway    = $("<td>").text(minsToArrival); 
                    var nextArrival      = arrivalTime(minsToArrival); 
                    
                    var trainNextArrival = (minsToArrival <= 1) ? $("<td>").text("Arriving") : $("<td>").text(arrivalTime(minsToArrival));
                    // var trainNextArrival = $("<td>").text(arrivalTime(minsToArrival));

                    // var monthsWorked = moment().diff( moment( snapshot.val().empStartDate,"MM/DD/YYYY" ), 'months'); 
                    //Append the <td>'s to the <tr>
                    tr.append(trainNumber).append(trainName).append(trainDestination).append(trainFrequency).append(trainNextArrival).append(trainMinsAway);
                    //Append the row to the <tbody>
                    $("#train-tbody").append(tr);
               });
            });
            setTimeout(refreshTrainTable, 30000) ;

        }

        displayClock();
        refreshTrainTable();
        console.log( "ready!" );

    });