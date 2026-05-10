// js/dom-mapper.js
window.domBodies = [];

window.startPhysics = () => {
    if(!engine) window.initPhysics();
    
    const elements = document.querySelectorAll('.physical');
    
    elements.forEach(el => {
        // 1. Get exact position and size
        const rect = el.getBoundingClientRect();
        
        // 2. Lock the element's size via CSS
        el.style.width = rect.width + 'px';
        el.style.height = rect.height + 'px';
        
        // 3. Create Matter.js body
        // Matter.js bodies are positioned from their center, while DOM is top-left.
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        
        const body = Bodies.rectangle(cx, cy, rect.width, rect.height, {
            restitution: 0.5, // bouncy
            friction: 0.1,
            frictionAir: 0.01
        });
        
        World.add(world, body);
        
        // Save the mapping
        window.domBodies.push({ el, body, initWidth: rect.width, initHeight: rect.height });
    });
    
    // Now switch them to absolute positioning
    elements.forEach(el => {
        el.classList.add('physical-active');
        // Reset top/left to 0, use transform for performance
        el.style.top = '0px';
        el.style.left = '0px';
    });
    
    // Sync loop
    runner = Runner.create();
    Runner.run(runner, engine);
    
    requestAnimationFrame(syncDom);
};

function syncDom() {
    window.domBodies.forEach(({ el, body, initWidth, initHeight }) => {
        const angle = body.angle;
        // Translate to the body's center, offset by half the width/height to align it.
        const tx = body.position.x - initWidth / 2;
        const ty = body.position.y - initHeight / 2;
        
        el.style.transform = `translate(${tx}px, ${ty}px) rotate(${angle}rad)`;
    });
    
    requestAnimationFrame(syncDom);
}