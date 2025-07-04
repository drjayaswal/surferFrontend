export type FileStatus = "processing" | "ready" | "error" | "uploading";
export interface Connection {
  id: string;
  prompt: {
    sender: "user";
    content?: string;
    attachments?: {
      url: string;
    }[];
  };
  answer: {
    sender: "ai";
    content: string;
  };
  created_at: string;
}
export type FAQ = {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  helpful: number;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export interface ConnectionState {
  connections: Connection[];
  setConnections: (connections: Connection[] | []) => void;

  hasFetchedConnections: boolean;
  setHasFetchedConnections: (state: boolean) => void;

  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}
export interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;

  authChecked: boolean;
  setAuthChecked: (checked: boolean) => void;

  loading: boolean;
  setLoading: (loading: boolean) => void;

  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}
export interface User {
  id: string;
  name: string;
  email: string;
  refresh_token?: string;
  avatar: string;
  avatar_uploaded_at: string;
  bio: string;
  corpuses: CorpusFile[];
  notes: Note[];
  created_at: string;
  password_updated_at: string;
  api_key_generated_at?: string;
  TFA_enabled: boolean;
  activity_logs: ActivityLog[];
}
export interface AttachmentFile {
  id: string;
  name: string;
  mime: string;
  url: string;
  size: number;
  created_at: Date;
}
export interface CorpusFile {
  id: string;
  name: string;
  mime: string;
  url: string;
  size: number;
  created_at: Date;
}
export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export type sendMessagePayload = {
  prompt?: string;
  attachments?: File[];
};
export interface Note {
  id: string;
  content: string;
  created_at: Date;
}
export interface ActivityLog {
  activity_name: string;
  created_at: Date;
}
export interface SearchQuery {
  id: string;
  query: string;
  timestamp: Date;
  response?: string;
  category?: string;
}

export interface DayData {
  date: Date;
  queries: SearchQuery[];
  isToday: boolean;
  isCurrentMonth: boolean;
}
export type ToolbarProps = {
  icon: React.ReactNode;
  rightIcon?: React.ReactNode;
  title?: string;
  placeholder?: string;
  onSubmit?: (value: string) => void;
  type?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  autoFocus?: boolean;
};
export interface UsageData {
  date: string;
  messages: number;
  tokens: number;
  conversations: number;
}

export interface TopicData {
  name: string;
  value: number;
  color: string;
}

export interface ModelUsageData {
  model: string;
  usage: number;
  color: string;
}
export type AuthStep =
  | "initial"
  | "forgot-password"
  | "otp-verification"
  | "success";

export interface FormData {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  rememberMe?: boolean;
  otp?: string;
}

export interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  general?: string;
  otp?: string;
}
