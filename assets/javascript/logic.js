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
                var trainNextArrival = $("<td>").text(""); 
                var trainMinsAway    = $("<td>").text(""); 

                // var monthsWorked = moment().diff( moment( snapshot.val().empStartDate,"MM/DD/YYYY" ), 'months'); 
                //Append the <td>'s to the <tr>
                tr.append(trainNumber).append(trainName).append(trainDestination).append(trainFrequency).append(trainNextArrival).append(trainMinsAway);
                //Append the row to the <tbody>
                $("#train-tbody").append(tr);
            }
        }); 

        ///////////////////////////////////////////////////////////////////////
        // Whenever a user clicks the "Submit" button in the form
        $("#submit-train").on("click", function(event) {
          event.preventDefault();
          //Create the object to be pushed to the DB
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
                
                //Area was collapsed and has been expanded.  Change icon to "-" 
                $("#link-text-icon").removeClass("fa-minus-square");
                $("#link-text-icon").addClass("fa-plus-square");
            }
            else if ( $(this).attr("aria-expanded") === "false") {
                
                //Area was expanded and has been collapsed.  Change icon to "+" 
                $("#link-text-icon").removeClass("fa-plus-square");
                $("#link-text-icon").addClass("fa-minus-square");
            }
        });

        console.log( "ready!" );

    });