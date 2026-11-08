# A Diwali Night Written Just for You 🪔✨

A minimalist, luxury, romantic, and cinematic Diwali surprise website crafted especially for your girlfriend.

---

## 🖤 Design & Aesthetic

- **Pure Black Background (`#000000`) Everywhere**: Every section, screen, transition, and interactive mode is built on pure obsidian black. All colored backgrounds, purple gradients, and decorative panels have been completely removed.
- **Minimalist Luxury Palette**:
  - Background: `#000000`
  - Primary Text: `#FFFFFF`
  - Secondary Text: `#A1A1AA`
  - Pure Gold: `#FFD36A`
  - Warm Gold: `#E5A93D`
  - Vibrant colors reserved exclusively for pyrotechnics (fireworks and fuljhadi).
- **Cinematic Night Atmosphere**: Soft golden diya illumination, delicate floating gold embers, and hairline borders (`border-neutral-800` / `border-[#FFD36A]/25`).

---

## 🌟 The Experience Journey

1. **Step 1: Landing Screen**
   - Centered handcrafted royal Diya glowing softly in the pitch-black night.
   - Elegant typography with subtle golden shimmer: *"Happy Diwali, My Love ❤️"*.
   - Minimalist gold button: *"Open Your Surprise"*.

2. **Step 2: Diwali Magic**
   - Five auspicious diyas light up sequentially across the screen, each accompanied by a sweet singing bowl chime and golden sparkle.
   - Delicate romantic quote in pure gold:
     > *"If I could wish for one thing this Diwali, it would always be your happiness."*

3. **Step 3: Personal Love Letter**
   - Sleek, luxury minimalist card with hairline golden corner accents on pure black.
   - Pre-loaded with your heartfelt letter:
     > *"Among all the lights in this world, you are my favourite. I may not always express everything perfectly, but you mean more to me than words can explain. I hope this Diwali brings you endless happiness, peace and beautiful memories. Happy Diwali, my love."*
   - Minimalist "Save" button to keep the memory.

4. **Step 4: Interactive Diya**
   - A grand unlit Diya resting in stillness on black.
   - Touching the flame ignites a golden illumination flash and chime chord, revealing your promise:
     > *"May your life always shine brighter than these lights. And may I always be there to celebrate your happiness."*

5. **Step 5: Forever Wish**
   - Minimalist celebration screen with subtle floating hearts.
   - Glowing golden button: **"Light Up The Sky ✨"** to begin the full-screen fireworks and sparkler experience.

6. **Step 6: Cinematic Fireworks & Fuljhari (Sparklers) Show 🎆✨**
   - **Realistic Particle Fireworks Engine**:
     - One firework at a time for cinematic pacing.
     - Upward rocket ascent with glowing head and shedding spark trails.
     - Detonation with center flash, realistic gravity, and long connected burning streaks.
     - 7 distinct styles: Golden Willow, Colorful Peony, Chrysanthemum, Blue & Purple, Heart Firework, Rainbow, and Golden Crackling.
   - **Traditional Indian Fuljhari (Sparklers)**:
     - Realistic handheld sparkler sticks with white-hot combustion tips.
     - Emits thousands of needle sparks shooting in starbursts, branching into authentic secondary crackler sparks and falling naturally under gravity.
     - Interactive: tap any stick or press **"Light a Fuljhadi ✨"** to light it up with authentic synchronized crackling audio!
   - **Delicate Floating Quotes**:
     - At the moment of explosion, a subtle, ethereal quote in pure gold `#FFD36A` fades in gently and dissipates into the dark.
   - **Zero Grand Finale Clutter**:
     - The previous promotional-style closing card has been **completely removed**. The pyrotechnics themselves create the emotional impact.
   - **Minimalist Controls**:
     - Floating transparent black pill with clean Lucide icons: Resume/Pause, Stop, Light a Fuljhadi ✨, Surprise Me, and Volume/Mute.
     - Simple hint: `touch anywhere to launch`.

---

## ⚙️ Customization ([`src/config/diwaliConfig.js`](./src/config/diwaliConfig.js))

All text, quotes, and names are easily personalized in a single file:

```javascript
export const diwaliConfig = {
  herName: "My Love",        // Girlfriend's name / nickname
  yourName: "Yours Forever", // Your name / signature

  // Step 3 Love Letter
  letter: {
    body: "Among all the lights in this world, you are my favourite...",
  },

  // Fireworks Romantic One-Liners
  fireworksShow: {
    messages: [
      "My Favourite Human ❤️",
      "You Are My Sunshine",
      "My Beautiful Universe",
      "Forever My Happiness",
      "You Make Life Beautiful",
      "My Favourite Star",
      "Always Choose You",
      "My Heart Is Yours",
      "You Are My Magic",
      "My Forever Diwali",
    ],
  },
};
```

---

## 🚀 Running Locally

```bash
cd diwali-surprise
npm install
npm run dev
```

Visit `http://localhost:5173/` on your browser or mobile phone.
