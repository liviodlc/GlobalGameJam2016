var configs = {
    dataSampleInterval: 100 // milliseconds
}

var t0 = new Date();

var lastOrientation = null;
var lastMotion = null;
var allSampledData = [];

var flagNextDatum = false;

// ============================================================ handlers and listeners

function deviceOrientationHandler(e) {
/*
    var a = document.getElementById('alpha');
    var b = document.getElementById('beta');
    var g = document.getElementById('gamma');

    a.innerText = e.alpha;
    b.innerText = e.beta;
*/

    lastOrientation = e;
}


function deviceMotionHandler(e) {
/*
    var ax = document.getElementById('accelerationX');
    var ay = document.getElementById('accelerationY');
    var az = document.getElementById('accelerationZ');

    var rAlpha = document.getElementById('rotationRateAlpha');
    var rBeta = document.getElementById('rotationRateBeta');
    var rGamma = document.getElementById('rotationRateGamma');

    var i = document.getElementById('interval');

    ax.innerText = e.acceleration.x;
    ay.innerText = e.acceleration.y;
    az.innerText = e.acceleration.z;

    rAlpha.innerText = e.rotationRate.alpha;
    rBeta.innerText = e.rotationRate.beta;
    rGamma.innerText = e.rotationRate.gamma;

    i.innerText = e.interval;

*/

    lastMotion = e;
}

if (window.DeviceOrientationEvent && window.DeviceMotionEvent) {
    window.addEventListener('deviceorientation', deviceOrientationHandler, false);
    window.addEventListener('devicemotion', deviceMotionHandler, false);
}
else{
    document.getElementById('subtitle').innerText("Uh oh, this device doesn't support the game client");
}

// ============================================================ outputting data

var printNextDatum = function(datum) {
    if (allSampledData.length === 0) return;

    var div = document.createElement('div');

    div.innerText = datum.time
        + '|' + flagNextDatum
        + '|' + Math.round(datum.orientation.alpha)
        + '|' + Math.round(datum.orientation.beta)
        + '|' + Math.round(datum.orientation.gamma)
        + '|' + Math.round(datum.rotationRate.alpha)
        + '|' + Math.round(datum.rotationRate.beta)
        + '|' + Math.round(datum.rotationRate.gamma)
        + '|' + round(datum.acceleration.x, 3)
        + '|' + round(datum.acceleration.y, 3)
        + '|' + round(datum.acceleration.z, 3)
        + '|' + Math.round(datum.interval)
        
    document.getElementById('data').appendChild(div);
};

function round(n, d) {
    return Math.floor(n * Math.pow(10, d)) * Math.pow(10, -d);
}


function pushData() {
    if (!lastMotion || !lastOrientation) return;

    allSampledData.push({
        time: (new Date()) - t0, // milliseconds
        orientation: lastOrientation,
        rotationRate: lastMotion.rotationRate,
        acceleration: lastMotion.acceleration,
        interval: lastMotion.interval
    })

}

var flagData = function(e) {
    flagNextDatum = true;
}


window.addEventListener('mouseup', flagData);
window.addEventListener('touchend', flagData);

function go() {
    pushData();
    printNextDatum(allSampledData[allSampledData.length - 1]);
    flagNextDatum = false;
    window.setTimeout(go, configs.dataSampleInterval);
}

go();
