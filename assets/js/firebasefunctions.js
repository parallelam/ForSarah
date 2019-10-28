// Set MapQuest information to variables for future concatenation:
var mqApiKey = '?key=ZzaGO8COL1AF8qgAd3D4cjIUfXsjKtYC';
var mqRouteBaseURL = 'https://www.mapquestapi.com/directions/v2/routematrix'
var mqGeocodeBaseURL = 'https://www.mapquestapi.com/geocoding/v1/address'
var mqGeoFinalURL = mqGeocodeBaseURL+mqApiKey
var mqRouteFinalURL = mqRouteBaseURL+mqApiKey

// Initialize Firebase and establish Firebase database variables:
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

// Establish pertinent user input variables for future capture and assignment:
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

// Variable function to convert trip times from seconds to a readable format:
var toHHMMSS = (secs) => {
  var sec_num = parseInt(secs, 10)    
  var hours   = Math.floor(sec_num / 3600) % 24
  var minutes = Math.floor(sec_num / 60) % 60
  var seconds = sec_num % 60    
  return [hours,minutes,seconds]
      .map(v => v < 10 ? "0" + v : v)
      .filter((v,i) => v !== "00" || i > 0)
      .join("m ")
};

// On-Click function to set a new starting address in database:
$('#add-start').on('click', function(event) {
  // Prevent form refresh after click:
  event.preventDefault();
  // Capture user inputs:
  var startAddress = $("#start-address").val().trim();
  var startCity = $("#start-city").val().trim();
  var startZip = $("#start-zip").val().trim();
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
    refSA.set(BeginningLocationInfo);
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
    refDA.push(DestinationLocationInfo);
    location.reload();
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
  $("#add-startAddressRow").append('<tr class="t-menu__item t-border"><td>'+snapshot.val().street+'</td><td class="centered">'+snapshot.val().city+'</td><td class="centered">'+snapshot.val().zip+'</td><td class="centered">'+formattedTime+"</td></tr>");
});

// Render information based on inputs to destination address and updates to the directory in the database:
refDA.on("value", function(snapshot) {
  if (snapshot.toJSON() === null) {
    $('#properties-to-show').hide();
  } else {
    $('#properties-to-show').show();
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
      $("#add-destAddressRow").append('<tr class="t-menu__item t-border"><td>'+childSnapshot.val().street+'</td><td class="centered">'+childSnapshot.val().city+'</td><td class="centered">'+childSnapshot.val().zip+"</td><td>"+childSnapshot.val().destNotes+"</td></tr>");
  })
  };
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
  })
    .done(function(mqResponse) {
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
          $("#add-DistanceFromHomeRow").append('<tr class="t-menu__item t-border"><td>'+fromAddress+'</td><td>'+toAddresses[i].destAddress+'</td><td class="centered">'+toAddresses[i].destCity+'</td><td class="centered">'+toAddresses[i].destZip+"</td><td class='centered'>"+toAddresses[i].milesFromStart+"</td><td class='centered'>"+toHHMMSS(toAddresses[i].tripTime)+"</td></tr>");
        }
    });
  if (locationsFromOthers < 2) {
    return $("#add-DistanceBetweenRow").append('<tr><td>This functionality requires 2 or more destination addresses.</td></tr>')
  } else {
    $.ajax({
      type: 'POST',
      url: mqRouteFinalURL,
      data: JSON.stringify(directionRequestB),
      contentType: "application/json",
      dataType: 'json'
    })
      .done(function(mqResponse) {
          var results = mqResponse;
          console.log(results);
          $('#sort-by-sdfeo').show();
          var totalAddresses = results.locations.length;
          /* Commenting out code below until I can figure out how to remedy duplicate and self to self comparisons:
          var base = -0.5;
          for (var i = 0; i < totalAddresses; i++) {
            base += 0.5;
          }
          var rendersNeeded = parseFloat(totalAddresses*base);
          */
          var propertyA = [];
          var propertyB = [];
          var miles = [];
          var eta = [];
          for (var i = 0; i < totalAddresses; i++) {
            for (var j = 0; j < totalAddresses; j++) {
              propertyA.push(results.locations[i].street);
              propertyB.push(results.locations[j].street);
              miles.push(results.distance[i][j]);
              eta.push(results.time[i][j]);
            }
          }
          for (var i = 0; i < propertyA.length; i+=totalAddresses) {
            var removedA = propertyA.splice(i,1);
            var removedB = propertyB.splice(i,1);
            var removedC = miles.splice(i,1);
            var removedD = eta.splice(i,1);
          }
          for (var i = 0; i < propertyA.length; i++) {
            parseFloat(miles[i].toFixed(2))
            $("#add-DistanceBetweenRow").append('<tr class="t-menu__item t-border"><td>'+propertyA[i]+'</td><td>'+propertyB[i]+'</td><td class="centered">'+miles[i]+'</td><td class="centered">'+toHHMMSS(eta[i])+'</td></tr>')
          }
          sortTable(3);
      });
    };
});

$('#clear-all').on('click', function(event){
  event.preventDefault();
  refDA.remove();
  refDA.on("value", function(snapshot){
  console.log(snapshot.toJSON());
  })
  location.reload();
})

