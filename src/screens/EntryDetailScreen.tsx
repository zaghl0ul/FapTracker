import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../hooks/useTheme';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useEntries } from '../contexts/EntriesContext';
import { format, parseISO } from 'date-fns';

type Props = NativeStackScreenProps<RootStackParamList, 'EntryDetail'>;

const EntryDetailScreen: React.FC<Props> = ({ route }) => {
  const { colors } = useTheme();
  const { getEntryByDate } = useEntries();
  const { date } = route.params;
  
  const entry = getEntryByDate(date);
  
  if (!entry) {
    return (
      <View style={styles.container}>
        <Text style={[styles.text, { color: colors.text }]}>Entry not found</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.primary }]}>
        Entry for {format(parseISO(entry.date), 'MMMM d, yyyy')}
      </Text>
      
      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: colors.text }]}>Count:</Text>
        <Text style={[styles.value, { color: colors.text }]}>{entry.count}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: colors.text }]}>Duration:</Text>
        <Text style={[styles.value, { color: colors.text }]}>{entry.totalDuration} minutes</Text>
      </View>
      
      {entry.note && (
        <View style={styles.noteContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Notes:</Text>
          <Text style={[styles.note, { color: colors.text }]}>{entry.note}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    width: 100,
  },
  value: {
    fontSize: 16,
  },
  noteContainer: {
    marginTop: 8,
  },
  note: {
    fontSize: 16,
    marginTop: 8,
    lineHeight: 24,
  },
});

export default EntryDetailScreen;