
export type Status = 'pending' | 'good' | 'fair' | 'poor';

export interface CheckItem {
  id: string;
  label: string;
  status: Status;
  comment?: string;
  photo?: string;
}

export interface InspectionArea {
  id: string;
  name: string;
  type: 'room' | 'common' | 'service';
  floor: number;
  lastInspected?: string;
  items: CheckItem[];
  progress: number; // 0-100
}

export interface InspectionSummary {
  totalAreas: number;
  completedAreas: number;
  criticalIssues: number;
  averageCondition: number;
}
