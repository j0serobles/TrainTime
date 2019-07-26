# Firebase Assignment - Train Scheduler

### Overview

TrainTime is a train schedule application that incorporates Firebase to host arrival and departure data.
The app retrieves and manipulates this information with Moment.js. 
This website will provide up-to-date information about various trains, namely their arrival times and how many minutes remain until they arrive at their station.

- - -

### Setup

Directory Structure:
```
─── TrainTime  (project root directory)
   ├── .firebase  (firebase stuff)
   ├── .git       (git stuff)
   ├── functions  (more firebase stuff)
   |      └── (node_modules) (node.js modules needed for deployment to firebase)
   └── public     (actual app artifacts)
         ├── assets
         |      └── css
         |      |    └── styling.css (css stylesheet)
         |      └── javascript
         |             └── logic.js (main program logic)
         ├── external
         |      └── jqueryui (needed for JQuery UI)
         ├── index.html (main html page)
         └── README.md  (this file)
```
The app uses HTML , Javascript , CSS, Jquery, JqueryUI, Firebase RT Database and some node.js modules needed for deployment to Google Firebase. 

### Application Use:

* The user must log in to the app by using their Google credentials.
* The user must click on the "Add Train" button to expand the train details area to input the train information . 
  
  * When adding trains, administrators will be able to submit the following:
    
    * Train Name
    
    * Destination 
    
    * First Train Time -- in military time
    
    * Frequency -- in minutes
  
  * Code this app to calculate when the next train will arrive; this should be relative to the current time.
  
  * Users from many different machines must be able to view same train times.
  
  * Styling and theme are completely up to you. Get Creative!

### Example Site

![train homework](Train_Time_Image.png)

