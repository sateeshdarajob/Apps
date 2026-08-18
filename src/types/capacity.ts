/**
 * Team capacity snapshot for a planning period (usually a quarter).
 * Team identity is referenced by teamId; `team` is the display name required by TPM views.
 */
export type Capacity = {
  id: string;
  teamId: string;
  team: string;
  quarter: string;
  portfolioId?: string;
  programId?: string;
  productId?: string;
  totalCapacity: number;
  allocatedCapacity: number;
  availableCapacity: number;
  utilization: number;
  demand: number;
  capacityGap: number;
  unit: 'personWeeks' | 'storyPoints' | 'fte';
  asOfDate: string;
};
