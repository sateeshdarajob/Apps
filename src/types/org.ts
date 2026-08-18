import type { Priority, RagStatus } from './common';

export type OrgUnit = {
  id: string;
  name: string;
};

export type Portfolio = {
  id: string;
  name: string;
  description?: string;
};

export type Product = {
  id: string;
  name: string;
  portfolioId: string;
};

export type Person = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarInitials?: string;
  teamId?: string;
};

/**
 * Engineering team / resource pool.
 * Capacity metrics live on the Capacity entity to avoid duplicating fields.
 */
export type Team = {
  id: string;
  name: string;
  orgUnitId: string;
  portfolioId?: string;
  productId?: string;
  managerId?: string;
  location?: string;
  skillFocus?: string;
};

export type FilterOption = {
  id: string;
  label: string;
};

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarInitials: string;
};

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  priority?: Priority;
  rag?: RagStatus;
};
