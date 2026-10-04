import { SurpriseConfig } from '@/types';

export const defaultConfig: SurpriseConfig = {
  recipientName: 'Harshita',
  nickname: 'Harshu',
  passwords: ['harshu', 'harshita', 'bestie', '1234', 'cutie', 'hbd'],
  passwordHint: 'Try your favorite nickname or the name everyone calls you! (hint: harshu 💖)',
  // Curated aesthetic friendship photo for puzzle
  puzzleImage: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=1200&auto=format&fit=crop',
  puzzleGridSize: 3,
  question: {
    text: 'What is our official unofficial superpower when we are together?',
    options: [
      'Telepathic gossiping across a crowded room 👀',
      'Laughing until our stomachs hurt at 2 AM 🌙',
      'Creating absolute chaos wherever we go 💃✨',
      'All of the above and being irreplaceable friends forever ❤️'
    ],
    correctIndex: 3,
    hint: 'Think about all our memories... is just one answer ever enough for us? 🤭',
    explanation: 'Correct! From 2 AM laughter to unspoken telepathy, nothing compares to our bond! ✨',
    acceptsFreeText: true,
    freeTextKeywords: ['all', 'love', 'chaos', 'forever', 'everything', 'best', 'friend', 'telepathy']
  },
  birthdayHeadline: 'Happy Birthday, Harshita! 🎂✨',
  birthdayQuote: '“Some people become memories… and some memories become the reason we smile every single day.” ❤️',
  birthdayLetter: {
    greeting: 'Dearest Harshu,',
    paragraphs: [
      'Wishing the happiest, most magical birthday to someone who brings so much sunshine, laughter, and genuine warmth into my life. Every chapter is brighter because you are in it.',
      'Thank you for being the person I can always count on, for the endless inside jokes, the midnight debriefs, the spontaneous adventures, and for always understanding me even when no words are spoken.',
      'May this new year of your life bring you boundless joy, fearless adventures, wild success, and all the love your beautiful heart can hold. You deserve all the stars in the night sky!'
    ],
    highlightQuote: '“To more spontaneous road trips, endless coffee dates, uncontrollable giggles, and a lifetime of shared memories.” 🥂✨',
    closing: 'With all my love and warmest hugs,',
    sender: 'Your Forever Bestie ❤️',
    postScript: 'P.S. Make a huge wish when you blow out the candles — you truly deserve the world! 🎈🌟'
  },
  memories: [
    {
      id: 'm1',
      title: 'The Beginning 🌸',
      date: 'Day 1 & Counting',
      caption: 'And somehow, this random day turned into one of my most cherished friendships in the whole world.',
      imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1000&auto=format&fit=crop',
      tag: '🌸 Origins',
      location: 'Where it all started',
      likes: 24,
      highlight: 'The day we clicked instantly'
    },
    {
      id: 'm2',
      title: 'Midnight Debriefs & Laughter 🌙',
      date: 'Late Nights',
      caption: 'The talks where we solved zero life problems but laughed until we were crying.',
      imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1000&auto=format&fit=crop',
      tag: '🌙 2 AM Talks',
      location: 'Under the stars',
      likes: 42,
      highlight: 'Laughing so hard we couldn’t breathe'
    },
    {
      id: 'm3',
      title: 'Pure Chaos & Shenanigans 🤪',
      date: 'Every Single Outing',
      caption: 'Proof that when we are left unsupervised, 100% pure comedy is guaranteed.',
      imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=1000&auto=format&fit=crop',
      tag: '💃 Chaos Duo',
      location: 'Everywhere together',
      likes: 38,
      highlight: 'Nobody else gets our humor'
    },
    {
      id: 'm4',
      title: 'Golden Hour Glow 🌅',
      date: 'Sunsets & Serenity',
      caption: 'Quiet moments, deep conversations, and realizing how lucky I am to have you in my corner.',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop',
      tag: '✨ Golden Hour',
      location: 'Chasing sunsets',
      likes: 56,
      highlight: 'Unmatched peace'
    },
    {
      id: 'm5',
      title: 'Coffee, Secrets & Dreams ☕',
      date: 'Weekend Cafe Hangs',
      caption: 'Two coffees, four hours of conversation, and dreams of conquering the world together.',
      imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1000&auto=format&fit=crop',
      tag: '☕ Cafe Stories',
      location: 'Our favorite corner',
      likes: 31,
      highlight: 'Best venting sessions'
    },
    {
      id: 'm6',
      title: 'To a Million More Chapters 🥂',
      date: 'Forever & Always',
      caption: 'No matter where life takes us, you will always be family. Cheers to your special day!',
      imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop',
      tag: '❤️ Forever Bond',
      location: 'In each other’s hearts',
      likes: 99,
      highlight: 'Here for life'
    }
  ],
  themeColor: 'purple'
};
