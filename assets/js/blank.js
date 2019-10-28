// Set MapQuest information to variables for future concatenation:
var mqApiKey = '?key=ZzaGO8COL1AF8qgAd3D4cjIUfXsjKtYC';
var mqRouteBaseURL = 'https://www.mapquestapi.com/directions/v2/routematrix';
var mqGeocodeBaseURL = 'https://www.mapquestapi.com/geocoding/v1/address';
var mqGeoFinalURL = mqGeocodeBaseURL + mqApiKey;
var mqRouteFinalURL = mqRouteBaseURL + mqApiKey;

// Initialize Firebase and establish Firebase database variables:
var config = {
  apiKey: 'AIzaSyBG8qfXJJ8Oe9VZEWm9C7yNpB531ofFr5Q',
  authDomain: 'forsarah-96dfe.firebaseapp.com',
  databaseURL: 'https://forsarah-96dfe.firebaseio.com',
  projectId: 'forsarah-96dfe',
  storageBucket: 'forsarah-96dfe.appspot.com',
  messagingSenderId: '621317608688'
};
firebase.initializeApp(config);
var database = firebase.database();
var refSA = firebase.database().ref('/StartingAddress');
var refDA = firebase.database().ref('/DestinationAddress');

// Establish pertinent user input variables for future capture and assignment:
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
  allToAll: false,
  manyToOne: false
};
var optionsFromOthers = {
  allToAll: true,
  manyToOne: false
};

// Variable function to convert Firebase database timestamps to beautified dates and times:
var toHHMMSS = (secs) => {
  var sec_num = parseInt(secs, 10);
  var hours = Math.floor(sec_num / 3600) % 24;
  var minutes = Math.floor(sec_num / 60) % 60;
  var seconds = sec_num % 60;
  return [hours, minutes, seconds]
    .map((v) => (v < 10 ? '0' + v : v))
    .filter((v, i) => v !== '00' || i > 0)
    .join('m ');
};

