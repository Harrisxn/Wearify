      if ( window.history.replaceState ) {
            window.history.replaceState( null, null, window.location.href );
          }
	var form = document.querySelector('form');
       
        // Add the event paramater to the function
        window.onload = function submit_geo_coords(event) {
        
          event.preventDefault(); // Stop normal submission of the form
        
          var x = document.getElementById("lat");
          var y = document.getElementById("long");
          var z = document.getElementById("test");
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
              console.log(position.coords);
              x.value = position.coords.latitude
              y.value = position.coords.longitude;
              
              document.forms['form2'].submit();
             
            });
           
          }
          // check if location permission is enabled 
          navigator.permissions.query({name:'geolocation'}).then(function(result) {
            // Will return ['granted', 'prompt', 'denied']
            console.log(result.state);
            // checks to see if user has prompt
            if (result.state = "prompt"){
            // if prompt then 
            setInterval(function(){ navigator.permissions.query({name:'geolocation'}).then(function(result) {}) }, 1000);
            setInterval(function(){ if(result.state == "denied"){window.location.href = "https://wearify.herokuapp.com/disabled_permissions" } }, 1000);
              }
           else {  
            if (result.state = "denied"){
              console.log("epic")
            }
           
              
            }
              });
         }
        
        