export type ThreatLevel = "low" | "medium" | "high" | "critical";

export interface Alert {
  id: string;
  childName: string;
  childAvatar: string;
  platform: string;
  threatType: string;
  severity: ThreatLevel;
  summary: string;
  timestamp: string;
  isRead: boolean;
}

export interface Child {
  id: string;
  name: string;
  age: number;
  avatar: string;
  ageGroup: "6-9" | "10-13" | "14-17";
  safetyScore: number;
  platforms: string[];
  recentAlerts: number;
  screenTime: string;
  status: "safe" | "warning" | "alert";
}

export interface PlatformStatus {
  name: string;
  icon: string;
  status: "active" | "paused" | "disconnected";
  lastSync: string;
  threatsBlocked: number;
}

export const children: Child[] = [
  {
    id: "1",
    name: "Emma",
    age: 12,
    avatar: "E",
    ageGroup: "10-13",
    safetyScore: 87,
    platforms: ["Instagram", "TikTok", "Roblox", "Discord"],
    recentAlerts: 2,
    screenTime: "3h 24m",
    status: "warning",
  },
  {
    id: "2",
    name: "Lucas",
    age: 9,
    avatar: "L",
    ageGroup: "6-9",
    safetyScore: 95,
    platforms: ["Roblox", "Minecraft", "YouTube Kids"],
    recentAlerts: 0,
    screenTime: "1h 45m",
    status: "safe",
  },
  {
    id: "3",
    name: "Sophie",
    age: 15,
    avatar: "S",
    ageGroup: "14-17",
    safetyScore: 72,
    platforms: ["Instagram", "Snapchat", "TikTok", "Discord", "WhatsApp"],
    recentAlerts: 5,
    screenTime: "4h 10m",
    status: "alert",
  },
];

export const alerts: Alert[] = [
  {
    id: "a1",
    childName: "Sophie",
    childAvatar: "S",
    platform: "Instagram",
    threatType: "Cyberbullying",
    severity: "high",
    summary: "Multiple hostile messages detected in a group chat. Repeated targeting language identified.",
    timestamp: "2 min ago",
    isRead: false,
  },
  {
    id: "a2",
    childName: "Sophie",
    childAvatar: "S",
    platform: "Discord",
    threatType: "Suspicious Contact",
    severity: "critical",
    summary: "Unknown adult account attempting private contact. Grooming pattern indicators flagged.",
    timestamp: "15 min ago",
    isRead: false,
  },
  {
    id: "a3",
    childName: "Emma",
    childAvatar: "E",
    platform: "TikTok",
    threatType: "Explicit Content",
    severity: "medium",
    summary: "Age-inappropriate content detected in feed. Content was automatically filtered.",
    timestamp: "1 hour ago",
    isRead: true,
  },
  {
    id: "a4",
    childName: "Emma",
    childAvatar: "E",
    platform: "Roblox",
    threatType: "Inappropriate Language",
    severity: "low",
    summary: "Mild profanity detected in game chat. No targeted harassment identified.",
    timestamp: "3 hours ago",
    isRead: true,
  },
  {
    id: "a5",
    childName: "Sophie",
    childAvatar: "S",
    platform: "Snapchat",
    threatType: "Location Sharing",
    severity: "high",
    summary: "Attempted location sharing with non-approved contact detected and blocked.",
    timestamp: "5 hours ago",
    isRead: true,
  },
  {
    id: "a6",
    childName: "Sophie",
    childAvatar: "S",
    platform: "WhatsApp",
    threatType: "Manipulation",
    severity: "medium",
    summary: "Isolation language patterns detected. Secret-keeping requests identified in conversation.",
    timestamp: "Yesterday",
    isRead: true,
  },
  {
    id: "a7",
    childName: "Sophie",
    childAvatar: "S",
    platform: "TikTok",
    threatType: "Self-Harm Content",
    severity: "high",
    summary: "Content related to self-harm detected in browsing. Resource links provided proactively.",
    timestamp: "Yesterday",
    isRead: true,
  },
];

export const platforms: PlatformStatus[] = [
  { name: "Instagram", icon: "📷", status: "active", lastSync: "Just now", threatsBlocked: 12 },
  { name: "TikTok", icon: "🎵", status: "active", lastSync: "1 min ago", threatsBlocked: 8 },
  { name: "Discord", icon: "🎮", status: "active", lastSync: "Just now", threatsBlocked: 15 },
  { name: "Snapchat", icon: "👻", status: "active", lastSync: "2 min ago", threatsBlocked: 5 },
  { name: "Roblox", icon: "🧱", status: "active", lastSync: "Just now", threatsBlocked: 3 },
  { name: "WhatsApp", icon: "💬", status: "paused", lastSync: "1 hour ago", threatsBlocked: 2 },
  { name: "Minecraft", icon: "⛏️", status: "active", lastSync: "5 min ago", threatsBlocked: 0 },
  { name: "YouTube Kids", icon: "▶️", status: "active", lastSync: "Just now", threatsBlocked: 1 },
];

export const weeklyActivity = [
  { day: "Mon", threats: 3, blocked: 3, screenTime: 180 },
  { day: "Tue", threats: 1, blocked: 1, screenTime: 210 },
  { day: "Wed", threats: 5, blocked: 4, screenTime: 195 },
  { day: "Thu", threats: 2, blocked: 2, screenTime: 240 },
  { day: "Fri", threats: 4, blocked: 3, screenTime: 260 },
  { day: "Sat", threats: 6, blocked: 5, screenTime: 300 },
  { day: "Sun", threats: 2, blocked: 2, screenTime: 280 },
];

export const threatCategories = [
  { name: "Cyberbullying", count: 12, color: "hsl(0, 72%, 55%)" },
  { name: "Explicit Content", count: 8, color: "hsl(38, 92%, 50%)" },
  { name: "Suspicious Contacts", count: 5, color: "hsl(280, 60%, 55%)" },
  { name: "Inappropriate Language", count: 15, color: "hsl(205, 80%, 55%)" },
  { name: "Location Sharing", count: 3, color: "hsl(152, 60%, 42%)" },
];