// On-Click function to set a new starting address in database:
$('#add-start').on('click', function(event) {
  // Prevent form refresh after click:
  event.preventDefault();
  // Capture user inputs:
  startAddress = $('#start-address')
    .val()
    .trim();
  startCity = $('#start-city')
    .val()
    .trim();
  startZip = $('#start-zip')
    .val()
    .trim();
  // Establish variables for MapQuest POST request:
  var ReqBeginningLocationInfo = {
    street: startAddress,
    city: startCity,
    postalCode: startZip
  };
  // Submit MapQuest POST request for Firebase database manipulation:
  $.post(mqGeoFinalURL, ReqBeginningLocationInfo).done(function(mqGeoResponse) {
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
  $('#formStartAddress')[0].reset();
});

// On-Click function to add a new destination address to database:
$('#add-destination').on('click', function(event) {
  // Prevent form refresh after click:
  event.preventDefault();
  // Capture user inputs:
  destAddress = $('#dest-address')
    .val()
    .trim();
  destCity = $('#dest-city')
    .val()
    .trim();
  destZip = $('#dest-zip')
    .val()
    .trim();
  destNotes = $('#dest-notes')
    .val()
    .trim();
  // Establish variables for MapQuest POST request:
  var ReqDestinationLocationInfo = {
    street: destAddress,
    city: destCity,
    postalCode: destZip
  };
  // Submit MapQuest POST request for Firebase database manipulation:
  $.post(mqGeoFinalURL, ReqDestinationLocationInfo).done(function(mqGeoResponse) {
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
  $('#formDestAddress')[0].reset();
});

// Render information based on inputs to starting address and updates to the directory in the database:
refSA.on('value', function(snapshot) {
  // Clear any pre-existing HTML and renders as there can only be one starting address:
  $('#add-startAddressRow').html('');
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
  var timestamp = snapshot.val().dateAdded;
  var formattedTime = moment(timestamp).format('MMMM Do YYYY h:mm a');
  // Manipulate Start Address DOM to reflect changes:
  $('#add-startAddressRow').append(
    '<tr class="t-menu__item t-border"><td>' +
      snapshot.val().street +
      '</td><td>' +
      snapshot.val().city +
      '</td><td>' +
      snapshot.val().zip +
      '</td><td class="centered">' +
      formattedTime +
      '</td></tr>'
  );
});

// Render information based on inputs to destination address and updates to the directory in the database:
refDA.on('value', function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
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
    $('#add-destAddressRow').append(
      '<tr class="t-menu__item t-border"><td>' +
        childSnapshot.val().street +
        '</td><td>' +
        childSnapshot.val().city +
        '</td><td>' +
        childSnapshot.val().zip +
        '</td><td>' +
        childSnapshot.val().destNotes +
        '</td></tr>'
    );
  });
});

// On-Click function to initiate AJAX call:
$('#calculate').on('click', function() {
  var directionRequestA = {
    locations: locationsFromHome,
    options: optionsFromHome
  };
  var directionRequestB = {
    locations: locationsFromOthers,
    options: optionsFromOthers
  };
  $.ajax({
    type: 'POST',
    url: mqRouteFinalURL,
    data: JSON.stringify(directionRequestA),
    contentType: 'application/json',
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
      };
      toAddresses.push(toAddress);
    }
    toAddresses.sort(function(a, b) {
      return a.milesFromStart - b.milesFromStart;
    });
    for (var i = 0; i < toAddresses.length; i++) {
      $('#add-DistanceFromHomeRow').append(
        '<tr class="t-menu__item t-border"><td>' +
          fromAddress +
          '</td><td>' +
          toAddresses[i].destAddress +
          '</td><td>' +
          toAddresses[i].destCity +
          '</td><td>' +
          toAddresses[i].destZip +
          "</td><td class='centered'>" +
          toAddresses[i].milesFromStart +
          "</td><td class='centered'>" +
          toHHMMSS(toAddresses[i].tripTime) +
          '</td></tr>'
      );
    }
  });
  if (locationsFromOthers < 2) {
    return $('#add-DistanceBetweenRow').append(
      '<tr><td>This functionality requires 2 or more destination addresses.</td></tr>'
    );
  } else {
    $.ajax({
      type: 'POST',
      url: mqRouteFinalURL,
      data: JSON.stringify(directionRequestB),
      contentType: 'application/json',
      dataType: 'json'
    }).done(function(mqResponse) {
      var results = mqResponse;
      console.log(results);
      $('#sort-by-sdfeo').show();
      var totalAddresses = results.locations.length;
      var base = -0.5;
      for (var i = 0; i < totalAddresses; i++) {
        base += 0.5;
      }
      var rendersNeeded = parseFloat(totalAddresses * base);
      var propertyA = [];
      var counterC = 0; // This will increment from 0 to 1 on For Loop Child completion
      var counterD = rendersNeeded - 1; // This is initially set to 2 and will decrement to 1 on For Loop Child Completion
      for (var i = 0; i < rendersNeeded; i++) {
        // For Loop Parent
        for (var j = counterD; j > 0; j--) {
          // For Loop Child
          propertyA.push(results.locations[counterC].street);
        }
        counterC++;
        counterD--;
      }
      var propertyB = [];
      var counterE = totalAddresses - 1; // Set number equivalent to array length - 1
      var counterF = rendersNeeded - 1; // This is initially set to 2 and will decrement to 1 on For Loop Child Completion
      for (var k = 0; k < rendersNeeded; k++) {
        // For Loop Parent
        for (var l = counterF; l > 0; l--) {
          // For Loop Child
          propertyB.push(results.locations[counterE].street);
        }
        counterE--;
        counterF--;
      }
      var miles = [results.distance[0][1], results.distance[0][2], results.distance[1][2]];
      var eta = [results.time[0][1], results.time[0][2], results.time[1][2]];
      for (var m = 0; m < rendersNeeded; m++) {
        $('#add-DistanceBetweenRow').append(
          '<tr><td>' +
            propertyA[m] +
            '</td><td>' +
            propertyB[m] +
            '</td><td class="centered">' +
            miles[m] +
            '</td><td class="centered">' +
            toHHMMSS(eta[m]) +
            '</td></tr>'
        );
      }
    });
  }
});
/*


ruby to hearthside is 5.566 miles         results.locations[0].street to results.locations[1].street is results.distance[0][1]
ruby to marquis is 7.246 miles            results.locations[0].street to results.locations[2].street is results.distance[0][2]
ruby to  bluffs is 10.143 miles           results.locations[0].street to results.locations[3].street is results.distance[0][3]
hearthside to ruby =                      results.locations[1].street to results.locations[0].street is results.distance[1][0] // unneccessary because duplicate comparison
hearthside to marquis                     results.locations[1].street to results.locations[2].street is results.distance[1][2]
hearthside to bluffs                      results.locations[1].street to results.locations[3].street is results.distance[1][3]
marquis to ruby                           results.locations[2].street to results.locations[0].street is results.distance[2][0] // unneccessary because duplicate comparison 
marquis to hearthside                     results.locations[2].street to results.locations[1].street is results.distance[2][1] // unneccessary because duplicate comparison
marquis to bluffs                         results.locations[2].street to results.locations[3].street is results.distance[2][3]
bluffs to ruby                            results.locations[3].street to results.locations[0].street is results.distance[3][0] // unneccessary because duplicate comparison 
bluffs to hearthside                      results.locations[3].street to results.locations[1].street is results.distance[3][1] // unneccessary because duplicate comparison
bluffs to marquis                         results.locations[3].street to results.locations[2].street is results.distance[3][2] // unneccessary because duplicate comparison   


Properties = 245 Ruby Ridge Rd = results.locations[0].street // Insert At Property A = var rendersNeeded - 1; or 2 times // Insert At Property B = var rendersNeeded - 3; or 0 times
           = 1415 Hearthside St = results.locations[1].street // Insert at Property A = var rendersNeeded - 2; or 1 times // Insert At Property B = var rendersNeeded - 2; or 1 times
           = 3517 Marquis Dr = results.locations[2].street // Insert At Property A = var rendersNeeded - 3; or 0 times // Insert At Property B = var rendersNeeded - 1; or 2 times

  miles = results.distance[0][1]
          results.distance[0][2]
          results.distance[1][2]

  time = results.time[0][1]
        results.time[0][2]
        results.time[1][2]

        
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
