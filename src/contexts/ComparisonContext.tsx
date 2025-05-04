import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './SettingsContext';

// Types
export interface ComparisonFeat {
  id: string;
  name: string;
  timeValue: number; // in minutes
  unit: string;
  description: string;
  category: 'music' | 'construction' | 'nature' | 'travel' | 'entertainment' | 'literature' | 'space' | 'technology';
  pinnedPosition?: number; // null if not pinned, 0-based index if pinned
}

export interface ComparisonState {
  feats: ComparisonFeat[];
  pinnedFeatIds: string[];
  displayFeats: string[]; // IDs of the 3 randomly selected feats to display
  lastGeneratedTimestamp: number; // to control regeneration frequency
}

type ComparisonAction =
  | { type: 'PIN_FEAT'; payload: string } // feat id
  | { type: 'UNPIN_FEAT'; payload: string } // feat id
  | { type: 'REORDER_PINNED'; payload: { id: string; newPosition: number } }
  | { type: 'LOAD_STATE'; payload: ComparisonState }
  | { type: 'REGENERATE_FEATS'; payload?: undefined }
  | { type: 'SELECT_DISPLAY_FEATS'; payload?: undefined };

// Pre-defined comparison feats
const BASE_FEATS: Omit<ComparisonFeat, 'id'>[] = [
  {
    name: "Parthenon Construction",
    timeValue: 9 * 365 * 24 * 60, // 9 years in minutes
    unit: "of the Parthenon built",
    description: "The Parthenon in Athens took about 9 years to build (447-438 BCE)",
    category: "construction",
  },
  {
    name: "Great Pyramid of Giza",
    timeValue: 20 * 365 * 24 * 60, // 20 years in minutes
    unit: "of the Great Pyramid built",
    description: "The Great Pyramid took approximately 20 years to build",
    category: "construction",
  },
  {
    name: "Sleep - Dopesmoker",
    timeValue: 63, // 63 minutes
    unit: "complete listens of Dopesmoker by Sleep",
    description: "The iconic doom metal track Dopesmoker is 63 minutes long",
    category: "music",
  },
  {
    name: "Wagner's Ring Cycle",
    timeValue: 15 * 60, // 15 hours in minutes
    unit: "of Wagner's complete Ring Cycle",
    description: "The full Ring Cycle opera takes about 15 hours to perform",
    category: "music",
  },
  {
    name: "Earth Rotation",
    timeValue: 24 * 60, // 24 hours in minutes
    unit: "of Earth's rotation",
    description: "Earth completes one full rotation in 24 hours",
    category: "space",
  },
  {
    name: "Apollo 11 Moon Journey",
    timeValue: 3 * 24 * 60, // 3 days in minutes
    unit: "of an Apollo 11 journey to the Moon",
    description: "Apollo 11 took about 3 days to reach the Moon from Earth",
    category: "space",
  },
  {
    name: "Mount Everest Climb",
    timeValue: 40 * 24 * 60, // 40 days in minutes
    unit: "of a typical Mount Everest expedition",
    description: "A typical Mount Everest expedition takes about 40 days",
    category: "nature",
  },
  {
    name: "The Lord of the Rings",
    timeValue: 11 * 60 + 28, // 11 hours 28 minutes
    unit: "complete viewings of all Lord of the Rings movies (extended)",
    description: "The extended editions totaling 11 hours and 28 minutes",
    category: "entertainment",
  },
  {
    name: "War and Peace",
    timeValue: 60 * 33, // 33 hours in minutes
    unit: "of War and Peace audiobook",
    description: "The unabridged audiobook is about 33 hours long",
    category: "literature",
  },
  {
    name: "Mariana Trench Dive",
    timeValue: 4 * 60, // 4 hours in minutes
    unit: "of a descent to the Mariana Trench",
    description: "It takes about 4 hours to descend to the bottom of the Mariana Trench",
    category: "nature",
  },
  {
    name: "Commercial Flight - NY to Tokyo",
    timeValue: 14 * 60, // 14 hours in minutes
    unit: "of a flight from New York to Tokyo",
    description: "A direct flight from New York to Tokyo takes about 14 hours",
    category: "travel",
  },
  {
    name: "Human Cell Replication",
    timeValue: 24 * 60, // 24 hours in minutes
    unit: "of human cell replication cycles",
    description: "Human cells typically take 24 hours to replicate",
    category: "nature",
  },
  {
    name: "International Space Station Orbit",
    timeValue: 90, // 90 minutes
    unit: "ISS orbits of Earth",
    description: "The ISS orbits Earth once every 90 minutes",
    category: "space",
  },
  {
    name: "Windows XP Installation",
    timeValue: 40, // 40 minutes
    unit: "Windows XP installations",
    description: "A typical Windows XP installation took about 40 minutes",
    category: "technology",
  },
  {
    name: "Brewing Espresso",
    timeValue: 0.5, // 30 seconds
    unit: "espresso shots brewed",
    description: "A typical espresso shot takes about 30 seconds to brew",
    category: "entertainment",
  },
  {
    name: "Vinyl Record Side",
    timeValue: 23, // 23 minutes
    unit: "vinyl record sides played",
    description: "A typical vinyl record side plays for about 23 minutes",
    category: "music",
  },
  {
    name: "Light from Sun to Earth",
    timeValue: 8.3 / 60, // 8.3 minutes converted to hours
    unit: "times light travels from the Sun to Earth",
    description: "Light takes about 8.3 minutes to travel from the Sun to Earth",
    category: "space",
  },
  {
    name: "Boiling Water",
    timeValue: 5, // 5 minutes
    unit: "kettles of water boiled",
    description: "It takes about 5 minutes to bring water to a boil",
    category: "nature",
  },
  {
    name: "Titanic Sinking",
    timeValue: 160, // 2h40m in minutes
    unit: "of the time it took for the Titanic to sink",
    description: "The Titanic took 2 hours and 40 minutes to sink after hitting the iceberg",
    category: "entertainment",
  },
  {
    name: "Entire Beatles Discography",
    timeValue: 10 * 60, // 10 hours in minutes
    unit: "complete listens of the Beatles studio albums",
    description: "All 13 Beatles studio albums take about 10 hours to listen to",
    category: "music",
  },
];

