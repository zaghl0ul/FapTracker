import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useComparisons, ComparisonFeat } from '../contexts/ComparisonContext';
import { useTheme } from '../hooks/useTheme';

interface TimeComparisonsProps {
  totalMinutes: number;
}

const TimeComparisons: React.FC<TimeComparisonsProps> = ({ totalMinutes }) => {
  const { colors, dark } = useTheme();
  const { 
    calculateComparison, 
    isPinned, 
    pinFeat, 
    unpinFeat, 
    regenerateFeats,
    selectNewDisplayFeats
  } = useComparisons();
  
  // Local state for animations
  const [refreshAnimation] = useState(new Animated.Value(0));
  
  // Calculate comparisons (will only return pinned and displayed comparisons)
  const comparisons = calculateComparison(totalMinutes);
  
  // Get pinned and unpinned comparisons separately
  const pinnedComparisons = comparisons.filter(comp => isPinned(comp.feat.id));
  const unpinnedComparisons = comparisons.filter(comp => !isPinned(comp.feat.id));
  
  // Handle regenerating comparisons with animation
  const handleRegenerate = useCallback(() => {
    // Start rotation animation
    Animated.timing(refreshAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      refreshAnimation.setValue(0);
      selectNewDisplayFeats(); // Just choose new display feats, don't regenerate all
    });
  }, [refreshAnimation, selectNewDisplayFeats]);
  
  // Animate the refresh icon rotation
  const spin = refreshAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  // Format the comparison value for display
  const formatComparisonValue = (value: number): string => {
    if (value < 0.01) {
      return value.toFixed(4);
    } else if (value < 0.1) {
      return value.toFixed(3);
    } else if (value < 1) {
      return value.toFixed(2);
    } else if (value < 10) {
      return value.toFixed(1);
    } else {
      return Math.round(value).toString();
    }
  };
  
  // Handle toggling pin status
  const togglePin = (feat: ComparisonFeat) => {
    if (isPinned(feat.id)) {
      unpinFeat(feat.id);
    } else {
      // Check if we have too many pins
      if (pinnedComparisons.length >= 5) {
        Alert.alert(
          "Maximum Pins Reached",
          "You can pin up to 5 comparisons. Please unpin one first.",
          [{ text: "OK" }]
        );
      } else {
        pinFeat(feat.id);
      }
    }
  };
  
  // Function to render a single comparison card
  const renderComparisonCard = (comparison: {
    feat: ComparisonFeat;
    value: number;
    percentage: number;
  }, index: number, isPinned: boolean) => {
    const { feat, value } = comparison;
    
    return (
      <View 
        key={feat.id}
        style={[
          styles.comparisonCard,
          { 
            backgroundColor: dark ? 'rgba(31, 41, 55, 0.7)' : 'rgba(243, 244, 246, 0.7)',
            borderColor: isPinned ? colors.primary : 'transparent',
            borderWidth: isPinned ? 2 : 0,
          }
        ]}
      >
        <View style={styles.comparisonHeader}>
          <View style={styles.categoryBadge}>
            <Text style={[styles.categoryText, { color: colors.text }]}>
              {feat.category.charAt(0).toUpperCase() + feat.category.slice(1)}
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={() => togglePin(feat)}
            style={styles.pinButton}
          >
            <Ionicons 
              name={isPinned ? "bookmark" : "bookmark-outline"} 
              size={22} 
              color={isPinned ? colors.primary : colors.text} 
            />
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.comparisonName, { color: colors.primary }]}>
          {feat.name}
        </Text>
        
        <View style={styles.valueContainer}>
          <Text style={[styles.comparisonValue, { color: colors.accent }]}>
            {formatComparisonValue(value)}
          </Text>
          <Text style={[styles.comparisonUnit, { color: colors.text }]}>
            {feat.unit}
          </Text>
        </View>
        
        <Text style={[styles.comparisonDescription, { color: colors.text }]}>
          {feat.description}
        </Text>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Time Comparisons</Text>
        
        <TouchableOpacity onPress={handleRegenerate} style={styles.refreshButton}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Ionicons name="refresh" size={24} color={colors.primary} />
          </Animated.View>
        </TouchableOpacity>
      </View>
      
      {totalMinutes === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: colors.text }]}>
            Track some time to see interesting comparisons!
          </Text>
        </View>
      ) : (
        <View style={styles.comparisonsContainer}>
          {/* Render all comparisons (will only include pinned + displayed ones) */}
          <View style={styles.comparisonGrid}>
            {comparisons.map((comparison, index) => 
              renderComparisonCard(comparison, index, isPinned(comparison.feat.id))
            )}
          </View>
          
          {/* Helper text */}
          <View style={styles.helperTextContainer}>
            <Text style={[styles.helperText, { color: colors.text }]}>
              🔄 Tap refresh for new comparisons • 📌 Bookmark to save
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  refreshButton: {
    padding: 8,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontStyle: 'italic',
    textAlign: 'center',
  },
  comparisonsContainer: {
    marginBottom: 8,
  },
  comparisonGrid: {
    marginBottom: 16,
  },
  comparisonCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  comparisonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  pinButton: {
    padding: 4,
  },
  comparisonName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  comparisonValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 6,
  },
  comparisonUnit: {
    fontSize: 14,
  },
  comparisonDescription: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  helperTextContainer: {
    alignItems: 'center',
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  }
});

export default TimeComparisons;