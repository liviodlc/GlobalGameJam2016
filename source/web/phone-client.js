var configs = {
    dataSampleInterval: 20, // milliseconds
    showLiveData: true,
    printDataLog: false,
}

var t0 = new Date();

var lastOrientation = null;
var lastMotion = null;


var allSampledData = [];

var flagNextDatum = false;

var maxAccelerations = {x:0, y: 0, z: 0}
var minAccelerations = {x:0, y: 0, z: 0}

var maxAccel = 0;
var maxAccelWithG = 0;
var orientdiffDuringMax = 0;


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

    if (e.acceleration.x > maxAccelerations.x) { maxAccelerations.x = e.acceleration.x; }
    if (e.acceleration.x < minAccelerations.x) { minAccelerations.x = e.acceleration.x; }
    if (e.acceleration.y > maxAccelerations.y) { maxAccelerations.y = e.acceleration.y; }
    if (e.acceleration.y < minAccelerations.y) { minAccelerations.y = e.acceleration.y; }
    if (e.acceleration.z > maxAccelerations.z) { maxAccelerations.z = e.acceleration.z; }
    if (e.acceleration.z < minAccelerations.z) { minAccelerations.z = e.acceleration.z; }


    var absAccel = abs3(e.acceleration);
    if (absAccel > maxAccel) {
        maxAccel = absAccel;
        maxAccelWithG = abs3(e.accelerationIncludingGravity)

        orientdiffDuringMax = angleBetween(
            normalizeToG(e.acceleration),
            e.accelerationIncludingGravity
        );
        // orientdiffDuringMax = abs3abg(lastOrientation);
    }

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


var detectors = {};
// The spin detector looks for when the orientation.alpha goes past 360deg cumulatively

detectors.spin = {
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


detectors.speed = {
    requiredAccel: 20,

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

        if (this.maxAccelSoFar > this.requiredAccel) {
            this.triggerDetection();
        }
    },

    triggerDetection: function() {
        setText("speed-detection", "YES");
        setText("message", "WOW YOU DID IT!");
        setBgColor('green');
        this.running = false;
    }
}

detectors.sustainedSpeed = {
    requiredAccel: 20,
    numFramesRequired: 10,

    start: null,
    running: false,
    waitingForDataBeforeStarting: false,
    maxAccelSoFar: 0,
    maxFramesSoFar: 0,
    numFramesAttained: 0,

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

        if (accel > this.requiredAccel) {
            this.numFramesAttained += 1;
        }
        else {
            if (this.numFramesAttained > this.maxFramesSoFar) {
                this.maxFramesSoFar = this.numFramesAttained;
            }
            this.numFramesAttained = 0;
        }


        setText('sustained-speed-max-accel', this.maxAccelSoFar);
        setText('sustained-speed-num-frames', this.numFramesAttained);

        if (this.numFramesAttained >= this.numFramesRequired) {
            this.triggerDetection();
        }
    },

    triggerDetection: function() {
        setText("speed-detection", "YES");
        setText("message", "WOW YOU DID IT!");
        setBgColor('green');
        this.running = false;
    }
}

