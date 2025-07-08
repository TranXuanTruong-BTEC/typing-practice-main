"use client";
import React, { useEffect, useState, useRef } from "react";

export interface Conversation {
  _id: string;
  members: string[];
  lastMessage: string;
  updatedAt: string;
}
export interface Message {
  _id?: string;
  conversationId: string;
  from: string;
  to: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}
export interface User {
  _id: string;
  username: string;
  gmail: string;
  avatar?: string;
}

export default function ChatPage({ conversationId, userMap: userMapProp, preloadMessages }: { conversationId?: string, userMap?: Record<string, User>, preloadMessages?: Message[] }) {
  // ... (toàn bộ logic và UI ChatPage như cũ, giữ nguyên các useState, useEffect, render, v.v.) ...
} 