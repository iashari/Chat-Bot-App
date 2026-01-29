// Solid Colors Palette
// #3B0270 - Dark Purple
// #6F00FF - Bright Purple
// #E9B3FB - Light Pink
// #FFF1F1 - Off White

export const conversations = [
  {
    id: '1',
    name: 'Open AI GPT-4',
    icon: 'Bot',
    iconColor: '#6F00FF',
    lastMessage: 'Sure! Let me explain how React hooks work...',
    timestamp: '10:45 AM',
    unread: 2,
    isOnline: true,
    isPinned: true,
    description: 'Advanced language model',
    messages: [
      { id: '1', text: 'Hi! Can you help me understand React hooks?', isUser: true, time: '10:40 AM' },
      { id: '2', text: 'Of course! React hooks are functions that let you use state and other React features in functional components. The most common ones are useState and useEffect.', isUser: false, time: '10:41 AM' },
      { id: '3', text: 'What is useState used for?', isUser: true, time: '10:43 AM' },
      { id: '4', text: 'Sure! Let me explain how React hooks work...', isUser: false, time: '10:45 AM' },
    ],
  },
  {
    id: '2',
    name: 'Code Assistant',
    icon: 'Code2',
    iconColor: '#3B0270',
    lastMessage: 'The bug is in line 42. You need to add a null check.',
    timestamp: '9:30 AM',
    unread: 1,
    isOnline: true,
    isPinned: false,
    description: 'Debug & code help',
    messages: [
      { id: '1', text: 'I have a bug in my code, can you help?', isUser: true, time: '9:25 AM' },
      { id: '2', text: 'Sure! Please share the code and describe the issue.', isUser: false, time: '9:26 AM' },
      { id: '3', text: 'My app crashes when I try to access user.name', isUser: true, time: '9:28 AM' },
      { id: '4', text: 'The bug is in line 42. You need to add a null check.', isUser: false, time: '9:30 AM' },
    ],
  },
  {
    id: '3',
    name: 'Image Generator',
    icon: 'Palette',
    iconColor: '#6F00FF',
    lastMessage: 'Here is your generated image...',
    timestamp: 'Yesterday',
    isOnline: true,
    isPinned: true,
    description: 'Create stunning images',
    messages: [
      { id: '1', text: 'Generate a sunset over mountains', isUser: true, time: '3:00 PM' },
      { id: '2', text: 'Here is your generated image...', isUser: false, time: '3:10 PM' },
    ],
  },
  {
    id: '4',
    name: 'Math Solver',
    icon: 'Calculator',
    iconColor: '#3B0270',
    lastMessage: 'The answer is x = 7. Here is the step-by-step solution...',
    timestamp: 'Yesterday',
    isOnline: true,
    isPinned: false,
    description: 'Solve any math problem',
    messages: [
      { id: '1', text: 'Can you solve 2x + 3 = 17?', isUser: true, time: '11:00 AM' },
      { id: '2', text: 'The answer is x = 7. Here is the step-by-step solution...', isUser: false, time: '11:01 AM' },
    ],
  },
  {
    id: '5',
    name: 'Voice Chat',
    icon: 'Mic',
    iconColor: '#6F00FF',
    lastMessage: 'Voice transcription completed.',
    timestamp: 'Mon',
    isOnline: false,
    isPinned: false,
    description: 'Talk naturally with AI',
    messages: [
      { id: '1', text: 'Start voice conversation', isUser: true, time: '2:00 PM' },
      { id: '2', text: 'Voice transcription completed.', isUser: false, time: '2:06 PM' },
    ],
  },
  {
    id: '6',
    name: 'Data Analyst',
    icon: 'BarChart3',
    iconColor: '#3B0270',
    lastMessage: 'Based on the trends, I recommend focusing on...',
    timestamp: 'Sun',
    isOnline: true,
    isPinned: false,
    description: 'Analyze your data',
    messages: [
      { id: '1', text: 'Can you analyze this dataset for me?', isUser: true, time: '4:00 PM' },
      { id: '2', text: 'Based on the trends, I recommend focusing on...', isUser: false, time: '4:15 PM' },
    ],
  },
  {
    id: '7',
    name: 'Study Buddy',
    icon: 'GraduationCap',
    iconColor: '#6F00FF',
    lastMessage: 'Let me create a study plan for you...',
    timestamp: 'Sat',
    isOnline: true,
    isPinned: false,
    description: 'Learn anything faster',
    messages: [
      { id: '1', text: 'Help me prepare for my exam', isUser: true, time: '9:00 AM' },
      { id: '2', text: 'Let me create a study plan for you...', isUser: false, time: '9:02 AM' },
    ],
  },
  {
    id: '8',
    name: 'Writing Assistant',
    icon: 'FileText',
    iconColor: '#3B0270',
    lastMessage: 'Here is the revised version of your text...',
    timestamp: 'Fri',
    isOnline: false,
    isPinned: false,
    description: 'Write better content',
    messages: [
      { id: '1', text: 'Help me write an email', isUser: true, time: '7:00 PM' },
      { id: '2', text: 'Here is the revised version of your text...', isUser: false, time: '7:01 PM' },
    ],
  },
];

export const examplePrompts = [
  {
    id: '1',
    title: 'Fun Facts and Trivia',
    description: 'Explore a world of fascinating facts and trivia to expand your knowledge',
    icon: 'Sparkles',
  },
  {
    id: '2',
    title: 'Local Cuisine',
    description: 'Embark on a culinary journey through the flavors of local cuisine',
    icon: 'UtensilsCrossed',
  },
  {
    id: '3',
    title: 'CV Formatting',
    description: 'Craft a standout CV with tips on formatting and presentation',
    icon: 'FileText',
  },
  {
    id: '4',
    title: 'Gift Suggestions',
    description: 'Discover personalized gift ideas for any occasion',
    icon: 'Gift',
  },
];

export const userProfile = {
  name: 'Izzat Shafran',
  email: 'izzat.shafran@example.com',
  avatar: 'https://ui-avatars.com/api/?name=Izzat+Shafran&background=6B4EFF&color=fff&size=128&bold=true',
  plan: 'Pro',
  joinDate: 'Jan 2024',
  totalChats: 156,
  totalMessages: 2847,
};