// Generate a random selection of comparisons
const generateRandomFeats = (): ComparisonFeat[] => {
  return BASE_FEATS.map(feat => ({
    ...feat,
    id: `${feat.category}-${Math.random().toString(36).substring(2, 9)}`,
  }));
};

// Helper to randomly select 3 feat IDs from an array of feats
const selectRandomDisplayFeats = (feats: ComparisonFeat[], pinnedFeatIds: string[]): string[] => {
  // First prioritize pinned feats
  const pinnedIds = [...pinnedFeatIds];
  
  // If we have 3 or more pinned feats, just return the first 3
  if (pinnedIds.length >= 3) {
    return pinnedIds.slice(0, 3);
  }
  
  // Get unpinned feats
  const unpinnedFeats = feats.filter(feat => !pinnedIds.includes(feat.id));
  
  // Shuffle unpinned feats (Fisher-Yates algorithm)
  for (let i = unpinnedFeats.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [unpinnedFeats[i], unpinnedFeats[j]] = [unpinnedFeats[j], unpinnedFeats[i]];
  }
  
  // Take enough unpinned feats to get to 3 total
  const unpinnedIds = unpinnedFeats
    .slice(0, 3 - pinnedIds.length)
    .map(feat => feat.id);
  
  // Return combined array of pinned and unpinned IDs
  return [...pinnedIds, ...unpinnedIds];
};

// Default state
const defaultComparisonState: ComparisonState = {
  feats: generateRandomFeats(),
  pinnedFeatIds: [],
  displayFeats: [], // Will be populated during initialization
  lastGeneratedTimestamp: Date.now(),
};

