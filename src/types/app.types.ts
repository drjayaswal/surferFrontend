export type FileStatus = "processing" | "ready" | "error" | "uploading";

export interface CorpusFile {
  id: string;
  name: string;
  mime: string;
  url: string;
  previewUrl?: string;
  size: number;
  created_at: Date;
}
export type ToolbarProps = {
  icon: React.ReactNode;
  rightIcon?: React.ReactNode; // <-- Add this
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

export type ActivityLog = {
  id: string;
  action: string;
  timestamp: Date;
  details: string;
  type: "success" | "warning" | "info";
};
