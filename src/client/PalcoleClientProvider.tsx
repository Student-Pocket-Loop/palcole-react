import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { PalcoleClient } from './PalcoleClient';

interface PalcoleClientProviderProps {
  children: ReactNode;
}

export default function PalcoleClientProvider({ children }: PalcoleClientProviderProps) {
    return (
        <QueryClientProvider client={PalcoleClient}>
            {children}
        </QueryClientProvider>
    );
}