// Reducer
const comparisonReducer = (state: ComparisonState, action: ComparisonAction): ComparisonState => {
  switch (action.type) {
    case 'PIN_FEAT': {
      if (state.pinnedFeatIds.includes(action.payload)) {
        return state; // Already pinned
      }
      
      const newPinnedIds = [...state.pinnedFeatIds, action.payload];
      
      // Update display feats if needed - pinned feats should be displayed
      let newDisplayFeats = [...state.displayFeats];
      if (!newDisplayFeats.includes(action.payload)) {
        if (newDisplayFeats.length >= 3) {
          // Replace a non-pinned display feat with the newly pinned one
          const unpinnedDisplayIndex = newDisplayFeats.findIndex(id => !newPinnedIds.includes(id));
          if (unpinnedDisplayIndex !== -1) {
            newDisplayFeats[unpinnedDisplayIndex] = action.payload;
          }
        } else {
          newDisplayFeats.push(action.payload);
        }
      }
      
      return {
        ...state,
        pinnedFeatIds: newPinnedIds,
        displayFeats: newDisplayFeats,
      };
    }
    
    case 'UNPIN_FEAT': {
      const newPinnedIds = state.pinnedFeatIds.filter(id => id !== action.payload);
      
      return {
        ...state,
        pinnedFeatIds: newPinnedIds,
      };
    }
    
    case 'REORDER_PINNED': {
      const { id, newPosition } = action.payload;
      const currentPosition = state.pinnedFeatIds.indexOf(id);
      
      if (currentPosition === -1 || newPosition < 0 || newPosition >= state.pinnedFeatIds.length) {
        return state; // Invalid operation
      }
      
      // Create a new array with the reordered pinned ids
      const newPinnedIds = [...state.pinnedFeatIds];
      newPinnedIds.splice(currentPosition, 1);
      newPinnedIds.splice(newPosition, 0, id);
      
      return {
        ...state,
        pinnedFeatIds: newPinnedIds,
      };
    }
    
    case 'LOAD_STATE': {
      return action.payload;
    }
    
    case 'REGENERATE_FEATS': {
      // Keep pinned feats, regenerate the rest
      const currentIds = new Set(state.feats.map(f => f.id));
      const pinnedFeats = state.feats.filter(feat => 
        state.pinnedFeatIds.includes(feat.id)
      );
      
      // Generate new random feats, excluding categories that are already pinned
      const pinnedCategories = new Set(pinnedFeats.map(f => f.category));
      const newRandomFeats = generateRandomFeats()
        .filter(feat => !currentIds.has(feat.id))
        .filter(feat => {
          // Keep some diversity by limiting category duplication
          const categoryCount = pinnedFeats.filter(f => f.category === feat.category).length;
          return categoryCount < 2; // Allow max 2 feats per category
        })
        .slice(0, Math.max(10, 20 - pinnedFeats.length)); // Keep total around 10-20 feats
      
      const newFeats = [...pinnedFeats, ...newRandomFeats];
      
      // Select new display feats
      const newDisplayFeats = selectRandomDisplayFeats(newFeats, state.pinnedFeatIds);
      
      return {
        ...state,
        feats: newFeats,
        displayFeats: newDisplayFeats,
        lastGeneratedTimestamp: Date.now(),
      };
    }
    
    case 'SELECT_DISPLAY_FEATS': {
      return {
        ...state,
        displayFeats: selectRandomDisplayFeats(state.feats, state.pinnedFeatIds),
      };
    }
    
    default:
      return state;
  }
};

// Context
export interface ComparisonContextType {
  state: ComparisonState;
  isPinned: (featId: string) => boolean;
  isDisplayed: (featId: string) => boolean;
  pinFeat: (featId: string) => void;
  unpinFeat: (featId: string) => void;
  reorderPinned: (featId: string, newPosition: number) => void;
  regenerateFeats: () => void;
  selectNewDisplayFeats: () => void;
  calculateComparison: (totalMinutes: number) => { 
    feat: ComparisonFeat;
    value: number;
    percentage: number;
  }[];
}

const ComparisonContext = createContext<ComparisonContextType | null>(null);

// Provider Component
interface ComparisonProviderProps {
  children: ReactNode;
}

// Add a storage key for comparison state
const COMPARISON_STORAGE_KEY = 'habitTracker.comparisons';

