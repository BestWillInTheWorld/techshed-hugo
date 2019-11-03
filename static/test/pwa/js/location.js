const ANTARCTICA = {
    latitude : -70.853322,
    longitude : -1.022181,
    name : 'Antarctica',
    radiusKm: 3700
}
const ATLANTIC = {
    latitude  : 36.513172,
    longitude : -37.788556,
    name : 'The Atlantic',
    radiusKm: 3000
}
const FROME = {
    latitude: 51.2303104,
    longitude: -2.29376,
    name: 'Frome',
    radiusKm: 2
}
const RADSTOCK = {
    latitude: 51.291828,
    longitude: -2.448570,
    name: 'Radstock',
    radiusKm: 2
}

const PLACE = FROME;
const NO_PLACE = 'Where are you?'

function setupLocation(){
    console.log('setupLocation');
    var locationInfo = document.querySelector('#locationInfo');
    var locationTrace = document.querySelector('#locationTrace');
    var watchId;

    locationInfo.innerText = NO_PLACE;
    
    var appendLocation = (location, verb)=> {
        console.log('appendLocation');
        verb = verb || 'updated';
        var newLocation = document.createElement('p');
        newLocation.innerHTML = 'Location ' + verb + ': <a href="https://maps.google.com/maps?&z=15&q=' + location.coords.latitude + '+' + location.coords.longitude + '&ll=' + location.coords.latitude + '+' + location.coords.longitude + '" target="_blank">' + location.coords.latitude + ', ' + location.coords.longitude + '</a>';
        locationTrace.appendChild(newLocation);

        locationInfo.innerText = `You are ${!pointsAreNear(location.coords, PLACE, PLACE.radiusKm) ? 'NOT ' : ''}in ${PLACE.name}`;
    }
    
    if ('geolocation' in navigator) {
        console.log('Geolocation API Ok.');
        document.querySelector('#getLocation').addEventListener('click', function () {
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
        locationTrace.innerText = 'Geolocation API not supported.';
    }
}


function pointsAreNear(checkPoint, centerPoint, km) {
    var ky = 40000 / 360;
    var kx = Math.cos(Math.PI * centerPoint.latitude / 180.0) * ky;
    var dx = Math.abs(centerPoint.longitude - checkPoint.longitude) * kx;
    var dy = Math.abs(centerPoint.latitude  - checkPoint.latitude ) * ky;
    return Math.sqrt(dx * dx + dy * dy) <= km;
}