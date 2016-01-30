var lastOrientation = {alpha: 0, beta: 0, gamma: 0};

function deviceOrientationHandler(e) {
    var a = document.getElementById('alpha');
    var b = document.getElementById('beta');
    var g = document.getElementById('gamma');

    a.innerText = e.alpha;
    b.innerText = e.beta;
    g.innerText = e.gamma;

    lastOrientation = e;
}


// Device Orientation Event Listener
if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', deviceOrientationHandler, false);
}
else{
    console.log('Device orientation not supported in this browser.');
}


var logOrientation = function(e) {
    console.log('mouseup');
    var div = document.createElement('div');
    div.innerText = (new Date()).toTimeString()
        + ' ' + Math.round(lastOrientation.alpha)
        + ' ' + Math.round(lastOrientation.beta)
        + ' ' + Math.round(lastOrientation.gamma);
    document.body.appendChild(div);
};

window.addEventListener('mouseup', logOrientation);
window.addEventListener('touchend', logOrientation);
