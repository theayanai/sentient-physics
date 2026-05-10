# 🌌 Sentient Physics | Anomaly Containment Unit

![JavaScript](https://img.shields.io/badge/javascript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![HTML5](https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Matter.js](https://img.shields.io/badge/Matter.js-2D%20Physics-blue?style=for-the-badge)
![Gemini API](https://img.shields.io/badge/Gemini%20API-Agentic%20AI-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

**2D Physics Engine · Agentic AI Command Line · Mobile Gyroscope · Interactive UI**

A highly experimental, gravity-defying web sandbox where UI elements are treated as physical objects. Controlled entirely by an integrated **Gemini AI Terminal**, users can type natural language commands to dynamically alter the fundamental physics of the environment in real-time.

---

## 🌐 Live Demo  
👉 **[Enter the Containment Unit: Sentient Physics](https://theayanai.github.io/sentient-physics/)** *(Note: You must run this locally with your own API key for the AI Terminal to function).*

---

## 📸 Application Preview  
<img width="1919" height="876" alt="image" src="https://github.com/user-attachments/assets/19c80d5b-06e1-4dde-afca-3d3ac2fbaa41" />

### 🎛️ The Anomaly Sandbox  
<img width="1919" height="876" alt="image" src="https://github.com/user-attachments/assets/a6983df6-3841-4dfc-92dd-349ce348b21c" />
- Pure Matter.js 2D physics simulation hidden behind HTML `<div>` elements.  
- Interactive drag-and-drop mechanics.  
- DeviceOrientation API integration (Tilt your mobile phone to shift gravity).  

### 🧠 The God-Mode AI Terminal  
<img width="1919" height="874" alt="image" src="https://github.com/user-attachments/assets/527200a0-8e69-4197-82b8-dc461e07369c" />
- Custom glitch-aesthetic command line interface.  
- Agentic AI backend: Gemini parses natural language and outputs executable JSON.  
- Dynamic typing animations and cinematic status overlays.  

---

## 🕹️ How to Operate (Physics Commands)

The environment is controlled via the `ANOMALY_OVERRIDE_TERMINAL` at the top of the screen. You can use the quick-action buttons or type natural language commands. 

**Example AI Commands:**
* *"Turn off gravity"* -> Triggers Zero-G protocol.
* *"Make them heavy like rocks"* -> Alters the `restitution` (bounciness) to 0.
* *"Simulate moon gravity"* -> Adjusts the Y-axis gravity to 0.16.
* *"Turn everything into toys"* -> AI overrides the CSS and injects emoji skins.
* *"Explode!"* -> Applies a massive outward Matter.js force vector to all bodies.

---

## 🧠 Architecture & Tech Stack  

1. **Physics:** `Matter.js` (Engine, Render, Runner, Bodies, Composite, MouseConstraint).
2. **AI Brain:** Google Generative AI (`gemini-1.5-flash`) structured to output pure JSON.
3. **Hardware Integration:** Native JavaScript `deviceorientation` event listener.
4. **Styling:** Vanilla CSS3 (Viewport-locked, pure flexbox, dynamic clamp scaling).

---

## 📂 Repository Structure  

```text
📦 sentient-physics
 ┣ 📂 css/
 ┃ ┗ 📜 style.css            # Dark mode UI, terminal styling, overlay animations
 ┣ 📂 js/
 ┃ ┣ 📜 ai-terminal.js       # Gemini API logic, JSON parsing, typing animations
 ┃ ┣ 📜 dom-mapper.js        # Maps HTML <div>s to invisible physics bodies
 ┃ ┣ 📜 matter.min.js        # Core 2D physics library
 ┃ ┣ 📜 mobile-tilt.js       # Mobile gyroscope gravity manipulation
 ┃ ┗ 📜 physics-world.js     # Engine setup, boundaries, and mouse constraints
 ┣ 📜 .gitignore             # Secures the API key from being uploaded
 ┣ 📜 env.js                 # Local environment variables
 ┗ 📜 index.html             # Main DOM structure
```

---

## 💻 How to Run Locally  

### 1. Clone Repository
```bash
git clone [https://github.com/theayanai/sentient-physics.git](https://github.com/theayanai/sentient-physics.git)
cd sentient-physics
```

### 2. Secure Your API Key (CRITICAL)
You **must** create an environment file. Do NOT upload this file to GitHub.
Create a file named `env.js` in the root folder and add your Google Gemini API key:
```javascript
const CONFIG = {
    GEMINI_API_KEY: "YOUR_API_KEY_HERE"
};
```

### 3. Run a Local Server
**(Using Python):**
```bash
python -m http.server 8000
```
**(Using Node.js):**
```bash
npx http-server
```

### 4. Open in Browser
```text
http://localhost:8000
```

---

## 👨‍💻 Developer  

**Mohammed Ayan** Building full-stack AI architectures, real-time multiplayer servers... *and sadistic AI Dungeon Masters that trap you in the terminal.* 🎲

---

## ⭐ Support  

If you enjoyed smashing the anomalies or triggering zero gravity, consider giving this repository a ⭐ on GitHub!