/*
  Table should look like with 3 addresses; renderNeeded = 3; will need -1 from rendersNeeded for propertyA forloop to work

        Prop A           Prop B                    Miles               Eta
  245 Ruby Ridge Rd     1415 Hearthside St        5.56                677 or 11m 17s
  245 Ruby Ridge Rd     3517 Marquis Dr           7.246               779 or 12m 59s
  1415 Hearthside St    3517 Marquis Dr           7.584               871 or 14m 31s

  Table should look like with 4 addresses; rendersNeeded = 6; will need -2 from rendersNeeded for propertyA forloop to work

          Prop A           Prop B                    Miles               Eta
  245 Ruby Ridge Rd     1415 Hearthside St        5.56                677 or 11m 17s
  245 Ruby Ridge Rd     3517 Marquis Dr           7.246               779 or 12m 59s
  245 Ruby Ridge Rd     4225 Bluffs Ln
  1415 Hearthside St    3517 Marquis Dr           7.584               871 or 14m 31s
  1415 Hearthside St    4225 Bluffs Ln
  3517 Marquis Dr       4225 Bluffs Ln

  Table should look like with 5 addresses; rendersNeeded = 10; will need -4 from rendersNeeded for propertyA forloop to work

          Prop A           Prop B                    Miles               Eta
  245 Ruby Ridge Rd     1415 Hearthside St        5.56                677 or 11m 17s
  245 Ruby Ridge Rd     3517 Marquis Dr           7.246               779 or 12m 59s
  245 Ruby Ridge Rd     4225 Bluffs Ln
  245 Ruby Ridge Rd     316 Lodestone Dr
  1415 Hearthside St    3517 Marquis Dr           
  1415 Hearthside St    4225 Bluffs Ln
  1415 Hearthside St    316 Lodestone Dr
  3517 Marquis Dr       4225 Bluffs Ln
  3517 Marquis Dr       316 Lodestone Dr
  4225 Bluffs Ln        316 Lodestone Dr

ruby to ruby is 0 miles; which =          results.locations[0].street to results.locations[0].street is results.distance[0][0] // unnecessary because self to self / remove 1 keep 3
ruby to hearthside is 5.566 miles         results.locations[0].street to results.locations[1].street is results.distance[0][1]
ruby to marquis is 7.246 miles            results.locations[0].street to results.locations[2].street is results.distance[0][2]
ruby to  bluffs is 10.143 miles           results.locations[0].street to results.locations[3].street is results.distance[0][3]     remove 1 keep 3

hearthside to ruby =                      results.locations[1].street to results.locations[0].street is results.distance[1][0] // unneccessary because duplicate comparison / remove 2 keep 2
hearthside to hearthside=                 results.locations[1].street to results.locations[1].street is results.distance[1][1] // unneccessary because self to self
hearthside to marquis                     results.locations[1].street to results.locations[2].street is results.distance[1][2]     remove 2 keep 2
hearthside to bluffs                      results.locations[1].street to results.locations[3].street is results.distance[1][3]

marquis to ruby                           results.locations[2].street to results.locations[0].street is results.distance[2][0] // unneccessary because duplicate comparison / remove 3 keep 1
marquis to hearthside                     results.locations[2].street to results.locations[1].street is results.distance[2][1] // unneccessary because duplicate comparison
marquis to marquis                        results.locations[2].street to results.locations[2].street is results.distance[2][2] // unneccessary because self to self
marquis to bluffs                         results.locations[2].street to results.locations[3].street is results.distance[2][3]    remove 3 keep 1

bluffs to ruby                            results.locations[3].street to results.locations[0].street is results.distance[3][0] // unneccessary because duplicate comparison / remove 4 keep 0 for arrays
bluffs to hearthside                      results.locations[3].street to results.locations[1].street is results.distance[3][1] // unneccessary because duplicate comparison
bluffs to marquis                         results.locations[3].street to results.locations[2].street is results.distance[3][2] // unneccessary because duplicate comparison   
bluffs to bluffs                          results.locations[3].street to results.locations[3].street is results.distance[3][3] // unneccessary because self to self   remove 4 keep 0


10 to remove from from original array

first splice clears index 0 and every 4th one after that


Array B Before Splice:

0: "245 Ruby Ridge Rd" // unnecessary because self to self
1: "1415 Hearthside St"
2: "3517 Marquis Dr"
3: "4225 Bluffs Ln"
4: "245 Ruby Ridge Rd" // unneccessary because duplicate comparison
5: "1415 Hearthside St" // unneccessary because self to self
6: "3517 Marquis Dr"
7: "4225 Bluffs Ln"
8: "245 Ruby Ridge Rd" // unneccessary because duplicate comparison / remove 3 keep 1
9: "1415 Hearthside St" // unneccessary because duplicate comparison
10: "3517 Marquis Dr" // unneccessary because self to self
11: "4225 Bluffs Ln"
12: "245 Ruby Ridge Rd" // unneccessary because duplicate comparison / remove 4 keep 0 for arrays
13: "1415 Hearthside St" // unneccessary because duplicate comparison
14: "3517 Marquis Dr" // unneccessary because duplicate comparison   
15: "4225 Bluffs Ln" // unneccessary because self to self   


Array B After Splice:

0: "1415 Hearthside St"
1: "3517 Marquis Dr"
2: "4225 Bluffs Ln"
3: "245 Ruby Ridge Rd" // unneccessary because duplicate comparison
4: "3517 Marquis Dr"
5: "4225 Bluffs Ln"
6: "245 Ruby Ridge Rd" // unneccessary because duplicate comparison / remove 3 keep 1
7: "1415 Hearthside St" // unneccessary because duplicate comparison
8: "4225 Bluffs Ln"
9: "245 Ruby Ridge Rd" // unneccessary because duplicate comparison / remove 4 keep 0 for arrays
10: "1415 Hearthside St" // unneccessary because duplicate comparison
11: "3517 Marquis Dr" // unneccessary because duplicate comparison   

address[i] = new 




function AddressToRender()





*/

