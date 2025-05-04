import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './SettingsContext';

// Types
export interface Entry {
  date: string; // ISO date string (YYYY-MM-DD)
  count: number;
  totalDuration: number; // in minutes
  note?: string;
}

type EntriesAction = 
  | { type: 'ADD_ENTRY'; payload: Entry }
  | { type: 'REMOVE_ENTRY'; payload: string } // date as payload
  | { type: 'SET_ENTRIES'; payload: Entry[] };

// Context
interface EntriesContextType {
  entries: Entry[];
  addEntry: (entry: Entry) => void;
  removeEntry: (date: string) => void;
  getEntryByDate: (date: string) => Entry | undefined;
  isLoading: boolean;
}

const EntriesContext = createContext<EntriesContextType | null>(null);

// Reducer
const entriesReducer = (state: Entry[], action: EntriesAction): Entry[] => {
  switch (action.type) {
    case 'ADD_ENTRY': {
      const { date } = action.payload;
      const existingEntryIndex = state.findIndex(e => e.date === date);
      
      if (existingEntryIndex !== -1) {
        // Update existing entry
        return state.map((entry, index) => 
          index === existingEntryIndex ? action.payload : entry
        );
      } else {
        // Add new entry and sort by date
        return [...state, action.payload]
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      }
    }
    
    case 'REMOVE_ENTRY': {
      return state.filter(entry => entry.date !== action.payload);
    }
    
    case 'SET_ENTRIES': {
      return [...action.payload]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    
    default:
      return state;
  }
};

// Provider Component
interface EntriesProviderProps {
  children: ReactNode;
}

export const EntriesProvider: React.FC<EntriesProviderProps> = ({ children }) => {
  const [entries, dispatch] = useReducer(entriesReducer, []);
  const [isLoading, setIsLoading] = React.useState(true);

  // Load entries from storage on mount
  useEffect(() => {
    const loadEntries = async () => {
      try {
        setIsLoading(true);
        const storedEntries = await AsyncStorage.getItem(STORAGE_KEYS.ENTRIES);
        if (storedEntries) {
          dispatch({ 
            type: 'SET_ENTRIES', 
            payload: JSON.parse(storedEntries) 
          });
        }
      } catch (error) {
        console.error('Failed to load entries:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEntries();
  }, []);

  // Save entries to storage when they change
  useEffect(() => {
    const saveEntries = async () => {
      try {
        if (!isLoading) {
          await AsyncStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
        }
      } catch (error) {
        console.error('Failed to save entries:', error);
      }
    };

    saveEntries();
  }, [entries, isLoading]);

  // Utility functions
  const addEntry = (entry: Entry) => {
    dispatch({ type: 'ADD_ENTRY', payload: entry });
  };

  const removeEntry = (date: string) => {
    dispatch({ type: 'REMOVE_ENTRY', payload: date });
  };

  const getEntryByDate = (date: string) => {
    return entries.find(entry => entry.date === date);
  };

  return (
    <EntriesContext.Provider 
      value={{ 
        entries, 
        addEntry, 
        removeEntry, 
        getEntryByDate,
        isLoading 
      }}
    >
      {children}
    </EntriesContext.Provider>
  );
};

// Custom hook for using entries
export const useEntries = (): EntriesContextType => {
  const context = useContext(EntriesContext);
  if (!context) {
    throw new Error('useEntries must be used within an EntriesProvider');
  }
  return context;
};