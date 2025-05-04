# Time Comparisons Feature Implementation Guide

This document provides an overview of the new Time Comparisons feature, which adds fun and interesting comparisons of your tracked time to various real-world activities and phenomena.

## Feature Overview

The Time Comparisons feature:
- Compares total tracked time to interesting real-world activities (like "% of the Parthenon built" or listens of "Dopesmoker" by Sleep)
- Allows you to pin favorite comparisons so they remain visible
- Regenerates new comparisons to keep the experience fresh
- Displays comparisons in an engaging, card-based UI

## Implementation Files

1. **ComparisonContext.tsx**: 
   - Manages comparison data state
   - Provides pin/unpin functionality
   - Handles comparison calculations
   - Persists user preferences

2. **TimeComparisons.tsx**:
   - UI component that renders comparison cards
   - Handles pin/unpin actions
   - Provides regeneration functionality
   - Formats values appropriately

3. **StatsScreen.tsx** (Updated):
   - Integrates the TimeComparisons component
   - Displays comparison data alongside other statistics

4. **App.tsx** (Updated):
   - Wraps the application with the ComparisonProvider

## How It Works

1. **Comparison Database**:
   The system contains a variety of pre-defined comparisons across different categories:
   - Music (albums, songs)
   - Construction (historical buildings, monuments)
   - Nature (geological processes, animal behaviors)
   - Travel (flight durations, transit times)
   - Entertainment (movies, TV shows)
   - Literature (audiobooks, reading times)
   - Space (astronomical events, missions)
   - Technology (processes, operations)

2. **Calculation Logic**:
   - Each comparison has a defined time value in minutes
   - Your total tracked time is divided by each comparison's time value
   - Results show how many times you could have completed each activity

3. **Pinning System**:
   - You can pin up to 5 favorite comparisons
   - Pinned comparisons are displayed at the top of the list
   - Pins are persisted between app sessions

4. **Regeneration Feature**:
   - Press the refresh icon to get new comparison ideas
   - The system maintains a diverse mix of comparison categories
   - Pinned comparisons are preserved during regeneration

## Using the Feature

1. **Viewing Comparisons**:
   - Navigate to the Stats screen
   - Scroll down to see the Time Comparisons section
   - Your total tracked time will be compared to various activities

2. **Pinning Comparisons**:
   - Tap the bookmark icon on any comparison to pin it
   - Pinned comparisons will always appear at the top
   - You can pin up to 5 comparisons

3. **Refreshing Comparisons**:
   - Tap the refresh icon to generate new random comparisons
   - Your pinned comparisons will remain unchanged

## Technical Details

- Uses AsyncStorage for persistence with the key `habitTracker.comparisons`
- Integrates with the existing theme system for consistent styling
- Performs daily regeneration to keep content fresh
- Organized by category for variety

## Customization

If you want to add your own comparisons, edit the `BASE_FEATS` array in the `ComparisonContext.tsx` file. Each comparison needs:

```typescript
{
  name: "Comparison Name",
  timeValue: 60, // Time in minutes
  unit: "unit of measurement",
  description: "Brief explanation of the comparison",
  category: "category" // One of the predefined categories
}
```

## Future Enhancements

Potential future improvements could include:
- Category filtering
- User-created custom comparisons
- Sharing functionality for interesting comparisons
- More visual presentations of the comparisons
- Expanded comparison database

Enjoy this fun new way to visualize your time tracking data!