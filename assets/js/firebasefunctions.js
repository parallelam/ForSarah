// Set MapQuest information to variables for future concatenation:
var mqApiKey = '?key=ZzaGO8COL1AF8qgAd3D4cjIUfXsjKtYC';
var mqRouteBaseURL = 'http://www.mapquestapi.com/directions/v2/routematrix'
var mqGeocodeBaseURL = 'http://www.mapquestapi.com/geocoding/v1/address'
var mqGeoFinalURL = mqGeocodeBaseURL+mqApiKey
var mqRouteFinalURL = mqRouteBaseURL+mqApiKey


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
var refSA = firebase.database().ref('/StartingAddress');
var refDA = firebase.database().ref('/DestinationAddress');

// Establish pertinent user input variables for future capture:
var startAddress;
var startCity;
var startZip;
var destAddress;
var destCity;
var destZip;
var destNotes;
var milesFromStart;
var tripTime;
var fromLocation;
var toLocation;
var locationsFromHome = [];
var locationsFromOthers = [];
var optionsFromHome = {
  allToAll:false,
  manyToOne:false
};
var optionsFromOthers = {
  allToAll:true,
  manyToOne:false
}


// On-Click function to set a new starting address in database:
$('#add-start').on('click', function(event) {
  // Prevent form refresh after click:
  event.preventDefault();
  // Capture user inputs:
  startAddress = $("#start-address").val().trim();
  startCity = $("#start-city").val().trim();
  startZip = $("#start-zip").val().trim();
  // Establish variables for MapQuest POST request:
  var ReqBeginningLocationInfo = {
    street: startAddress,
    city: startCity,
    postalCode: startZip
  };
  // Submit MapQuest POST request for Firebase database manipulation:
  $.post(mqGeoFinalURL, ReqBeginningLocationInfo).done(function(mqGeoResponse){
    var results = mqGeoResponse.results[0].locations[0];
    var BeginningLocationInfo = {
      dateAdded: firebase.database.ServerValue.TIMESTAMP,
      street: results.street,
      city: results.adminArea5,
      zip: results.postalCode,
      county: results.adminArea4,
      state: results.adminArea3,
      country: results.adminArea1,
      lat: results.latLng.lat,
      lng: results.latLng.lng
    };
    // Sets Firebase database to results of POST request:
    database.ref('/StartingAddress').set(BeginningLocationInfo);
  });
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
  // Establish variables for MapQuest POST request:
  var ReqDestinationLocationInfo = {
    street: destAddress,
    city: destCity,
    postalCode: destZip
  };
  // Submit MapQuest POST request for Firebase database manipulation:
  $.post(mqGeoFinalURL, ReqDestinationLocationInfo).done(function(mqGeoResponse){
    var results = mqGeoResponse.results[0].locations[0];
    var DestinationLocationInfo = {
      dateAdded: firebase.database.ServerValue.TIMESTAMP,
      street: results.street,
      city: results.adminArea5,
      zip: results.postalCode,
      county: results.adminArea4,
      state: results.adminArea3,
      country: results.adminArea1,
      lat: results.latLng.lat,
      lng: results.latLng.lng,
      destNotes: destNotes
    };
    // Pushes to Firebase database results of POST request:
    database.ref('/DestinationAddress').push(DestinationLocationInfo);
  });
  // Clear Destination Address Input Areas After Submit:
  $("#formDestAddress")[0].reset();
});

// Render information based on inputs to starting address and updates to the directory in the database:
refSA.on("value", function(snapshot) {
  // Clear any pre-existing HTML and renders as there can only be one starting address:
  $("#add-startAddressRow").html('');
  // Reference database variables for HTML rendering and establish values for variable fromLocation to be used later in POST request:
  fromLocation = {
    street: snapshot.val().street,
    city: snapshot.val().city,
    county: snapshot.val().county,
    state: snapshot.val().state,
    zip: snapshot.val().zip
  };
  // Pushes fromLocation to array locations for later use in POST request:
  locationsFromHome.push(fromLocation);
  var timestamp = snapshot.val().dateAdded
  var formattedTime = moment(timestamp).format('MMMM Do YYYY h:mm a');
  // Manipulate Start Address DOM to reflect changes:
  $("#add-startAddressRow").append('<tr class="t-menu__item t-border"><td>'+snapshot.val().street+'</td><td>'+snapshot.val().city+'</td><td>'+snapshot.val().zip+'</td><td class="centered">'+formattedTime+"</td></tr>");
});

