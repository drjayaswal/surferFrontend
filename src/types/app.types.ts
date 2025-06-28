export type FileStatus = "processing" | "ready" | "error" | "uploading";

export interface CorpusFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  status: FileStatus;
  progress?: number;
  collection?: string;
  tags?: string[];
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