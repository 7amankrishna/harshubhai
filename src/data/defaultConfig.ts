import { SurpriseConfig } from '@/types';

export const defaultConfig: SurpriseConfig = {
  recipientName: 'Harshita',
  nickname: 'MenduVada',
  passwords: [
    'menduvada',
    'meduvada',
    'mendu vada',
    'medu vada',
    'mendu_vada',
    'medu_vada',
    'harshu',
    'harshita'
  ],
  passwordHint: 'Think of your absolute favorite crispy, golden-fried South Indian snack 🫓 (hint: MenduVada 😂)',
  // Custom puzzle image provided by Aman
  puzzleImage: 'https://files.amankrishna.in/2026/WhatsApp%20Image%202026-10-04%20at%2010.57.08%20PM%20(1).jpeg',
  puzzleGridSize: 3,
  question: {
    text: 'What is your favorite food?',
    options: [
      '🧠 Human brain',
      '🧠 Human brain in any combination',
      '🫓 Menduvada',
      '🍽️ Something suspicious'
    ],
    correctIndex: 2, // 🫓 Menduvada
    hint: 'You might crave human brains on Mondays, but your true love is round with a hole in the middle 🫓',
    explanation: 'Bingo! 🫓 Menduvada supremacy forever! You passed the official test!',
    acceptsFreeText: true,
    freeTextKeywords: ['menduvada', 'meduvada', 'mendu vada', 'medu vada', 'vada', 'mendu']
  },
  birthdayHeadline: 'Happy Birthday, MenduVada! 🎂🫓✨',
  birthdayQuote: '“Some people become memories… and some memories become the reason we smile (and crave Menduvada at 2 AM).” ❤️',
  birthdayLetter: {
    greeting: 'Dearest Harshita (aka MenduVada 🫓),',
    paragraphs: [
      'Wishing the happiest, most chaotic, and most magical birthday to my favorite human (who occasionally craves human brains 🧠)! Another year of you blessing the world with your unmatched energy, ridiculous laughs, and golden heart.',
      'Thank you for being the one person I can always share the dumbest inside jokes with, debate the most absurd life theories at midnight, and count on no matter what. Having you as a best friend makes everyday life a whole comedy special.',
      'May this new year bring you endless plates of crispy hot Menduvadas, wild adventures, unstoppable success, and all the happiness in the entire universe. Stay your wonderfully chaotic, beautiful self always!'
    ],
    highlightQuote: '“To more midnight debriefs, unfiltered laughter, telepathic eye contact, and a lifetime of Menduvada runs!” 🥂🫓✨',
    closing: 'Happy Birthday, MenduVada ❤️',
    sender: '— Aman',
    postScript: 'P.S. Make a massive wish on the cake candles — and no, wishing for unlimited human brains doesn’t count! 🎈🌟'
  },
  memories: [
    {
      id: 'm1',
      title: 'The Origin of Chaos 🌸',
      date: 'Chapter 1',
      caption: 'Where two certified crackheads met and realized the world was not ready for this duo.',
      imageUrl: 'https://files.amankrishna.in/2026/WhatsApp%20Image%202026-10-04%20at%2010.57.08%20PM%20(1).jpeg',
      tag: '🌸 Origins',
      location: 'Where it all began',
      likes: 48,
      highlight: 'The exact moment we realized we shared the exact same braincell.'
    },
    {
      id: 'm2',
      title: '2 AM Food Cravings & Deep Talks 🌙',
      date: 'Late Night Chronicles',
      caption: 'Solving none of our problems but passionately debating Menduvada vs everything else.',
      imageUrl: 'https://files.amankrishna.in/2026/WhatsApp%20Image%202026-10-04%20at%2011.20.47%20PM.jpeg',
      tag: '🌙 Midnight Tales',
      location: 'Under the moonlight',
      likes: 72,
      highlight: 'Laughed so hard our stomachs were sore for three business days.'
    },
    {
      id: 'm3',
      title: 'Unfiltered Shenanigans 🤪',
      date: 'Every Single Outing',
      caption: 'Proof that whenever we are left unsupervised, chaos is not a possibility—it is guaranteed.',
      imageUrl: 'https://files.amankrishna.in/2026/WhatsApp%20Image%202026-10-04%20at%2010.57.09%20PM.jpeg',
      tag: '💃 Chaos Partners',
      location: 'Unsupervised everywhere',
      likes: 64,
      highlight: 'Nobody else understands our weird glances across the room.'
    },
    {
      id: 'm4',
      title: 'Golden Hour Glow ✨',
      date: 'Sunsets & Serenity',
      caption: 'A rare moment where we were actually calm, appreciating how lucky we are to be besties.',
      imageUrl: 'https://files.amankrishna.in/2026/WhatsApp%20Image%202026-10-04%20at%2010.57.07%20PM.jpeg',
      tag: '✨ Golden Hour',
      location: 'Chasing the sunset',
      likes: 89,
      highlight: 'Unmatched comfort and peace of mind with you.'
    },
    {
      id: 'm5',
      title: 'Cafe Hangouts & Plotting World Domination ☕',
      date: 'Weekend Rituals',
      caption: 'Two iced drinks, three hours of spilling tea, and laughing at the most unhinged things.',
      imageUrl: 'https://files.amankrishna.in/2026/WhatsApp%20Image%202026-10-04%20at%2010.49.35%20PM.jpeg',
      tag: '☕ Cafe Debriefs',
      location: 'Our favorite corner table',
      likes: 55,
      highlight: 'The gossip sessions that could bring down governments.'
    },
    {
      id: 'm6',
      title: 'Forever My Partner in Crime 🥂',
      date: 'Always & Forever',
      caption: 'Through every high, every low, and every single Menduvada craving, I’ve got your back for life.',
      imageUrl: 'https://files.amankrishna.in/2026/WhatsApp%20Image%202026-10-04%20at%2010.49.35%20PM.jpeg',
      tag: '❤️ Unbreakable',
      location: 'In each other’s corner',
      likes: 120,
      highlight: 'Here for all the upcoming chapters!'
    }
  ],
  themeColor: 'purple'
};