// Render information based on inputs to destination address and updates to the directory in the database:
refDA.on("value", function(snapshot) {
  snapshot.forEach(function(childSnapshot){
    // Reference database variables for HTML rendering and establish values for variable toLocation to be used later in POST request:
    toLocation = {
      street: childSnapshot.val().street,
      city: childSnapshot.val().city,
      county: childSnapshot.val().county,
      state: childSnapshot.val().state,
      zip: childSnapshot.val().zip
    };
    // Pushes toLocation to array locations for later use in POST request:
    locationsFromHome.push(toLocation);
    locationsFromOthers.push(toLocation);
    // Manipulate Destination Address DOM to reflect changes:
    $("#add-destAddressRow").append('<tr class="t-menu__item t-border"><td>'+childSnapshot.val().street+'</td><td>'+childSnapshot.val().city+'</td><td>'+childSnapshot.val().zip+"</td><td>"+childSnapshot.val().destNotes+"</td></tr>");
  });
});

// On-Click function to initiate AJAX call:
$('#calculate').on('click', function() {
  var directionRequestA = {
    locations:locationsFromHome,
    options:optionsFromHome
  };
  var directionRequestB = {
    locations:locationsFromOthers,
    options:optionsFromOthers
  };
  $.ajax({
    type: 'POST',
    url: mqRouteFinalURL,
    data: JSON.stringify(directionRequestA),
    contentType: "application/json",
    dataType: 'json'
  }).done(function(mqResponse) {
      var results = mqResponse;
      fromAddress = fromLocation.street;
      $('#sort-by-sdfh').show();
      var toAddresses = [];
      for (var i = 1; i < results.locations.length; i++) {
        var toAddress = {
          milesFromStart: results.distance[i],
          tripTime: results.time[i],
          destAddress: results.locations[i].street,
          destCity: results.locations[i].adminArea5,
          destZip: results.locations[i].postalCode
        }
        toAddresses.push(toAddress);
      }
      toAddresses.sort(function(a, b){return a.milesFromStart - b.milesFromStart});
      for (var i = 0; i < toAddresses.length; i++){
        $("#add-DistanceFromHomeRow").append('<tr class="t-menu__item t-border"><td>'+fromAddress+'</td><td>'+toAddresses[i].destAddress+'</td><td>'+toAddresses[i].destCity+'</td><td>'+toAddresses[i].destZip+"</td><td class='centered'>"+toAddresses[i].milesFromStart+"</td><td class='centered'>"+toHHMMSS(toAddresses[i].tripTime)+"</td></tr>");
      }
  });
  $.ajax({
    type: 'POST',
    url: mqRouteFinalURL,
    data: JSON.stringify(directionRequestB),
    contentType: "application/json",
    dataType: 'json'
  }).done(function(mqResponse) {
      var results = mqResponse;
      console.log(results);
      $('#sort-by-sdfeo').show();
      var toAddresses = [];
      for (var i = 0; i < results.locations.length; i++) {
        var toAddress = {
          distancesFromOthers: results.distance[i],
          tripTime: results.time[i],
          destAddress: results.locations[i].street,
          destCity: results.locations[i].adminArea5,
          destZip: results.locations[i].postalCode
        }
        toAddresses.push(toAddress);
      }
      console.log(toAddresses)
      toAddresses.map()
      for (var i = 0; i < toAddresses.length; i++){
        $("#add-DistanceBetweenRow").append('<tr class="t-menu__item t-border"><td>'+toAddresses[i].destAddress+'</td><td>'+toAddresses[i].destCity+'</td><td>'+toAddresses[i].destZip+"</td><td class='centered'>"+toAddresses[i].milesFromStart+"</td><td class='centered'>"+toHHMMSS(toAddresses[i].tripTime)+"</td></tr>");
      }
  });
});

var toHHMMSS = (secs) => {
  var sec_num = parseInt(secs, 10)    
  var hours   = Math.floor(sec_num / 3600) % 24
  var minutes = Math.floor(sec_num / 60) % 60
  var seconds = sec_num % 60    
  return [hours,minutes,seconds]
      .map(v => v < 10 ? "0" + v : v)
      .filter((v,i) => v !== "00" || i > 0)
      .join(":")
}

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
*/

