# 📜 VNC (Virtual Name-Card) Official Project Specification

## 1. Project Identity & Vision

### 1.1 Project Name
**VNC (Virtual Name-Card)**

### 1.2 Core Definition
VNC is a high-performance, sensory-integrated static digital business card designed for elite designers and developers. It synthesizes **Poke-Holo** optical rendering, **Lanyard** physics, and **Bento Grid** information architecture into a single, cohesive digital asset.

### 1.3 Design Philosophy
* **Tactile Digitalism**: Bridging the gap between pixels and physical materials.
* **Sensory Feedback**: Utilizing device hardware (gyroscope/accelerometer) to create an "alive" interface.
* **Contextual Fluidity**: Seamlessly transitioning from a "hanging card" on mobile to a "professional dashboard" on desktop.

---

## 2. Technical Stack & Standards

### 2.1 The Stack
* **Framework**: Next.js 15 (App Router, SSG Mode).
* **Styling**: Tailwind CSS 4.0.
* **Motion Engines**: 
    * **Framer Motion**: Orchestrating 3D flips, layout projections, and state transitions.
    * **React-Spring**: Managing high-frequency physics (Lanyard swing) and sensor data smoothing.
* **Sensors**: Web Device Orientation API.
* **Deployment**: Edge-optimized (Vercel/Cloudflare Pages).

### 2.2 Aesthetic DNA
* **Material**: **Neo-Glassmorphism**. Frosted glass surfaces with a 0.2 alpha noise texture.
* **Optics**: **Holographic Foil**. Real-time color-shift using `mix-blend-mode: color-dodge` to simulate physical rainbow diffraction.
* **Typography**: High-contrast Sans-serif (e.g., Inter or Geist).

---

## 3. Functional Matrix

### 3.1 The Intelligent VNC Card
| Sub-Feature | Input Source | Logic | Output |
| :--- | :--- | :--- | :--- |
| **Holo-Sensory** | Gyroscope / Mouse | Maps tilt coordinates to CSS `background-position` variables. | Flowing rainbow luster |
| **Lanyard Physics** | Inertial Acceleration | Simulates a Pendulum constraint with a dynamic SVG string. | Natural card swinging |
| **Dimensional Flip** | Tap / Click | 180° `rotateY` transition using `backface-visibility: hidden`. | Reveal Contact/SNS |



### 3.2 Responsive Layout Strategy
* **Mobile (< 1024px) - Focus Mode**: 
    * Centrally suspended Lanyard card.
    * The background uses a blurred mesh gradient that reacts to phone tilt (inverted parallax).
* **Desktop (>= 1024px) - Portfolio Mode**:
    * **Left Column**: Fixed VNC Card (Lanyard detached, switched to 3D Mouse-follow).
    * **Right Column**: Bento Grid layout showcasing "Projects," "Skills," and "Social Feed."

---

## 4. Interaction Flow & Logic

### 4.1 The Flip Sequence
1.  **Front Side**: Displays Avatar, Name, Role, and the Dynamic Holographic Logo.
2.  **The Trigger**: A tactile click or tap on the card body.
3.  **Back Side**: 
    * **SNS Grid**: Bento-style interactive icons (GitHub, LinkedIn, Twitter).
    * **Direct Actions**: `Add to Contacts` (triggers vCard .vcf generation) | `Copy Email`.

### 4.2 The "Easter Egg": Gravity Collapse
* **Trigger Conditions**: 
    1. Rapidly tap the Avatar **5 times**.
    2. *OR* High-frequency phone shake (Acceleration threshold > 20).
* **Execution**: 
    * Card elements (name, icons) "deconstruct" and float outward in a zero-gravity simulation.
    * The holographic overlay expands to fill the entire viewport.
    * After 5 seconds, a "Magnetic Snap" effect pulls all fragments back into the original card structure.

---

## 5. Data Architecture & Privacy

### 5.1 Static Configuration (`vnc-config.ts`)
```typescript
export const VNC_DATA = {
  profile: {
    name: "Alex Design",
    role: "Fullstack Architect",
    avatar: "/assets/avatar.webp",
    vCard: {
      phone: "+123456789",
      email: "hello@vnc.design",
    }
  },
  theme: {
    primaryHolo: "linear-gradient(135deg, #ff0080, #7928ca, #0070f3)",
    lanyardColor: "#333",
    noiseOpacity: 0.15,
    physics: { stiffness: 260, damping: 20 }
  }
}
5.2 Privacy Protocols
Anti-Scrape Obfuscation: Contact details are Base64 encoded in the source and decoded only via client-side hydration upon user interaction.

6. Implementation Instructions (For AI/Developer)
Holographic Mapping: Implement a useVncSensor hook. Use a lerp (Linear Interpolation) function to smooth the transitions between raw sensor data and the CSS variables --vnc-x and --vnc-y.

Physics Simulation: For the Lanyard, utilize a pendulum motion formula. The card's rotation should lag slightly behind the "string's" movement to simulate mass.

Flip Mechanics: Use Framer Motion's AnimatePresence and rotateY for the flip. Ensure the back side is rendered with scaleX(-1) to maintain correct orientation during the 180-degree turn.

Bento Grid: Use CSS Grid with grid-auto-flow: dense. Tiles should have a slight hover-lift effect and glassmorphism styling.

Easter Egg: Track click-count via a useEffect hook. When triggered, map card elements to motion.div components with randomized animate={{ x: ..., y: ..., rotate: ... }} properties.