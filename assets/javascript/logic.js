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



        // At the page load and subsequent value changes, get a snapshot of the local data.
        // This callback allows the page to stay updated with the values in firebase node "trains"
        database.ref("/trains").on("value", function(snapshot) {
        
            // Print the local data to the console.
        console.log(snapshot.val());

        }); 



        // Whenever a user clicks the "Submit" button in the form
        $("#submit-train").on("click", function(event) {

            event.preventDefault();
        
            // Get the input values
            var trainNumber      = $("#trainNumber").val().trim();
            var trainName        = $("#trainName").val().trim();
            var trainDestination = $("#trainDestination").val().trim();
            var trainFirstTime   = $("#trainFirstTime").val().trim();
            var trainFrequency   = $("#trainFrequency").val().trim();
        
            // Log the Bidder and Price (Even if not the highest)
            console.log ("train number = " + trainNumber + ", train name = " + trainName  + ",destination " 
            +  trainDestination + ", first time = "  + trainFirstTime + ", frequency = "  + trainFrequency ); 
        
            // Save the new price in Firebase
            //   database.ref("/bidderData").set({
            //     highBidder: bidderName,
            //     highPrice: bidderPrice
            //   });
        
            // Add the train to the /trains collection. 

        });


  console.log( "ready!" );
});