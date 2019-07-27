        // Globals
        var signInButton  = document.getElementById('sign-in-button');
        var signOutButton = document.getElementById('sign-out-button');
        var splashPage    = document.getElementById('page-splash');

        //Firebase RT Database configuration object.
        var config = {
            apiKey: "AIzaSyCDw43NH-kOZIBGwoYo7R8OxYVVBTEQ0Pc",
            authDomain: "jrr-proj-firebase.firebaseapp.com",
            databaseURL: "https://jrr-proj-firebase.firebaseio.com",
            projectId: "jrr-proj-firebase",
            storageBucket: "",
            messagingSenderId: "481457808049",
            appId: "1:481457808049:web:9f8561538539db74"
        };

        // Assign the reference to the database to a variable named 'database'
        var database = firebase.database();

        console.log ("Database inited");

        // trainsRef references a specific location in our database.
        // All of our connections will be stored in this directory.
        var trainsRef = database.ref("/trains");

 
        ///////////////////////////////////////////////////////////////////////
        // At the page load and subsequent value changes, get a snapshot of the local data.
        // This callback allows the page to stay updated with the values in firebase node "trains"
        // It gets triggered on page load and every time a new child node is added to the collection.
        database.ref("/trains").on("child_added", function(snapshot) {

            console.log("child_added event received.");

            if (snapshot.val() !== null) {
                //Create the row element for the trains table
                var tr = $("<tr>"); 
                tr.attr("data-rowkey", snapshot.key); 
                
                //Create a <td> element for each data field from the snapshot
                var trainNumber      = $("<td>").text(snapshot.val().trainNumber);
                trainNumber.attr("data-name", "trainNumber");
                
                //Create the table cells elements. 
                var trainName        = $("<td>").text(snapshot.val().trainName); 
                trainName.attr("data-name", "trainName");
                $(trainName).dblclick(makeEditable); 
                
                var trainDestination = $("<td>").text(snapshot.val().trainDestination); 
                trainDestination.attr("data-name", "trainDestination");
                $(trainDestination).dblclick(makeEditable); 
                
                var trainFirstTime   = $("<td>").text(snapshot.val().trainFirstTime);
                trainFirstTime.attr("data-name", "trainFirstTime");

                var trainFrequency   = $("<td>").text(snapshot.val().trainFrequency);
                trainFrequency.attr("data-name", "trainFrequency");
                
                var minsToArrival    = minutesToArrival(snapshot.val().trainFirstTime, snapshot.val().trainFrequency); 

                var trainMinsAway    = $("<td>").text(minsToArrival); 
                trainMinsAway.attr("data-name", "trainMinsAway"); 

                var nextArrival      = arrivalTime(minsToArrival);
                var trainNextArrival = (minsToArrival <= 1) ? $("<td>").text("Arriving") : $("<td>").text(arrivalTime(minsToArrival));
                trainNextArrival.attr("data-name", "trainNextArrival");

                //Append the <td>'s to the <tr>
                tr.append(trainNumber)
                .append(trainName)
                .append(trainDestination)
                .append(trainFirstTime)
                .append(trainFrequency)
                .append(trainNextArrival)
                .append(trainMinsAway);
                
                //Append the row to the <tbody>
                $("#train-tbody").append(tr);
                
                //Clear the details form
                $( '#add-train-form' ).each(function(){
                    this.reset();
                });

                //Enable the computed values (Mins to Arrival, Next Arrival Time) refresh after 30 seconds.
                //This will re-submit itself every 30 seconds.
                setTimeout(refreshTrainTable, 30000) ;
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

        //  console.log ("train number = " + newTrain.trainNumber + ", train name = " + newTrain.trainName  + ",destination " 
        //   +  newTrain.trainDestination + ", first time = "  + newTrain.trainFirstTime + ", frequency = "  + newTrain.trainFrequency ); 
        
        // Save the new Train in Firebase
          database.ref("/trains").push(newTrain); 
        });

        ///////////////////////////////////////////////////////////////////////////////
        // Changes the icon in the button every time the button is clicked
        // between "+" and "-"
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

        //Computes the minutes until the next arrival time, based on the
        //train's initial time (start time). 
        function minutesToArrival ( trainFirstTime , trainFrequency ) {

            //Given values for the train's first time and frequency,
            //return the minutes until next arrival.
            // trainFirstTime = a string in "HH:mm" format.
            // trainFrequency = an integer > 0
            //---------------------------------------------------------
            
            // First Time (pushed back 1 year to make sure it comes before current time)
            var firstTimeConverted = moment(trainFirstTime, "HH:mm").subtract(1, "years");
            
            // Current Time
            var currentTime = moment();
            
            // Difference between the times
            var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
           
            // Time apart (remainder)
            var tRemainder = diffTime % trainFrequency;

            // Minute Until Train
            var tMinutesTillTrain = trainFrequency - tRemainder;

            return tMinutesTillTrain; 
        }

        //Return the time for the next arrival. 
        function arrivalTime ( minutesToArrival) {

            //Given the minutes to arrival, return the arrival time in HH:mm format
             return ( moment().add(minutesToArrival, "minutes").format("HH:mm") ) ;
        }

        //Refreshes the clock
        function displayClock () {
            //Updates the <div> element with the current time
            $("#rt-clock").text( moment().format("HH:mm:ss") ) ; 
            setTimeout(displayClock, 500)
        }

        //Refreshes the dynamic values in the table (Mins to Arrival and Next Train Arrival Time)
        function refreshTrainTable() {
            trainsRef.once('value', function(snapshot) {
                console.log ("value event received.");
                snapshot.forEach( function(childSnapshot) {

                    //For each row in the table (childSnapshot):
                    // 1) compute the minsToArrival and nextArrival times.
                    // 2) Match the table row with rowkey attribute = childSnapshot.key
                    //    and update the computed values (minsToArrival and nextArrival)

                    var minsToArrival    = minutesToArrival(childSnapshot.val().trainFirstTime, childSnapshot.val().trainFrequency); 
                    var nextArrival      = arrivalTime(minsToArrival); 
                    
                    var rowKey = childSnapshot.key; 
                    $('tr[data-rowkey="' + rowKey + '"] td[data-name="trainMinsAway"]').text(minsToArrival);
                    $('tr[data-rowkey="' + rowKey + '"] td[data-name="trainNextArrival"]')
                      .text( (minsToArrival <= 1) ? "Arriving" : nextArrival );
                   
               });
            });
            setTimeout(refreshTrainTable, 30000) ;
        }

        //Update the row in the database with the matching key.
        function updateRow(rowKey) {
          //Updates the train in the database whose key matches the rowKey passed. 
          //First create the object to be sent to the update() method:
          var rowObject = {}; 
          $( "tr[data-rowkey='" + rowKey + "']" ).children( "td" ).each( function() {
            console.log( this );
            rowObject[$(this).attr("data-name")] = $(this).text().trim(); 
            });

          //Then create an update{} object and send it to the update() method.
          var updateObject = {};
          updateObject[rowKey] = rowObject;
          trainsRef.update(updateObject, function(error) {
            if(error) {
              console.log("Error occurred while updating database:" + error);
            }
           }); 
        }

        //Change a <td> element to editable by inserting an <input> element when
        //the user double-clicks the <td>.  When focus is lost, restore the old value.
        //If <Enter> is pressed, change the value and send the change to the database. 

        function makeEditable(event) { 
            tableCell = $(this);
            //Prevent double click inside <input> element. 
            if ( tableCell.hasClass("cellEditing") ) {
                return;
            }
            var OriginalContent = tableCell.text();
            var columnName      = tableCell.attr("data-name"); 
    
            tableCell.addClass("cellEditing");
            tableCell.html("<input type='text' value='"  + OriginalContent + "'/>");
            tableCell.children().first().focus();
    
            //Handle keypresses in first child of <td> element (the added <input> element).
            tableCell.children().first().keypress(function (e) {
                if (e.which == 13) {
                    var newContent = tableCell.children().first().val();
                    tableCell.text(newContent);   //Set text of the <td> element.
                    tableCell.removeClass("cellEditing"); //Remove editing class
                    tableCell.removeAttr("class"); 
                    updateRow($(tableCell).parent().attr("data-rowkey")); 
                }
            });
    
            //Event handler for when focus is lost
            tableCell.children().first().blur( function() {
                tableCell.text(OriginalContent);
                tableCell.removeClass("cellEditing");
                tableCell.removeAttr("class"); 
            });
      };


        //
        // The ID of the currently signed-in User. We keep track of this to detect Auth state change events that are just
        // programmatic token refresh but not a User status change.
        //
        var currentUID;
        
    window.addEventListener('load', function() {

        ///
        /// Triggers every time there is a change in the Firebase auth state (i.e. user signed-in or user signed out).
        ///
        function onAuthStateChanged(user) {
            // We ignore token refresh events.
            if (user && currentUID === user.uid) {
            return;
            }

            //cleanupUi();
            if (user) {
            currentUID = user.uid;
            splashPage.style.display = 'none';
            } else {
            // Set currentUID to null.
            currentUID = null;
            // Display the splash page where you can sign-in.
            splashPage.style.display = '';
            }
        }

        // Bind Sign in button.
        signInButton.addEventListener('click', function() {
          var provider = new firebase.auth.GoogleAuthProvider();
          firebase.auth().signInWithPopup(provider);
        });

        // Bind Sign out button.
          signOutButton.addEventListener('click', function() {
          firebase.auth().signOut();
        });
        
        // Listen for auth state changes
        firebase.auth().onAuthStateChanged(onAuthStateChanged);

        displayClock();

        console.log( "ready!" );

    });