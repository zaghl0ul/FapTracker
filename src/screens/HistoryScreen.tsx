import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

const HistoryScreen: React.FC = () => {
  const { colors } = useTheme();
  
  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: colors.text }]}>
        History Screen - Coming Soon
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default HistoryScreen;