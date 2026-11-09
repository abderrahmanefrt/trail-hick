# 🏔️ TRAILVISION — Explore Nature. Discover How Machines See.

**TRAILVISION** is an interactive, cinematic adventure-themed educational web application designed to teach visitors how **Computer Vision Convolution** works—without ever mentioning technical mathematical jargon until the final revelation!

Visitors become alpine explorers traveling across four seasonal wilderness environments. Each season disguises a fundamental computer vision operation as an engaging outdoor activity. Only after completing all four missions does the dramatic truth get revealed: **“You have just discovered how CONVOLUTION works!”**

---

## 🗺️ The Four Seasonal Missions & Their Hidden Science

| Season & Mission | Color & Atmosphere | Disguised Outdoor Activity | Real Computer Vision Principle |
| :--- | :--- | :--- | :--- |
| **🌸 SPRING**<br>*The Flower Hunter* | Sage Green (`#79A98A`)<br>Blooming alpine forest & sunlight | **Interactive Scanning Lens**: Move a magnifying reticle across the forest to detect matching wildflower geometries. | **Pattern Recognition & Feature Extraction**:<br>Local cross-correlation filters scanning an image for specific geometric signatures. |
| **☀️ SUMMER**<br>*The Sunlight Explorer* | Warm Orange (`#FFB347`)<br>Canyon trail, turquoise water & solar glare | **Time-of-Day Simulator & Sensor**: Shift the sun from dawn to night; inspect numerical matrix values from 0 to 255. | **Pixel Intensity & Digital Quantization**:<br>Digital images as numerical brightness matrices where 0 is shadow and 255 is blinding solar glare. |
| **🍂 FALL**<br>*The Hidden Trail* | Burnt Orange (`#B86B3D`)<br>Autumn ridges, crimson leaves & hidden trails | **3-Way Vision Modes**: Switch between Normal, Boundary, and Enhanced Vision to follow trail cairns buried under leaves. | **Edge Detection & Sobel Gradients**:<br>Horizontal and vertical derivative operators highlighting abrupt brightness transitions along contours. |
| **❄️ WINTER**<br>*The Frozen Vision* | Icy Blue (`#6286A8`)<br>Snowy mountain peak & swirling blizzard | **Alpine Goggle Filter**: Adjust neighbor-averaging blur to pierce through snow grain and locate the refuge beacon. | **Spatial Smoothing & Kernel Normalization**:<br>Weighted neighborhood averages that eliminate random noise while avoiding whiteout saturation. |

---

## 🤖 Animated Hiking Companion: TRAILBOT

A friendly, expressive alpine explorer who accompanies visitors with contextual guidance, humorous hiking observations, and hints—while never breaking the educational immersion:
- **Spring**: Wears a wildflower pinned to his botanical expedition hat.
- **Summer**: Sports polarized reflective sunglasses and safari visor.
- **Fall**: Wears a cozy checked knit autumn scarf.
- **Winter**: Dons a thermal beanie, snow goggles, and an alpine parka.

---

## 🔬 The Grand Revelation & Interactive Kernel Laboratory

Unlocked only after all 4 seasonal badges are earned:
1. **Dramatic Cinematic Reveal**:
   - *“YOU’VE BEEN SEEING THE WORLD DIFFERENTLY…”*
   - *“YOU HAVE JUST DISCOVERED CONVOLUTION!”*
2. **The 4-Way Conceptual Synthesis**: Connects every season to its role in modern artificial intelligence, self-driving cars, drone mountain search-and-rescue, and satellite imaging.
3. **Interactive 3×3 Kernel Laboratory**:
   - Live pixel convolution running directly on HTML5 Canvas.
   - Presets for **Box Blur**, **Gaussian Smoothing**, **Sobel Ridge Detection**, **Sharpening**, and **3D Hillshade Emboss**.
   - **Custom Kernel Editor**: Modify any of the 9 numbers or divisor and watch the image transform in real-time.

---

## 🛠️ Tech Stack & Architecture

- **UI Framework**: React 19 + TypeScript 5.7 (strict mode)
- **Bundler**: Vite 6
- **Styling**: Tailwind CSS 4 + Seasonal Design Tokens
- **Graphic Processing**: Native HTML5 Canvas 2D (`ImageData` buffer manipulation for genuine mathematical convolution)
- **Audio Synthesis**: Pure Web Audio API oscillators (altimeter pitch tones & milestone chimes without external audio files)
- **Particle System**: Lightweight seasonal canvas engine (spring petals, summer shimmer, fall leaves, winter snowflakes)
- **Storage**: Safe `localStorage` progress tracking with versioning and reset capability

---

## 🚀 Running the Project Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Open your browser at **[http://localhost:5173/](http://localhost:5173/)**.

To create a production build:
```bash
npm run build
```

---

## 📄 License

Educational open-source project — Designed to make computer vision accessible and unforgettable for everyone.
