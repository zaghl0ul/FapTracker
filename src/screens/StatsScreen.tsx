import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions
} from 'react-native';
import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryTooltip,
  VictoryLabel
} from 'victory-native';
import { format, subDays, parseISO, eachDayOfInterval } from 'date-fns';
import { useTheme } from '../hooks/useTheme';
import { useEntries } from '../contexts/EntriesContext';
import { useStats } from '../hooks/useStats';

// Get screen dimensions for responsive charts
const screenWidth = Dimensions.get('window').width;

const StatsScreen: React.FC = () => {
  const { colors, dark } = useTheme();
  const { entries } = useEntries();
  const stats = useStats(entries);
  
  // Chart range state
  const [chartRange, setChartRange] = useState<'week' | 'month' | 'year'>('week');
  
  // Calculate chart data based on selected range
  const chartData = useCallback(() => {
    if (entries.length === 0) return [];
    
    const now = new Date();
    let startDate, endDate;
    let dateFormat;
    
    switch (chartRange) {
      case 'week':
        startDate = subDays(now, 6);
        endDate = now;
        dateFormat = 'EEE';
        break;
      case 'month':
        startDate = subDays(now, 29);
        endDate = now;
        dateFormat = 'MMM d';
        break;
      case 'year':
        startDate = subDays(now, 364);
        endDate = now;
        dateFormat = 'MMM';
        break;
      default:
        startDate = subDays(now, 6);
        endDate = now;
        dateFormat = 'EEE';
    }
    
    // Create array of all days in range
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
    
    // Map to chart data format
    return dateRange.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const entry = entries.find(e => e.date === dateStr);
      
      return {
        date: format(date, dateFormat),
        count: entry?.count || 0,
        duration: entry?.totalDuration || 0,
        fullDate: dateStr
      };
    });
  }, [entries, chartRange]);
  
  // Format duration for display
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${mins}m`;
    }
  };
  
  // Get color based on value comparison
  const getComparisonColor = (current: number, previous: number): string => {
    if (previous === 0) return colors.text;
    return current >= previous ? colors.success : colors.error;
  };
  
  // Calculate percentage change
  const getPercentChange = (current: number, previous: number): string => {
    if (previous === 0) return current > 0 ? '∞%' : '0%';
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(0)}%`;
  };
  
  // Generate stat description based on value
  const getStatDescription = (stat: string, value: number): string => {
    switch(stat) {
      case 'total':
        if (value === 0) return "Starting fresh";
        if (value < 10) return "Just getting started";
        if (value < 50) return "Building momentum";
        if (value < 100) return "Quite the enthusiast";
        if (value < 200) return "Dedicated tracker";
        return "Legendary status";
        
      case 'streak':
        if (value === 0) return "Taking a break";
        if (value < 3) return "Getting into rhythm";
        if (value < 7) return "Consistent tracker";
        if (value < 14) return "Dedication personified";
        if (value < 30) return "Unstoppable force";
        return "Impressive persistence";
        
      case 'avg':
        if (value === 0) return "The calm";
        if (value < 1) return "Occasional practice";
        if (value < 2) return "Regular enthusiast";
        if (value < 3) return "Devoted practitioner";
        if (value < 5) return "Elite-level focus";
        return "Exceptional dedication";
        
      default:
        return "";
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      {/* Stats Grid */}
      <View style={styles.statGrid}>
        {/* Total Count */}
        <TouchableOpacity 
          style={[styles.statBox, { backgroundColor: dark ? 'rgba(31, 41, 55, 0.7)' : 'rgba(243, 244, 246, 0.7)' }]}
          activeOpacity={0.7}
        >
          <Text style={[styles.statValue, { color: colors.primary }]}>{stats.total}</Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>Total Count</Text>
          <Text style={[styles.statDesc, { color: colors.accent }]}>
            {getStatDescription('total', stats.total)}
          </Text>
        </TouchableOpacity>
        
        {/* Total Duration */}
        <TouchableOpacity 
          style={[styles.statBox, { backgroundColor: dark ? 'rgba(31, 41, 55, 0.7)' : 'rgba(243, 244, 246, 0.7)' }]}
          activeOpacity={0.7}
        >
          <Text style={[styles.statValue, { color: colors.primary }]}>
            {formatDuration(stats.totalDuration)}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>Total Time</Text>
          <Text style={[styles.statDesc, { color: colors.accent }]}>
            {stats.totalDuration > 0 ? "That's dedication!" : "Clock's still ticking"}
          </Text>
        </TouchableOpacity>
        
        {/* Daily Average */}
        <TouchableOpacity 
          style={[styles.statBox, { backgroundColor: dark ? 'rgba(31, 41, 55, 0.7)' : 'rgba(243, 244, 246, 0.7)' }]}
          activeOpacity={0.7}
        >
          <Text style={[styles.statValue, { color: colors.primary }]}>{stats.avg.toFixed(1)}</Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>Daily Average</Text>
          <Text style={[styles.statDesc, { color: colors.accent }]}>
            {getStatDescription('avg', stats.avg)}
          </Text>
        </TouchableOpacity>
        
        {/* Current Streak */}
        <TouchableOpacity 
          style={[styles.statBox, { backgroundColor: dark ? 'rgba(31, 41, 55, 0.7)' : 'rgba(243, 244, 246, 0.7)' }]}
          activeOpacity={0.7}
        >
          <Text style={[styles.statValue, { color: colors.primary }]}>{stats.streak}</Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>Current Streak</Text>
          <Text style={[styles.statDesc, { color: colors.accent }]}>
            {getStatDescription('streak', stats.streak)}
          </Text>
        </TouchableOpacity>
        
        {/* Longest Streak */}
        <TouchableOpacity 
          style={[styles.statBox, { backgroundColor: dark ? 'rgba(31, 41, 55, 0.7)' : 'rgba(243, 244, 246, 0.7)' }]}
          activeOpacity={0.7}
        >
          <Text style={[styles.statValue, { color: colors.primary }]}>{stats.longest}</Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>Longest Streak</Text>
          <Text style={[styles.statDesc, { color: colors.accent }]}>
            {stats.longest > 0 ? 
              (stats.longest === stats.streak ? "You're at your peak!" : "Your personal best!")
              : "The journey begins"}
          </Text>
        </TouchableOpacity>
        
        {/* Daily Record */}
        <TouchableOpacity 
          style={[styles.statBox, { backgroundColor: dark ? 'rgba(31, 41, 55, 0.7)' : 'rgba(243, 244, 246, 0.7)' }]}
          activeOpacity={0.7}
        >
          <Text style={[styles.statValue, { color: colors.primary }]}>{stats.dailyMax}</Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>Daily Record</Text>
          <Text style={[styles.statDesc, { color: colors.accent }]}>
            {stats.dailyMax > 5 ? "Impressive stamina!" : 
             stats.dailyMax > 3 ? "Notable achievement!" : 
             stats.dailyMax > 0 ? "Personal record" : "Yet to be set"}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Activity Chart */}
      <View style={styles.chartSection}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Activity Over Time</Text>
        
        {/* Range Selector */}
        <View style={styles.rangeSelector}>
          <TouchableOpacity 
            style={[
              styles.rangeButton, 
              chartRange === 'week' && { backgroundColor: colors.primary }
            ]}
            onPress={() => setChartRange('week')}
          >
            <Text 
              style={[
                styles.rangeButtonText, 
                chartRange === 'week' ? { color: 'white' } : { color: colors.text }
              ]}
            >
              Week
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.rangeButton, 
              chartRange === 'month' && { backgroundColor: colors.primary }
            ]}
            onPress={() => setChartRange('month')}
          >
            <Text 
              style={[
                styles.rangeButtonText, 
                chartRange === 'month' ? { color: 'white' } : { color: colors.text }
              ]}
            >
              Month
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.rangeButton, 
              chartRange === 'year' && { backgroundColor: colors.primary }
            ]}
            onPress={() => setChartRange('year')}
          >
            <Text 
              style={[
                styles.rangeButtonText, 
                chartRange === 'year' ? { color: 'white' } : { color: colors.text }
              ]}
            >
              Year
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Chart */}
        <View style={styles.chartContainer}>
          {entries.length > 0 ? (
            <VictoryChart
              width={screenWidth - 40}
              height={250}
              domainPadding={20}
              theme={VictoryTheme.material}
              padding={{ top: 20, bottom: 50, left: 50, right: 20 }}
            >
              <VictoryAxis
                tickFormat={(t) => t}
                style={{
                  axis: { stroke: colors.text },
                  ticks: { stroke: colors.text },
                  tickLabels: { fill: colors.text, fontSize: 10 }
                }}
              />
              <VictoryAxis
                dependentAxis
                tickFormat={(t) => t}
                style={{
                  axis: { stroke: colors.text },
                  ticks: { stroke: colors.text },
                  tickLabels: { fill: colors.text, fontSize: 10 }
                }}
              />
              <VictoryBar
                data={chartData()}
                x="date"
                y="count"
                style={{
                  data: { fill: colors.primary, width: chartRange === 'year' ? 12 : chartRange === 'month' ? 14 : 20 }
                }}
                labels={({ datum }) => datum.count > 0 ? `${datum.count}× on ${format(parseISO(datum.fullDate), 'MMM d')}` : ''}
                labelComponent={
                  <VictoryTooltip
                    flyoutStyle={{
                      fill: dark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                      stroke: colors.primary,
                      strokeWidth: 1
                    }}
                    style={{ fill: colors.text, fontSize: 10 }}
                  />
                }
              />
            </VictoryChart>
          ) : (
            <View style={styles.emptyChart}>
              <Text style={[styles.emptyText, { color: colors.text }]}>
                No data available yet. Start tracking to see your activity chart!
              </Text>
            </View>
          )}
        </View>
      </View>
      
      {/* Time Period Comparison */}
      <View style={styles.comparisonSection}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Time Period Comparison</Text>
        
        <View style={styles.comparisonGrid}>
          {/* This Week vs Last Week */}
          <View style={[styles.comparisonItem, { 
            backgroundColor: dark ? 'rgba(31, 41, 55, 0.5)' : 'rgba(243, 244, 246, 0.5)' 
          }]}>
            <Text style={[styles.comparisonLabel, { color: colors.text }]}>This Week</Text>
            <View style={styles.comparisonValue}>
              <Text style={[styles.primaryValue, { color: colors.primary }]}>
                {stats.thisWeek}
              </Text>
              {stats.lastWeek > 0 && (
                <Text style={[styles.percentChange, { 
                  color: getComparisonColor(stats.thisWeek, stats.lastWeek) 
                }]}>
                  {getPercentChange(stats.thisWeek, stats.lastWeek)}
                </Text>
              )}
            </View>
          </View>
          
          <View style={[styles.comparisonItem, { 
            backgroundColor: dark ? 'rgba(31, 41, 55, 0.5)' : 'rgba(243, 244, 246, 0.5)' 
          }]}>
            <Text style={[styles.comparisonLabel, { color: colors.text }]}>Last Week</Text>
            <Text style={[styles.accentValue, { color: colors.accent }]}>
              {stats.lastWeek}
            </Text>
          </View>
          
          {/* This Month vs Last Month */}
          <View style={[styles.comparisonItem, { 
            backgroundColor: dark ? 'rgba(31, 41, 55, 0.5)' : 'rgba(243, 244, 246, 0.5)' 
          }]}>
            <Text style={[styles.comparisonLabel, { color: colors.text }]}>This Month</Text>
            <View style={styles.comparisonValue}>
              <Text style={[styles.primaryValue, { color: colors.primary }]}>
                {stats.thisMonth}
              </Text>
              {stats.lastMonth > 0 && (
                <Text style={[styles.percentChange, { 
                  color: getComparisonColor(stats.thisMonth, stats.lastMonth) 
                }]}>
                  {getPercentChange(stats.thisMonth, stats.lastMonth)}
                </Text>
              )}
            </View>
          </View>
          
          <View style={[styles.comparisonItem, { 
            backgroundColor: dark ? 'rgba(31, 41, 55, 0.5)' : 'rgba(243, 244, 246, 0.5)' 
          }]}>
            <Text style={[styles.comparisonLabel, { color: colors.text }]}>Last Month</Text>
            <Text style={[styles.accentValue, { color: colors.accent }]}>
              {stats.lastMonth}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statBox: {
    width: '48%',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  statDesc: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  chartSection: {
    marginBottom: 24,
  },
  rangeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  rangeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderRadius: 4,
  },
  rangeButtonText: {
    fontWeight: '500',
  },
  chartContainer: {
    alignItems: 'center',
    height: 250,
  },
  emptyChart: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  comparisonSection: {
    marginBottom: 40,
  },
  comparisonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  comparisonItem: {
    width: '48%',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  comparisonLabel: {
    fontSize: 14,
  },
  comparisonValue: {
    alignItems: 'flex-end',
  },
  primaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  accentValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  percentChange: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default StatsScreen;