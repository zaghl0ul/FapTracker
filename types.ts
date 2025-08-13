import React from 'react';

export interface SessionLog {
  id: string;
  timestamp: number;
  durationMinutes: number;
}

export type ComparisonCategory = 'History' | 'Pop Culture' | 'Science' | 'Endurance' | 'Food' | 'Weird' | 'Gaming';

export interface TimeComparison {
  name: string;
  description: string;
  durationMinutes: number;
  category: ComparisonCategory;
  humorousQuote: (times: number) => string;
  icon: (props: { className?: string }) => React.ReactNode;
}
