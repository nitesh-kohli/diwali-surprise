/**
 * ===================================================================
 *  DIWALI SURPRISE CONFIGURATION
 *  Customize your romantic Diwali surprise easily in this one file!
 * ===================================================================
 */

export const diwaliConfig = {
  // Couple Names
  herName: "My Love", // e.g. "Aarohi", "Priya", "My Jaan", "My Love"
  yourName: "Yours Forever", // e.g. "Rahul", "Yours Always", "With All My Love"
  
  // Audio Settings
  soundEnabledByDefault: false,
  romanticMelodyName: "Diwali Night Serenade",

  // STEP 1: LANDING SCREEN
  landing: {
    badge: "A Diwali Night Written Just for You ✨",
    greeting: "Happy Diwali, My Love ❤️",
    subtext: "Tonight, the night sky is painted with stars, but none can match the light you bring to my world. I have prepared a little surprise just for you.",
    buttonText: "Open Your Surprise",
    hint: "Tap with love to begin our journey",
  },

  // STEP 2: DIWALI MAGIC
  magic: {
    subtitle: "Sacred Lights of Diwali",
    title: "Lighting Up The Night For You",
    quote: "If I could wish for one thing this Diwali, it would always be your happiness.",
    description: "Watch each flame kindle with a prayer for your smile, your peace, and every dream your heart holds dear.",
    nextButtonText: "Read What My Heart Holds",
    diyaCount: 5,
  },

  // STEP 3: PERSONAL LOVE LETTER
  letter: {
    tag: "From My Heart To Yours",
    title: "A Letter in the Golden Glow",
    envelopePrompt: "Tap the royal seal to unfold my letter 💌",
    body: "Among all the lights in this world, you are my favourite. I may not always express everything perfectly, but you mean more to me than words can explain. I hope this Diwali brings you endless happiness, peace and beautiful memories. Happy Diwali, my love.",
    closing: "With all my love and devotion,",
    nextButtonText: "Light A Diya Together",
  },

  // STEP 4: INTERACTIVE DIYA
  interactiveDiya: {
    tag: "An Auspicious Moment",
    title: "Our Sacred Flame",
    instruction: "Touch the diya to ignite our eternal light 🪔",
    revealedMessage: "May your life always shine brighter than these lights. And may I always be there to celebrate your happiness.",
    flameLitBadge: "Illuminated With Love",
    nextButtonText: "A Final Diwali Wish For You",
  },

  // STEP 5: FINAL SCREEN
  finale: {
    badge: "Forever & Always",
    title: "One More Diwali With You",
    mainQuote: "One more Diwali, one more reason to be grateful that you are in my life. ❤️",
    subtext: "May our journey continue to be blessed with laughter, warm hugs, sweet memories, and a bond that outshines every galaxy.",
    tapPrompt: "✨ Tap anywhere on the screen to launch fireworks & floating hearts ✨",
    replayButtonText: "Relive Our Night 🔄",
    shareMessage: "Happy Diwali my love! You are the sweetest light of my life. 🪔❤️",
    fireworksButtonText: "Light Up The Sky ✨",
  },

  // STEP 6: CINEMATIC DIWALI FIREWORKS SHOW
  fireworksShow: {
    badge: "Cinematic Fireworks Celebration",
    title: "A Diwali Sky Lit Just For You",
    buttonPrompt: "Light Up The Sky ✨",
    startShowText: "Start Fireworks",
    pauseShowText: "Pause Show",
    resumeShowText: "Resume Show",
    stopShowText: "Stop Show",
    surpriseButtonText: "Surprise Me ❤️",
    touchHint: "✨ Touch anywhere in the night sky to launch a firework ✨",

    // Romantic messages appearing with each explosion
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

    backToStoryText: "Back to Surprise 🪔",
  },

  // REALISTIC DIWALI DECORATIVE STRING LIGHTS (BALCONY FESTOON STYLE)
  decorativeLights: {
    enabled: true,
    style: "festoon_catenary", // authentic hanging catenary wire with pointed teardrop LED bulbs
    colors: {
      gold: '#FFD36A',
      orange: '#FF7A00',
      red: '#FF1744',
      green: '#00E676',
      blue: '#00B0FF',
      pink: '#FF4081',
      purple: '#D500F9',
      warmWhite: '#FFF3E0',
    },
    twinkleDurationRange: [2.2, 4.2], // in seconds
    chaseWaveInterval: 4.5, // seconds between glowing wave pulses
  },

  // Navigation Labels
  steps: [
    { id: 1, label: "Welcome" },
    { id: 2, label: "Diwali Magic" },
    { id: 3, label: "Love Letter" },
    { id: 4, label: "Kindle Flame" },
    { id: 5, label: "Forever Wish" },
    { id: 6, label: "Fireworks Show ✨" },
  ],
};
