var configs = {
    dataSampleInterval: 20, // milliseconds
    showLiveData: false
}

var t0 = new Date();

var lastOrientation = null;
var lastMotion = null;


var allSampledData = [];

var flagNextDatum = false;



// ============================================================ handlers and listeners

function deviceOrientationHandler(e) {
    // Compute orientation velocity because rotationRate looks like an acceleration
    if (lastOrientation) {
        e.dAlpha = shortestDistanceOnCircleSigned(e.alpha - lastOrientation.alpha, 360);
        e.dBeta = shortestDistanceOnCircleSigned(e.beta - lastOrientation.beta, 360);
        e.dGamma = shortestDistanceOnCircleSigned(e.gamma - lastOrientation.gamma, 360);
    }
    else {
        e.dAlpha = 0;
        e.dBeta = 0;
        e.dGamma =0;
    }

    lastOrientation = e;
    updateLiveData();

}


function deviceMotionHandler(e) {
    lastMotion = e;
    updateLiveData();
}

if (window.DeviceOrientationEvent && window.DeviceMotionEvent) {
    window.addEventListener('deviceorientation', deviceOrientationHandler, false);
    window.addEventListener('devicemotion', deviceMotionHandler, false);
}
else {
    document.getElementById('subtitle').innerText("Uh oh, this device doesn't support the game client");
}



// ============================================================ detecting gestures


// The spin detector looks for when the orientation.alpha goes past 360deg cumulatively
var spinDetector = {
    start: null,

    totalSpinSoFar: 0,

    running: false,
    waitingForDataBeforeStarting: false,


    // this is when we tell the player to spin in a circle
    initiate: function() {
        this.running = true;
        this.start = getLastDatum();

        if (!this.start) {
            this.waitingForDataBeforeStarting = true;
            return;
        }
        this.waitingForDataBeforeStarting = false;

        setText("message", "Spin in a circle!");
        setText("spin-detection", "NO");
        setText("spin-start", round(this.start.orientation.alpha, 2));
    },

    update: function() {
        if (this.waitingForDataBeforeStarting) {
            this.initiate();
            return;
        }

        var d = getLastDatum().orientation;

        // See how far the player has spun since the last update
        this.totalSpinSoFar += d.dAlpha;

        setText("spin-alpha", round(d.alpha, 2));
        setText("spin-dAlpha", round(d.dAlpha, 2));
        setText("spin-total", round(this.totalSpinSoFar, 2));

        if (Math.abs(this.totalSpinSoFar) > 355) {
            this.triggerDetection();
        }
    },

    triggerDetection: function() {
        setText("spin-detection", "YES");
        setText("message", "WOW YOU DID IT!");
        this.running = false;
    }

}


// The spin detector looks for when the orientation.alpha goes past 360deg cumulatively
var speedDetector = {
    start: null,
    running: false,
    waitingForDataBeforeStarting: false,
    maxAccelSoFar: 0,

    // this is when we tell the player to spin in a circle
    initiate: function() {
        this.running = true;
        this.start = getLastDatum();

        if (!this.start) {
            this.waitingForDataBeforeStarting = true;
            return;
        }
        this.waitingForDataBeforeStarting = false;

        setText("message", "Go really fast!");
        setText("speed-detection", "NO");
    },

    update: function() {
        if (this.waitingForDataBeforeStarting) {
            this.initiate();
            return;
        }

        var d = getLastDatum();

        var accel = Math.abs(abs3(d.acceleration));


        if (accel > this.maxAccelSoFar) {
            this.maxAccelSoFar = accel;
        }

        setText('speed-max-accel', this.maxAccelSoFar);

        if (this.maxAccelSoFar > 10000000000) {
            this.triggerDetection();
        }


    },

    triggerDetection: function() {
        setText("speed-detection", "YES");
        setText("message", "WOW YOU DID IT!");
        this.running = false;
    }

}

// ============================================================ math

function abs3(vector) {
    return Math.sqrt(
        vector.x * vector.x
        + vector.y * vector.y
        + vector.z * vector.z
    );
}

// ============================================================ outputting data or whatever

function setText(id, text) {
    document.getElementById(id).innerText = text;
}

function updateLiveData() {
    if (!configs.showLiveData) return;

    // ORIENTATION
    document.getElementById('liveData').remove();

    var a = document.getElementById('alpha');
    var b = document.getElementById('beta');
    var g = document.getElementById('gamma');

    e = lastOrientation;
    a.innerText = e.alpha;
    b.innerText = e.beta;
    g.innerText = e.gamma;

    // MOTION

    var ax = document.getElementById('accelerationX');
    var ay = document.getElementById('accelerationY');
    var az = document.getElementById('accelerationZ');

    var rAlpha = document.getElementById('rotationRateAlpha');
    var rBeta = document.getElementById('rotationRateBeta');
    var rGamma = document.getElementById('rotationRateGamma');

    var i = document.getElementById('interval');

    e = lastMotion;
    ax.innerText = e.acceleration.x;
    ay.innerText = e.acceleration.y;
    az.innerText = e.acceleration.z;
    rAlpha.innerText = e.rotationRate.alpha;
    rBeta.innerText = e.rotationRate.beta;
    rGamma.innerText = e.rotationRate.gamma;
    i.innerText = e.interval;
}

function getLastDatum() {
    return allSampledData[allSampledData.length - 1]
}

var printNextDatum = function(datum) {
    if (allSampledData.length === 0) return;
    if (!datum) return;

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

// function round(n, d) {
//     return Math.floor(n * Math.pow(10, d)) * Math.pow(10, -d);
// }


function pushData() {
    if (!lastMotion || !lastOrientation) return;

    allSampledData.push({
        time: (new Date()) - t0, // milliseconds
        orientation: lastOrientation,
        motion: lastMotion,
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
    printNextDatum(getLastDatum());
    flagNextDatum = false;

    // Detect gestures
    if (spinDetector.running) {
        spinDetector.update();
    }

    window.setTimeout(go, configs.dataSampleInterval);
}




window.onload = function() {
    if (!configs.showLiveData) {
        document.getElementById('liveData').remove();
    }
    spinDetector.initiate();
    go();
}
