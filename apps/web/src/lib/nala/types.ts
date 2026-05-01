export type ChatMode = 'tanya' | 'coach' | 'writing' | 'advocacy';

export type Citation = {
  index: number;
  title: string;
  url?: string;
};

export type Message = {
  id: string;
  role: 'user' | 'nala';
  content: string;
  citations?: Citation[];
  createdAt: string;
};

export type ChatSession = {
  id: string;
  title: string;
  createdAt: string;
  messages: Message[];
};
