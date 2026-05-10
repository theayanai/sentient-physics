const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint;

// 1. Create the Physics Engine and make it global so other scripts can access it
window.engine = Engine.create();
window.world = window.engine.world;

// 2. Create the Renderer (Creates an invisible canvas over the screen)
const render = Render.create({
    element: document.body,
    engine: window.engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: 'transparent' // Hide the physics bodies, we only want to see the HTML
    }
});

// 3. Create Boundaries (Floor, Ceiling, Left, Right)
const wallOptions = { isStatic: true, render: { visible: false } };
const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 25, window.innerWidth, 50, wallOptions);
const leftWall = Bodies.rectangle(-25, window.innerHeight / 2, 50, window.innerHeight, wallOptions);
const rightWall = Bodies.rectangle(window.innerWidth + 25, window.innerHeight / 2, 50, window.innerHeight, wallOptions);
const ceiling = Bodies.rectangle(window.innerWidth / 2, -25, window.innerWidth * 2, 50, wallOptions);

Composite.add(window.world, [ground, leftWall, rightWall, ceiling]);

// 4. Map DOM Elements to Physics Bodies
window.physicsBodies = [];

// Function to spawn a block
window.spawnBlock = function(index) {
    const el = document.createElement('div');
    el.className = 'physical-block data new-anomaly';
    el.innerText = 'ANOMALY_' + Math.floor(Math.random() * 1000);
    document.getElementById('ui-layer').appendChild(el);

    const width = 200;
    const height = 50;

    const startX = (window.innerWidth / 2) + (Math.random() * 100 - 50);
    const startY = 50;

    const body = Bodies.rectangle(startX, startY, width, height, { restitution: 0.5, friction: 0.5 });
    body.domElement = el;
    window.physicsBodies.push(body);
    Composite.add(window.world, body);
};

window.spawnBlocks = function(count) {
    for (let i = 0; i < count; i++) {
        window.spawnBlock(i);
    }
};

window.initOriginalBlocks = function() {
    const domElements = document.querySelectorAll('.physical-block:not(.new-anomaly)');

    domElements.forEach((el, index) => {
        // Reset styles before measuring to get the true un-rotated size
        el.style.transform = 'none';
        el.style.left = '0px';
        el.style.top = '0px';

        // Measure the exact size of the HTML element
        const rect = el.getBoundingClientRect();
        
        // Fallback size if bounding rect fails on initial load before fonts render
        const width = rect.width || (el.classList.contains('core') ? 100 : 200);
        const height = rect.height || (el.classList.contains('core') ? 100 : 50);

        // Spawn them perfectly within the screen so they don't get lost
        const startX = (window.innerWidth / 2) + (Math.random() * 100 - 50);
        const startY = 50 + (index * 60); 

        let body;
        if (el.classList.contains('core')) {
            // If it's the core, make the physics body a bouncy circle
            body = Bodies.circle(startX, startY, width / 2, { restitution: 0.9, friction: 0.1 });
        } else {
            // Otherwise, make it a rectangle
            body = Bodies.rectangle(startX, startY, width, height, { restitution: 0.5, friction: 0.5 });
        }

        // Link the DOM element directly to the Physics Body object
        body.domElement = el;
        window.physicsBodies.push(body);
    });

    Composite.add(window.world, window.physicsBodies);
};

// Call once on initial load
window.initOriginalBlocks();

// 5. Add Mouse Dragging (Grab the blocks and throw them!)
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(window.engine, {
    mouse: mouse,
    constraint: { stiffness: 0.2, render: { visible: false } }
});
Composite.add(window.world, mouseConstraint);
render.mouse = mouse; // Keep mouse in sync with canvas

// 6. THE MAGIC LOOP: Update HTML positions to match Physics positions
Matter.Events.on(window.engine, 'afterUpdate', function() {
    window.physicsBodies.forEach(body => {
        const el = body.domElement;
        // Apply the exact X/Y coordinates and Rotation from the physics engine to the CSS
        el.style.left = body.position.x + 'px';
        el.style.top = body.position.y + 'px';
        el.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
    });
});

// 7. Run everything
Render.run(render);
const runner = Runner.create();
Runner.run(runner, window.engine);

// 8. Handle Screen Resize dynamically
window.addEventListener('resize', () => {
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;
    Matter.Body.setPosition(ground, { x: window.innerWidth / 2, y: window.innerHeight + 25 });
    Matter.Body.setPosition(rightWall, { x: window.innerWidth + 25, y: window.innerHeight / 2 });
    Matter.Body.setPosition(ceiling, { x: window.innerWidth / 2, y: -25 });
    Matter.Body.setPosition(leftWall, { x: -25, y: window.innerHeight / 2 });
});