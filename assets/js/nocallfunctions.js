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
$('#calculate').text('Plan My Trip!')
$('#email-me').text('Email Me')

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
      

      
     function sortTable(n) {
        var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        table = document.getElementById("distancesFromEachOther");
        switching = true;
        // Set the sorting direction to ascending:
        dir = "asc"; 
        /* Make a loop that will continue until
        no switching has been done: */
        while (switching) {
          // Start by saying: no switching is done:
          switching = false;
          rows = table.rows;
          /* Loop through all table rows (except the
          first, which contains table headers): */
          for (i = 1; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /* Check if the two rows should switch place,
            based on the direction, asc or desc: */
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
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            // Each time a switch is done, increase this count by 1:
            switchcount ++; 
          } else {
            /* If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again. */
            if (switchcount == 0 && dir == "asc") {
              dir = "desc";
              switching = true;
            }
          }
        }
      }