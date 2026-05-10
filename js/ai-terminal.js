const terminalInput = document.getElementById('ai-input');
const terminalHeader = document.querySelector('.terminal-header');
const statusOverlay = document.getElementById('status-overlay');

window.isZeroG = false;

// --- YOUR TYPING ANIMATION FOR HINTS ---
const hints = [
    "try typing 'zero gravity'",
    "try typing 'explode'",
    "try typing 'make everything bouncy'",
    "try typing 'reverse gravity'",
    "try typing 'heavy like a rock'",
    "try typing 'detonate the anomalies'",
    "try typing 'scatter everything'",
    "try typing 'blow it all away'",
    "try typing 'containment breach'",
    "try typing 'fall to the right'",
    "try typing 'pull everything to the ceiling'",
    "try typing 'simulate moon gravity'",
    "try typing 'disable gravity simulator'",
    "try typing 'shift gravity left'",
    "try typing 'turn everything to rubber'",
    "try typing 'maximum elasticity'",
    "try typing 'make them drop like anvils'",
    "try typing 'increase mass to maximum'",
    "try typing 'initiate zero-g protocol'",
    "try typing 'system purge'",
    "try typing 'override physics engine'",
    "try typing 'stabilize environment'",
    "try typing 'turn everything into toys'",
    "try typing 'restore default anomalies'"
];

let currentHintIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let typingTimeout;

function typeHint() {
    if (document.activeElement === terminalInput && terminalInput.value.length > 0) {
        terminalInput.placeholder = "";
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(typeHint, 1000);
        return;
    }

    const currentHint = hints[currentHintIndex];

    if (isDeleting) {
        terminalInput.placeholder = currentHint.substring(0, currentCharIndex - 1);
        currentCharIndex--;
    } else {
        terminalInput.placeholder = currentHint.substring(0, currentCharIndex + 1);
        currentCharIndex++;
    }

    let speed = isDeleting ? 30 : 50;

    if (!isDeleting && currentCharIndex === currentHint.length) {
        speed = 2000; // Pause at the end of the phrase
        isDeleting = true;
    } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentHintIndex = (currentHintIndex + 1) % hints.length;
        speed = 500; // Pause before the next phrase
    }

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(typeHint, speed);
}

// Kick off the typing animation
typeHint();


// --- UI TOGGLES & QUICK ACTIONS ---
document.getElementById('terminal-toggle').addEventListener('click', () => {
    document.getElementById('terminal-container').classList.toggle('hidden');
});

document.querySelectorAll('.qa-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-cmd');
        executeCommand(cmd);
    });
});

// --- COMMAND PROCESSING ---
terminalInput.addEventListener('keydown', async function (e) {
    if (e.key === 'Enter') {
        e.preventDefault(); 
        const command = this.value.trim();
        
        if (command !== "") {
            this.value = "";
            this.placeholder = "Processing..."; 
            await executeCommand(command);
        }
    }
});

async function executeCommand(command) {
    terminalHeader.textContent = "ANOMALY_OVERRIDE_TERMINAL // PROCESSING ANOMALY...";
    terminalHeader.style.color = "#ffaa00";
    await sendToGemini(command);
}

async function sendToGemini(userCommand) {
    // UPDATED to gemini-2.5-flash
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${CONFIG.GEMINI_API_KEY}`;
    
    const prompt = `
    You are an AI Physics Controller for a Matter.js web environment.
    Translate the user's intent into ONE of the following strict JSON actions. Output ONLY the JSON.
    Critically, you must generate a short, descriptive "message" (e.g. "Objects now floating in air", "Physics restored to normal") that describes the state to flash on the screen.
    
    Valid actions:
    {"action": "modify_physics", "message": "...", "gravityX": 0, "gravityY": 1, "restitution": 0.5, "friction": 0.5, "frictionAir": 0.01, "timeScale": 1.0, "density": 0.001, "isStatic": false} (Use this to change any physics properties like bouncing, weight, air resistance, freezing objects, slow motion, or gravity for planets. You only need to include properties you want to change.)
    {"action": "apply_force", "message": "...", "x": 0.05, "y": -0.05} (To apply an immediate physical push, wind, or explosion to all objects. Use specific directional forces or leave x/y out for random explosions.)
    {"action": "spawn", "count": 10, "message": "..."} (To spawn/add/create new objects)
    {"action": "skin", "type": "toys", "message": "..."} (To turn things into toys)
    {"action": "restore", "message": "..."} (To restore anomalies, gravity, and all physics completely back to normal default state)
    
    Interpret the user's intent creatively and map it to the closest possible physics values. For example, if they want "heavy like rock", increase density to 0.01 and decrease restitution. If they want "slow motion", set timeScale to 0.2.
    
    User Command: "${userCommand}"
    `;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        if (!response.ok) throw new Error("Network Error");

        const data = await response.json();
        
        if (!data.candidates || data.candidates.length === 0) {
            throw new Error("Invalid response from Gemini API");
        }

        const aiResponseText = data.candidates[0].content.parts[0].text;
        
        const firstBrace = aiResponseText.indexOf('{');
        const lastBrace = aiResponseText.lastIndexOf('}');
        
        if (firstBrace === -1 || lastBrace === -1) {
            throw new Error("No JSON found in response");
        }
        
        const cleanJsonStr = aiResponseText.substring(firstBrace, lastBrace + 1);
        const jsonCommand = JSON.parse(cleanJsonStr);

        executePhysicsHack(jsonCommand);
        
        terminalHeader.textContent = `ANOMALY_OVERRIDE_TERMINAL // EXECUTED`;
        terminalHeader.style.color = "#00ffcc";

    } catch (error) {
        console.error(error);
        terminalHeader.textContent = "ANOMALY_OVERRIDE_TERMINAL // COMMAND FAILED OR INVALID.";
        terminalHeader.style.color = "#ff003c";
        flashScreenMessage("ERROR: UNKNOWN COMMAND");
    }
}