// Like the sustained one, but specifically for height
detectors.maxVerticalAccel = {
    requiredAccel: 20,
    numFramesRequired: 10,

    start: null,
    running: false,
    waitingForDataBeforeStarting: false,
    maxAccelSoFar: 0,
    maxFramesSoFar: 0,
    numFramesAttained: 0,

    // this is when we tell the player to spin in a circle
    initiate: function() {
        this.running = true;
        this.start = getLastDatum();

        if (!this.start) {
            this.waitingForDataBeforeStarting = true;
            return;
        }
        this.waitingForDataBeforeStarting = false;

        setText("message", "Raise your arms up!");
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

        if (accel > this.requiredAccel) {
            this.numFramesAttained += 1;
        }
        else {
            if (this.numFramesAttained > this.maxFramesSoFar) {
                this.maxFramesSoFar = this.numFramesAttained;
            }
            this.numFramesAttained = 0;
        }


        setText('sustained-speed-max-accel', this.maxAccelSoFar);
        setText('sustained-speed-num-frames', this.numFramesAttained);

        if (this.numFramesAttained >= this.numFramesRequired) {
            this.triggerDetection();
        }
    },

    triggerDetection: function() {
        setText("speed-detection", "YES");
        setText("message", "WOW YOU DID IT!");
        setBgColor('green');
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
function abs3abg(abg_vector) {
    // this is a hack
    return abs3({
        x: abg_vector.alpha,
        y: abg_vector.beta,
        z: abg_vector.gamma
    })
}

function normalizeToG(xyz_vector) {
    var sphere_vector = cart2sphere(xyz_vector);
    sphere_vector.r = 9.8;
    return sphere2cart(sphere_vector);
}

// function add3(v1, v2) {
//     return {
//         x: v1.x + v2.x,
//         y: v1.y + v2.y,
//         :z v1.z + v2.z,
//     }
// }
// function subtract3(v1, v2) {
//     return {
//         x: v1.x - v2.x,
//         y: v1.y - v2.y,
//         z: v1.z - v2.z,
//     }
// }
function dot3(v1, v2) {
    return v1.x*v2.x + v1.y*v2.y + v1.z*v2.z
}
function angleBetween(v1, v2) {
    return degrees(Math.acos(dot3(v1, v2) / (abs3(v1) * abs3(v2))));
}

function cart2sphere(vector) {
    var r = abs3(vector);
    return {
        r: r,
        theta: Math.atan2(vector.y, vector.x),
        phi: Math.acos(vector.z / r)

    }
}

function sphere2cart(vector) {
    return {
        x: vector.r * Math.sin(vector.phi) * Math.cos(vector.theta),
        y: vector.r * Math.sin(vector.phi) * Math.sin(vector.theta),
        z: vector.r * Math.cos(vector.phi)
    }
}

// Convert between degrees and radians
function radians(deg) {
  return 2*Math.PI*deg/360;
}
function degrees(rad) {
  return 360*rad/(2*Math.PI);
}

// ============================================================ outputting data or whatever

function setText(id, text) {
    document.getElementById(id).innerText = text;
}

function setBgColor(color) {
    document.body.style.backgroundColor = color;
}

function updateLiveData() {
    if (!configs.showLiveData) return;

    // ORIENTATION

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

    setText('maxAccelerationX', round(maxAccelerations.x), 3);
    setText('maxAccelerationY', round(maxAccelerations.y), 3);
    setText('maxAccelerationZ', round(maxAccelerations.z), 3);
    setText('minAccelerationX', round(minAccelerations.x), 3);
    setText('minAccelerationY', round(minAccelerations.y), 3);
    setText('minAccelerationZ', round(minAccelerations.z), 3);

    var absAccel = abs3(e.acceleration);
    var absAccelG = abs3(e.accelerationIncludingGravity);

    setText('absAccel', round(absAccel, 2));
    setText('absAccelG', round(absAccelG, 2));

    if (absAccel > 20) {
        var orientdiff = angleBetween(
            normalizeToG(e.acceleration),
            e.accelerationIncludingGravity
        );
        // var orientdiff = abs3abg(lastOrientation);
        setText('orientdiff', round(orientdiff, 2));
    
}    else {
        setText('orientdiff', ' ')
    }

    setText('maxAccel', round(maxAccel, 2))
    setText('maxAccelWithG', round(maxAccelWithG, 2))
    if (maxAccel > 8)
        setText('orientdiffDuringMax', round(orientdiffDuringMax, 2))
}

function getLastDatum() {
    return allSampledData[allSampledData.length - 1]
}

var printNextDatum = function(datum) {
    if (!configs.printDataLog) return;

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
    for (var detector in detectors) {
        if (detectors[detector].running) {
            detectors[detector].update();
        }
    }

    window.setTimeout(go, configs.dataSampleInterval);
}




window.onload = function() {
    if (!configs.showLiveData) {
        document.getElementById('liveData').remove();
    }

    // detectors.spin.initiate();
    // detectors.speed.initiate();
    detectors.maxVerticalAccel.initiate();

    go();
}
