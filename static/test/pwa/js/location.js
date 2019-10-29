
function setupLocation(){
    console.log('setupLocation');
    var target = document.querySelector('#target');
    var watchId;
    
    var appendLocation = (location, verb)=> {
        console.log('appendLocation');
        verb = verb || 'updated';
        var newLocation = document.createElement('p');
        newLocation.innerHTML = 'Location ' + verb + ': <a href="https://maps.google.com/maps?&z=15&q=' + location.coords.latitude + '+' + location.coords.longitude + '&ll=' + location.coords.latitude + '+' + location.coords.longitude + '" target="_blank">' + location.coords.latitude + ', ' + location.coords.longitude + '</a>';
        target.appendChild(newLocation);
    }
    
    if ('geolocation' in navigator) {
        console.log('Geolocation API Ok.');
        document.querySelector('#askButton').addEventListener('click', function () {
            console.log('Requesting Geolocation...');
            navigator.geolocation.getCurrentPosition(function (location) {
                console.log('ReqGot location');
                window.navigator.vibrate(100);
                appendLocation(location, 'fetched');
            });
            watchId = navigator.geolocation.watchPosition(appendLocation);
        });
    } else {
        console.log('Geolocation API not supported.');
        target.innerText = 'Geolocation API not supported.';
    }
}