// Listens to the device's physical gyroscope
window.addEventListener("deviceorientation", (event) => {
    // We only alter gravity if the engine exists and we aren't in "Zero G" mode
    if (typeof engine !== 'undefined' && !window.isZeroG) {
        // gamma is the left-to-right tilt in degrees, where right is positive
        const tiltX = event.gamma; 
        // beta is the front-to-back tilt in degrees, where front is positive
        const tiltY = event.beta; 

        // Map the degrees (-90 to 90) to Matter.js gravity forces (-1 to 1)
        let gravityX = tiltX / 90;
        let gravityY = tiltY / 90;

        // Apply to the physics engine
        engine.gravity.x = gravityX;
        engine.gravity.y = gravityY;
    }
}, true);