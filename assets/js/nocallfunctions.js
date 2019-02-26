// Click function that changes theme between dark display, night display and certain button types:
$(document).on('click', '.js-change-theme', function changeTheme (event){
    event.preventDefault();
    var body = $(document.body);
    var btns = $('.z');
    if (body.hasClass('t--dark')) {
        body.removeClass('t--dark');
        btns.removeClass('btn-primary')
        body.addClass('t--light');
        btns.addClass('btn-success');
        $('.js-change-theme').text('Switch to a Darker Display')
    } else {
        body.removeClass('t--light');
        body.addClass('t--dark');
        btns.addClass('btn-primary');
        btns.removeClass('btn-success');
        $('.js-change-theme').text('Switch to a Brighter Display')
}});
        
// Set Default Displays and Texts On Page Load:
$('#sort-by-sdfh').hide();
$('#sort-by-sdfeo').hide();
$('.js-change-theme').text('Switch to a Brighter Display'); 
$('#add-destination').text('Add Destination Address'); 
$('#remove-last').text('Remove Last Input'); 
$('#clear-all').text('Clear All Inputs');
$('#add-start').text('Set Starting Address')
$('#remove-start').text('Clear Starting Address')
$('#calculate').text('Plan My Trips!')
$('#email-me').text('Email Me')

// Function to make data tables sortable in either ascending or descending fashion, and by either numerics of alphabetically:
function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("distancesFromEachOther");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc"; 
  /* Make a loop that will continue until no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare, one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place, based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++; 
    } else {
      /* If no switching has been done AND the direction is "asc", set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}


/* 
Math logic information:

        With 1 Addresses Need 00 renders; increase of 0 to TotalRenders; or TotalAddresses multipled by base=0
        With 2 Addresses Need 01 renders; increase of 1 to TotalRenders; or TotalAddresses multipled by base=0.5
        With 3 Addresses Need 03 renders; increase of 2 to TotalRenders; or TotalAddresses multipled by base=1
        With 4 Addresses Need 06 renders; increase of 3 to TotalRenders; or TotalAddresses multipled by base=1.5
        With 5 Addresses Need 10 renders; increase of 4 to TotalRenders; or TotalAddresses multipled by base=2
        With 6 Addresses Need 15 renders; increase of 5 to TotalRenders; or TotalAddresses multipled by base=2.5
        With 7 Addresses Need 21 renders; increase of 6 to TotalRenders; or TotalAddresses multipled by base=3
        With 8 Addresses Need 28 renders; increase of 7 to TotalRenders; or TotalAddresses multipled by base=3.5
        Total necessary appends to Property A & B columns for comparison = RendersNeeded
        Total Addresses = [A1, A2, A3, A4, A5, A6]; total possible routes = TotalAddresses*TotalAddresses (or 6 in this case) including from self, ie point a to point a route possibilities.
        A1 =/= A1
        A1 -> A2
        A1 -> A3

        A2 =/= A2
        A2 =/= A1
        A2 -> A3
        
        A3 =/= A3
        A3 =/= A2
        A3 =/= A1

      }
              var addressObjects = [];

        var addressObjectRubyRidgeRd = response[0] = {
          selfAddress: response[0].destAddress,
          otherAddress1: response[1].destAddress,
          otherAddress2: response[2].destAddress,
          milesToSelfAddress: response[0].distancesFromOthers[0],
          milesToOtherAddress1: response[0].distancesFromOthers[1],
          milesToOtherAddress2: response[0].distancesFromOthers[2],
          selfTripTime: response[0].tripTime[0],
          tipTimeToOther1: response[0].tripTime[1],
          tipTimeToOther2: response[0].tripTime[2]
        }
        var addressObjectHearthsideSt = response[1] = {
          selfAddress: response[1].destAddress,
          otherAddress1: response[0].destAddress,
          otherAddress2: response[2].destAddress,
          milesToSelfAddress: response[1].distancesFromOthers[1],
          milesToOtherAddress1: response[1].distancesFromOthers[0],
          milesToOtherAddress2: response[1].distancesFromOthers[2],
          selfTripTime: response[1].tripTime[1],
          tipTimeToOther1: response[1].tripTime[0],
          tipTimeToOther2: response[1].tripTime[2]
        }
        var addressObjectMarquisDr = response[2] = {
          selfAddress: response[2].destAddress,
          otherAddress1: response[1].destAddress,
          otherAddress2: response[0].destAddress,
          milesToSelfAddress: response[2].distancesFromOthers[2],
          milesToOtherAddress1: response[2].distancesFromOthers[1],
          milesToOtherAddress2: response[2].distancesFromOthers[0],
          selfTripTime: response[2].tripTime[2],
          tipTimeToOther1: response[2].tripTime[1],
          tipTimeToOther2: response[2].tripTime[2]
        }
        
        for (var i = 0; response.length; i++) {
            create new addressObject;
        }

        for (var i = 0; i < totalPossibleDestinations; i++) {
          create new property 
        }
      */
      

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


ruby to ruby is 0 miles; which =          results.locations[0].street to results.locations[0].street is results.distance[0][0] // unnecessary because self to self / remove 1 keep 3
ruby to hearthside is 5.566 miles         results.locations[0].street to results.locations[1].street is results.distance[0][1]
ruby to marquis is 7.246 miles            results.locations[0].street to results.locations[2].street is results.distance[0][2]
ruby to  bluffs is 10.143 miles           results.locations[0].street to results.locations[3].street is results.distance[0][3]

hearthside to ruby =                      results.locations[1].street to results.locations[0].street is results.distance[1][0] // unneccessary because duplicate comparison / remove 2 keep 2
hearthside to hearthside=                 results.locations[1].street to results.locations[1].street is results.distance[1][1] // unneccessary because self to self
hearthside to marquis                     results.locations[1].street to results.locations[2].street is results.distance[1][2]
hearthside to bluffs                      results.locations[1].street to results.locations[3].street is results.distance[1][3]

marquis to ruby                           results.locations[2].street to results.locations[0].street is results.distance[2][0] // unneccessary because duplicate comparison / remove 3 keep 1
marquis to hearthside                     results.locations[2].street to results.locations[1].street is results.distance[2][1] // unneccessary because duplicate comparison
marquis to marquis                        results.locations[2].street to results.locations[2].street is results.distance[2][2] // unneccessary because self to self
marquis to bluffs                         results.locations[2].street to results.locations[3].street is results.distance[2][3]

bluffs to ruby                            results.locations[3].street to results.locations[0].street is results.distance[3][0] // unneccessary because duplicate comparison / remove 4 keep 0 for arrays
bluffs to hearthside                      results.locations[3].street to results.locations[1].street is results.distance[3][1] // unneccessary because duplicate comparison
bluffs to marquis                         results.locations[3].street to results.locations[2].street is results.distance[3][2] // unneccessary because duplicate comparison   
bluffs to bluffs                          results.locations[3].street to results.locations[3].street is results.distance[3][3] // unneccessary because self to self   

*/
