//Converts a number of seconds in a human readable time in this format: 'hh:mm:ss'
function formatSeconds(sec){
        var date = new Date(null);
        date.setSeconds(sec);
        return date.toISOString().substr(11, 8);
    }

//Sends a query of a starting point and an array of waypoints to the google maps API
//Prints out the result of the optimized route
function executePathQuery(start, waypoints, end) {

    //Set up the map
    var map = new google.maps.Map(document.getElementById('map'));

    //Set up the directions renderer
    var directionsDisplay = new google.maps.DirectionsRenderer({
        map: map
    });

    //Processes the waypoints array in a api usable format
    let waypoints_processed = [];
    for(let i in waypoints)
        waypoints_processed.push({location:waypoints[i], stopover: true});

    //Sets the request options
    var request = {
        destination: end,
        origin: start,
        waypoints: waypoints_processed,
        optimizeWaypoints: true, //Optimize the given waypoints
        travelMode: 'DRIVING' //Use a car
    };

    //Send the request
    var directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function(response, status) {
        if (status == 'OK') {

            //Show the route on the map
            directionsDisplay.setDirections(response);

            let info = [];
            let output = "<h1>Route</h1>";
            let accumulatedTime = 0;
            for(let i in response.routes[0].legs)
            {
                let leg = response.routes[0].legs[i];
                info.push({from:leg.start_address, to:leg.end_address, duration:leg.duration});

                //Print the used time and the current location
                output += "<span class='discription_item'><b>"+ formatSeconds(accumulatedTime) + "</b> - " +leg.start_address+"</span>";

                accumulatedTime += leg.duration.value; //Add the used time / keep track of it
            }

            //Print the last stop of the route
            output += "<span class='discription_item'><b>"+ formatSeconds(accumulatedTime) + "</b> - " +info[info.length - 1].to+"</span>";

            //Do the actual output
            $("#discription").html(output);
        }
        else{
            //Status is not okay
            alert("It seems that your address is not valid");
        }
    });
}

$(document).ready(function(){

    setInterval(function(){
        //This code will make sure that only one empty waypoint text field will be displayed
        let oneShown = false;
            $("#waypoints input").each(function(i){ //Iterate all the text fields in #waypoints
                if(this.placeholder != "Start" && this.value == "") //Disregard used / non empty fields and the start field
                {
                    if(oneShown == true) //Already one empty field is shown
                        $(this).hide();
                    else
                    {
                        oneShown = true; //Show one empty field
                        $(this).show();
                    }
                }
            });
    }, 100);
});

//Init the map on page load
function mapLoaded(){
    var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 47.6062, lng: -122.3321},
    zoom: 10
  });
}

//calculate a route by the given waypoints in the input fields
function calcRoute() {
    //The start and end point
    let start = $("#start").val();

    let end = $("#end").val();

    //The waypoints
    let waypoints = [];
    $(".waypoint_input").each(function(){
        let val = $(this).val();
        if(val != "" && val != undefined && val != null)
            waypoints.push(val);
    });

    //Execute the query
    executePathQuery(start, waypoints, end);
}
//

$(document).ready(function(){
    $('select').material_select();
});


$(document).ready(function(){
  $('.carousel').carousel();
});

$('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 15 // Creates a dropdown of 15 years to control year
  });