function executePhysicsHack(cmd) {
    // FIXED scope bug: Removed "window." so it directly talks to Matter.js
    if (typeof engine === 'undefined' || typeof world === 'undefined') return;

    if (cmd.message) flashScreenMessage(cmd.message);

    if (cmd.action === "modify_physics") {
        if (cmd.gravityX !== undefined) engine.gravity.x = cmd.gravityX;
        if (cmd.gravityY !== undefined) engine.gravity.y = cmd.gravityY;
        
        window.isZeroG = (engine.gravity.x === 0 && engine.gravity.y === 0);

        if (cmd.timeScale !== undefined) {
            engine.timing.timeScale = cmd.timeScale;
        }

        const bodies = Matter.Composite.allBodies(world);
        bodies.forEach(body => {
            // Only affect bodies with a domElement (our blocks, not the boundary walls)
            if (body.domElement) {
                if (cmd.restitution !== undefined) body.restitution = cmd.restitution;
                if (cmd.friction !== undefined) body.friction = cmd.friction;
                if (cmd.frictionAir !== undefined) body.frictionAir = cmd.frictionAir;
                if (cmd.density !== undefined) Matter.Body.setDensity(body, cmd.density);
                if (cmd.isStatic !== undefined) Matter.Body.setStatic(body, cmd.isStatic);
            }
        });
    }
    else if (cmd.action === "apply_force") {
        const bodies = Matter.Composite.allBodies(world);
        bodies.forEach(body => {
            if (!body.isStatic && body.domElement) {
                // If x and y are missing, do a random explosion
                let fx = cmd.x !== undefined ? cmd.x : (Math.random() - 0.5) * 0.05;
                let fy = cmd.y !== undefined ? cmd.y : (Math.random() - 0.5) * 0.05;
                
                // Scale force by mass so it affects everything proportionally
                fx *= body.mass;
                fy *= body.mass;

                Matter.Body.applyForce(body, body.position, { x: fx, y: fy });
            }
        });
    }
    else if (cmd.action === "spawn") {
        if (window.spawnBlocks) {
            window.spawnBlocks(cmd.count || 1);
        }
    }
    else if (cmd.action === "restore") {
        // Reset engine properties
        engine.gravity.x = 0;
        engine.gravity.y = 1;
        window.isZeroG = false;
        engine.timing.timeScale = 1.0;
        
        // Remove dynamically spawned elements from the DOM entirely
        document.querySelectorAll('.new-anomaly').forEach(el => el.remove());
        
        // Remove all current physics bodies from the Matter world
        if (window.physicsBodies && window.physicsBodies.length > 0) {
            Matter.Composite.remove(world, window.physicsBodies);
        }
        
        // Reset the array
        window.physicsBodies = [];
        
        // Re-initialize the original blocks at their starting coordinates
        if (window.initOriginalBlocks) {
            window.initOriginalBlocks();
        }
        
        // Ensure toy skins are removed from the original elements
        const domElements = document.querySelectorAll('.physical-block');
        domElements.forEach((el) => {
            el.classList.remove('toy-mode');
            if (el.dataset.originalText) el.innerText = el.dataset.originalText;
        });
    }
    else if (cmd.action === "skin") {
        const domElements = document.querySelectorAll('.physical-block');
        const toys = ['🧸', '🚗', '🎲', '🏀', '🤖'];
        
        domElements.forEach((el, index) => {
            if (cmd.type === "toys") {
                if (!el.dataset.originalText) el.dataset.originalText = el.innerText;
                el.classList.add('toy-mode');
                el.innerText = toys[index % toys.length];
            } else {
                el.classList.remove('toy-mode');
                if (el.dataset.originalText) el.innerText = el.dataset.originalText;
            }
        });
    }
}

function flashScreenMessage(text) {
    if (!statusOverlay) return;
    statusOverlay.textContent = text;
    statusOverlay.classList.add('show');
    
    setTimeout(() => {
        statusOverlay.classList.remove('show');
    }, 4000);
}