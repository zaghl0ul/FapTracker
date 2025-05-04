# Time Comparisons Feature Implementation Guide

This document provides an overview of the Time Comparisons feature, which adds fun and interesting comparisons of your tracked time to various real-world activities and phenomena.

## Feature Overview

The Time Comparisons feature:
- Displays 3 random comparisons at a time, selected on app startup
- Regenerates random comparisons when the refresh button is tapped
- Allows you to pin favorite comparisons so they remain visible
- Shows your total tracked time compared to interesting real-world activities

## Implementation Files

1. **ComparisonContext.tsx**: 
   - Manages comparison data state
   - Provides pin/unpin functionality
   - Randomly selects 3 comparisons to display
   - Persists pinned comparisons between sessions

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

2. **Display Logic**:
   - 3 random comparisons are selected on app startup
   - Pinned comparisons are prioritized in the display
   - When you pin a comparison, it will always be displayed
   - Unpinned comparisons are randomly rotated each time you refresh

3. **Calculation Logic**:
   - Each comparison has a defined time value in minutes
   - Your total tracked time is divided by each comparison's time value
   - Results show how many times you could have completed each activity

4. **Pinning System**:
   - You can pin favorite comparisons by tapping the bookmark icon
   - Pinned comparisons are preserved between app sessions
   - You can unpin a comparison by tapping the bookmark icon again
   - You can pin up to 5 comparisons at a time

## Using the Feature

1. **Viewing Comparisons**:
   - Navigate to the Stats screen
   - Scroll down to see the Time Comparisons section
   - Your total tracked time will be compared to various activities

2. **Refreshing Comparisons**:
   - Tap the refresh icon to generate new random comparisons
   - Your pinned comparisons will remain unchanged
   - Each app startup will display a fresh set of comparisons

3. **Pinning Comparisons**:
   - Tap the bookmark icon on any comparison to pin it
   - Pinned comparisons will always be displayed
   - You can pin up to 5 comparisons
   - Unpin by tapping the bookmark icon again

## Technical Details

- Uses AsyncStorage for persistence with the key `habitTracker.comparisons`
- Integrates with the existing theme system for consistent styling
- Performs random selection on app startup
- Organizes comparisons by category for variety

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