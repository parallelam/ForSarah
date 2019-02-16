// Set MapQuest information to variables for future concatenation:
var mqApiKey = '?key=ZzaGO8COL1AF8qgAd3D4cjIUfXsjKtYC';
var mqBaseURL = 'http://www.mapquestapi.com/directions/v2/route' // &from=  

// Initialize Firebase and establish database variable:
var config = {
  apiKey: "AIzaSyBG8qfXJJ8Oe9VZEWm9C7yNpB531ofFr5Q",
  authDomain: "forsarah-96dfe.firebaseapp.com",
  databaseURL: "https://forsarah-96dfe.firebaseio.com",
  projectId: "forsarah-96dfe",
  storageBucket: "forsarah-96dfe.appspot.com",
  messagingSenderId: "621317608688"
};
firebase.initializeApp(config);
var database = firebase.database();


// Establish pertinent user input variables for future capture:
var startAddress = '';
var startCity = '';
var startZip = '';
var destAddress;
var destCity;
var destZip;
var destNotes;
var milesFromStart;
var tripTime;

// On-Click function to add a new starting address to database:
$('#add-start').on('click', function(event) {
  // Prevent form refresh after click:
  event.preventDefault();
  // Capture user inputs:
  startAddress = $("#start-address").val().trim();
  startCity = $("#start-city").val().trim();
  startZip = $("#start-zip").val().trim();
  // Firebase data manipulation:
  var BeginningAddress = {
    startAddress: startAddress,
    startCity: startCity,
    startZip: startZip,
    dateStartAdded: firebase.database.ServerValue.TIMESTAMP
  };
  database.ref('/StartingAddress').set(BeginningAddress);
  // Clear Start Address Input Areas After Submit:
  $("#formStartAddress")[0].reset();
});

// On-Click function to add a new destination address to database:
$('#add-destination').on('click', function(event) {
  // Prevent form refresh after click:
  event.preventDefault();
  // Capture user inputs:
  destAddress = $("#dest-address").val().trim();
  destCity = $("#dest-city").val().trim();
  destZip = $("#dest-zip").val().trim();
  destNotes = $("#dest-notes").val().trim();
  // Firebase data manipulation:
  var DestinationProperty = {
    destAddress: destAddress,
    destCity: destCity,
    destZip: destZip,
    destNotes: destNotes,
    dateDestAdded: firebase.database.ServerValue.TIMESTAMP,
  }
  database.ref('/DestinationAddress')
    .push(DestinationProperty)
    .then((snapshot) => {
    const key = snapshot.key;
    console.log(key);
    });
  // Clear Destination Address Input Areas After Submit:
  $("#formDestAddress")[0].reset();
});

// Render information based on inputs to starting address and updates to the directory in the database:
database.ref('/StartingAddress').on("value", function(childSnapshot) {
  // Clear any pre-existing HTML or renders:
  $("#add-startAddressRow").html('');
  // Set database variables:   
  var startAddress = childSnapshot.val().startAddress;
  var startCity = childSnapshot.val().startCity;
  var startZip = childSnapshot.val().startZip;
  var dateStartAdded = childSnapshot.val().dateStartAdded;
  /* console.log('Beginning Address: '+startAddress+' '+startCity+' '+startZip+' was added '+dateStartAdded);*/
  // Manipulate Start Address DOM to reflect changes:
  $("#add-startAddressRow").append('<tr class="t-menu__item t-border"><td>'+startAddress+'</td><td>'+startCity+'</td><td>'+startZip+"</td></tr>");
});

// Render information based on inputs to destination address and updates to the directory in the database:
database.ref('/DestinationAddress').on("child_added", function(childSnapshot) {
  // Set database variables:
  var destAddress = childSnapshot.val().destAddress;
  var destCity = childSnapshot.val().destCity;
  var destZip = childSnapshot.val().destZip;
  var destNotes = childSnapshot.val().destNotes;
  var dateDestAdded = childSnapshot.val().dateDestAdded;
  /* console.log('Destination Address: '+destAddress+' '+destCity+' '+destZip+' was added '+dateDestAdded); */
  // Manipulate Destination Address DOM to reflect changes:
  $("#add-destAddressRow").append('<tr class="t-menu__item t-border"><td>'+destAddress+'</td><td>'+destCity+'</td><td>'+destZip+"</td><td>"+destNotes+"</td></tr>");
});

// Call info from database and initiate AJAX call:
$('#calculate').on('click', function() {
  database.ref().on("value", function(snapshot) {
    var sstjsa = snapshot.toJSON().StartingAddress
    console.log(snapshot.toJSON().DestinationAddress);
    /* console.log(snapshot.toJSON().StartingAddress);*/
    var startAddress = sstjsa.startAddress;
    var startCity = sstjsa.startCity;
    var startZip = sstjsa.startZip;
    /* console.log('This is the Starting Address: '+startAddress+' '+startCity+' '+startZip+'.'); */
    var destAddress;
    
    var destCity;
    var destZip;
    var destKey;
    var milesFromStart;
    var tripTime;
    var fromAddress = '&from='+startAddress+startCity+startZip;
    var toAddress = '&to='+destAddress+destCity+destZip+'?routeType=shortest';
    var mqFinalURL = mqBaseURL+mqApiKey+fromAddress+toAddress;
    // MapQuest API AJAX Call:
    /* console.log('This is the MapQuest URL passed: '+mqFinalURL);*/
    /*$.get(mqFinalURL).done(function(mqResponse){
      console.log(mqResponse);
      var results = mqResponse;
      $('#sort-by-sdfh').show();
      $('#sort-by-sdfeo').show();
    })*/
  })
})

// Function to return miles from start destination:
function milesFromStart () {
  console.log('Testing function milesFromStart: ');
}

// Function to return and sort by miles between destination addresses:
function milesBetweenAddresses () {
  console.log('Testing function milesBetweenAddresses: ');
}


/*   
 */

/* Sample Addresses:

Start: 
  320 Callandale Ln, Durham, NC 27703
  7920 ACC Blvd Suite 130, Raleigh, NC 27617

Destinations:
  245 Ruby Ridge Rd, Durham, NC 27703
  1415 Hearthside St, Durham, NC 27707
  3517 Marquis Dr, Durham, NC 27704
  4225 Bluffs Ln, Durham, NC 27712
  316 Lodestone Dr, Durham, NC 27703
  814 Corona St, Durham, NC 27707
  3912 Alameda St, Durham, NC 27704
  803 Sanderson Dr, Durham, NC 27704

*/

/*
$('#remove-start').on('click', function(event) {
  event.preventDefault();
  database.ref('/StartAddress').push({
    startAddress:'',
    startCity:'',
    startZip:'',
    dateStartAdded: ''
})


var tableRow = $('<tr>', {class:'t-menu__item t-border'});
*/

