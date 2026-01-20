import type { Thread } from "~/dto/thread";

export const dummyThreads: Thread[] = [
  {
    id: 1,
    content: "Just finished reading a whole book in one day—might be a new personal record!",
    user: {
      id: 201,
      username: "literarylion",
      name: "Eleanor Finch",
      profile_picture: "https://randomuser.me/api/portraits/women/21.jpg"
    },
    created_at: "2026-01-19T09:15:00Z",
    likes: 42,
    reply: 3,
    isLiked: false
  },
  {
    id: 2,
    content: "Morning coffee tastes better when you actually enjoy the quiet before the world wakes up.",
    user: {
      id: 202,
      username: "caffeinequeen",
      name: "Maya Patel",
      profile_picture: "https://randomuser.me/api/portraits/women/34.jpg"
    },
    created_at: "2026-01-19T08:55:00Z",
    likes: 27,
    reply: 1,
    isLiked: false
  },
  {
    id: 3,
    content: "Why do cats always think the clean laundry is theirs? Asking for a friend…",
    user: {
      id: 203,
      username: "catwhisperer",
      name: "Leo Grant",
      profile_picture: "https://randomuser.me/api/portraits/men/45.jpg"
    },
    created_at: "2026-01-18T22:30:00Z",
    likes: 56,
    reply: 8,
    isLiked: true
  },
  {
    id: 4,
    content: "Baked my first sourdough loaf today—looks like a rock but smells amazing!",
    user: {
      id: 204,
      username: "bakeaholic",
      name: "Sophie Nguyen",
      profile_picture: "https://randomuser.me/api/portraits/women/56.jpg"
    },
    created_at: "2026-01-18T17:42:00Z",
    likes: 19,
    reply: 2,
    isLiked: false
  },
  {
    id: 5,
    content: "Finally got around to setting up my standing desk—my back thanks me already.",
    user: {
      id: 205,
      username: "worksmart",
      name: "Miles Carter",
      profile_picture: "https://randomuser.me/api/portraits/men/67.jpg"
    },
    created_at: "2026-01-18T15:10:00Z",
    likes: 33,
    reply: 5,
    isLiked: true
  },
  {
    id: 6,
    content: "Is it just me or does bread toast differently depending on which side you butter first?",
    user: {
      id: 206,
      username: "quirkychef",
      name: "Nina Lopez",
      profile_picture: "https://randomuser.me/api/portraits/women/78.jpg"
    },
    created_at: "2026-01-17T20:05:00Z",
    likes: 12,
    reply: 0,
    isLiked: false
  },
  {
    id: 7,
    content: "My dog just stole my socks and now looks like he owns the place.",
    user: {
      id: 207,
      username: "puppylove",
      name: "Oliver Chen",
      profile_picture: "https://randomuser.me/api/portraits/men/89.jpg"
    },
    created_at: "2026-01-17T19:50:00Z",
    likes: 40,
    reply: 6,
    isLiked: true
  },
  {
    id: 8,
    content: "Can't decide if I need a vacation or just a really long nap.",
    user: {
      id: 208,
      username: "napguru",
      name: "Zara Ahmed",
      profile_picture: "https://randomuser.me/api/portraits/women/90.jpg"
    },
    created_at: "2026-01-17T18:30:00Z",
    likes: 22,
    reply: 2,
    isLiked: false
  },
  {
    id: 9,
    content: "Listening to rain while coding is 10/10 productivity vibes.",
    user: {
      id: 209,
      username: "raincoder",
      name: "Felix Marino",
      profile_picture: "https://randomuser.me/api/portraits/men/12.jpg"
    },
    created_at: "2026-01-16T21:15:00Z",
    likes: 48,
    reply: 7,
    isLiked: false
  },
  {
    id: 10,
    content: "Why does my phone autocorrect 'ducking' every single time?",
    user: {
      id: 210,
      username: "techproblems",
      name: "Clara Simmons",
      profile_picture: "https://randomuser.me/api/portraits/women/13.jpg"
    },
    created_at: "2026-01-16T20:45:00Z",
    likes: 31,
    reply: 4,
    isLiked: false
  }
];
