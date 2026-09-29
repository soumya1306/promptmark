export type RibbonTab = 'home' | 'insert' | 'review' | 'layout';

export type ScreenPreset = 1 | 2 | 3 | 4;

export interface Collaborator {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  caretColor: string;
  selectionBg: string;
  selectionText: string;
  status: string;
  currentSection: string;
}

export interface CommentItem {
  id: string;
  author: string;
  initials: string;
  avatarColor: string;
  timeAgo: string;
  quotedText: string;
  text: string;
  replies: Array<{
    id: string;
    author: string;
    text: string;
    timeAgo: string;
  }>;
  resolved: boolean;
}

export interface TrackedChange {
  id: string;
  author: string;
  initials: string;
  avatarColor: string;
  timeAgo: string;
  type: 'replacement' | 'addition' | 'deletion';
  originalText: string;
  suggestedText: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface ChecklistItem {
  id: string;
  text: string;
  subtext?: string;
  completed: boolean;
  authorTag?: string;
  isAlexFocus?: boolean;
}

export interface TableRow {
  milestone: string;
  owner: string;
  status: string;
  statusType: 'complete' | 'reviewing' | 'scheduled';
}
