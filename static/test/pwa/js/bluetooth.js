function setupBluetooth(){

    document.querySelector('#getBluetooth').addEventListener('click', () =>
    {
        console.log('requesting bluetooth devices');
        
        navigator.bluetooth.requestDevice({
            acceptAllDevices: true
        })
        .then(device => {
            console.log(device);
        })
        .catch(error => {
            console.log(error);
        });
    })
}