export const ComparisonProvider: React.FC<ComparisonProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(comparisonReducer, defaultComparisonState);

  // Initialize with 3 random display feats on first render
  useEffect(() => {
    if (state.displayFeats.length === 0 && state.feats.length > 0) {
      dispatch({ type: 'SELECT_DISPLAY_FEATS' });
    }
  }, [state.feats.length, state.displayFeats.length]);

  // Load state from storage on mount and always regenerate display feats
  useEffect(() => {
    const loadState = async () => {
      try {
        const storedState = await AsyncStorage.getItem(COMPARISON_STORAGE_KEY);
        if (storedState) {
          const parsedState = JSON.parse(storedState) as ComparisonState;
          
          // Always regenerate on app start
          dispatch({ type: 'LOAD_STATE', payload: parsedState });
          
          // If it's been more than a day since regeneration, refresh all comparisons
          const dayInMs = 24 * 60 * 60 * 1000;
          if (Date.now() - parsedState.lastGeneratedTimestamp > dayInMs) {
            dispatch({ type: 'REGENERATE_FEATS' });
          } else {
            // Otherwise just refresh the displayed ones
            dispatch({ type: 'SELECT_DISPLAY_FEATS' });
          }
        } else {
          // First time - generate initial set
          dispatch({ type: 'REGENERATE_FEATS' });
        }
      } catch (error) {
        console.error('Failed to load comparison state:', error);
        // Fallback to defaults
        dispatch({ type: 'REGENERATE_FEATS' });
      }
    };

    loadState();
  }, []);

  // Save state to storage when it changes
  useEffect(() => {
    const saveState = async () => {
      try {
        await AsyncStorage.setItem(COMPARISON_STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save comparison state:', error);
      }
    };

    saveState();
  }, [state]);

  // Calculate comparisons based on total time, but filter to only displayed and pinned ones
  const calculateComparison = (totalMinutes: number) => {
    const visibleFeatIds = new Set([...state.displayFeats, ...state.pinnedFeatIds]);
    
    // Filter feats to only those that should be displayed
    const visibleFeats = state.feats.filter(feat => visibleFeatIds.has(feat.id));
    
    // Sort feats with pinned ones first in their pinned order
    const sortedFeats = [...visibleFeats].sort((a, b) => {
      const aIndex = state.pinnedFeatIds.indexOf(a.id);
      const bIndex = state.pinnedFeatIds.indexOf(b.id);
      
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex; // Both pinned, sort by pin order
      } else if (aIndex !== -1) {
        return -1; // a is pinned, b is not
      } else if (bIndex !== -1) {
        return 1; // b is pinned, a is not
      } else {
        // For display feats, preserve their order in displayFeats array
        const aDisplayIndex = state.displayFeats.indexOf(a.id);
        const bDisplayIndex = state.displayFeats.indexOf(b.id);
        
        if (aDisplayIndex !== -1 && bDisplayIndex !== -1) {
          return aDisplayIndex - bDisplayIndex;
        }
        
        // Fallback to category sorting
        if (a.category === b.category) {
          return a.name.localeCompare(b.name);
        }
        return a.category.localeCompare(b.category);
      }
    });
    
    // Calculate comparison values
    return sortedFeats.map(feat => {
      const value = totalMinutes / feat.timeValue;
      const percentage = (value * 100);
      
      return { 
        feat,
        value,
        percentage,
      };
    });
  };

  // Utility functions
  const isPinned = (featId: string) => state.pinnedFeatIds.includes(featId);
  
  const isDisplayed = (featId: string) => state.displayFeats.includes(featId);
  
  const pinFeat = (featId: string) => {
    dispatch({ type: 'PIN_FEAT', payload: featId });
  };
  
  const unpinFeat = (featId: string) => {
    dispatch({ type: 'UNPIN_FEAT', payload: featId });
  };
  
  const reorderPinned = (featId: string, newPosition: number) => {
    dispatch({ type: 'REORDER_PINNED', payload: { id: featId, newPosition } });
  };
  
  const regenerateFeats = () => {
    dispatch({ type: 'REGENERATE_FEATS' });
  };
  
  const selectNewDisplayFeats = () => {
    dispatch({ type: 'SELECT_DISPLAY_FEATS' });
  };

  return (
    <ComparisonContext.Provider
      value={{
        state,
        isPinned,
        isDisplayed,
        pinFeat,
        unpinFeat,
        reorderPinned,
        regenerateFeats,
        selectNewDisplayFeats,
        calculateComparison,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};

// Custom hook for using comparison features
export const useComparisons = (): ComparisonContextType => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparisons must be used within a ComparisonProvider');
  }
  return context;
};