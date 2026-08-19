import type { Priority, WorkflowStatus } from './common';
import type { Person } from './org';

/**
 * Normalized work item shape used by DataProvider.getIssues().
 * Designed to map cleanly onto Jira issues later without UI rewrites.
 */
export type IssueType = 'bug' | 'story' | 'task' | 'epic' | 'subtask';

export type Issue = {
  id: string;
  /** External key (e.g. Jira issue key). Mock uses defect/sprint ids. */
  key: string;
  summary: string;
  description: string;
  issueType: IssueType;
  status: WorkflowStatus | string;
  priority: Priority;
  programId?: string;
  teamId?: string;
  assignee?: Person;
  reporter?: Person;
  labels?: string[];
  createdAt: string;
  updatedAt?: string;
  dueDate?: string;
  source: 'mock' | 'jira';
};
