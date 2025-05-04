import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  Alert
} from 'react-native';
import { 
  format, 
  parseISO, 
  addDays, 
  subDays,
  isToday
} from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useEntries, Entry } from '../contexts/EntriesContext';

const LogScreen: React.FC = () => {
  const { colors } = useTheme();
  const { addEntry, getEntryByDate } = useEntries();
  
  // State
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [count, setCount] = useState(0);
  const [duration, setDuration] = useState('0');
  const [note, setNote] = useState('');
  
  // Load entry data when selected date changes
  useEffect(() => {
    const entry = getEntryByDate(selectedDate);
    if (entry) {
      setCount(entry.count);
      setDuration(entry.totalDuration.toString());
      setNote(entry.note || '');
    } else {
      setCount(0);
      setDuration('0');
      setNote('');
    }
  }, [selectedDate, getEntryByDate]);
  
  // Date navigation handlers
  const goToPreviousDay = useCallback(() => {
    setSelectedDate(prev => {
      const date = parseISO(prev);
      return format(subDays(date, 1), 'yyyy-MM-dd');
    });
  }, []);
  
  const goToNextDay = useCallback(() => {
    setSelectedDate(prev => {
      const date = parseISO(prev);
      return format(addDays(date, 1), 'yyyy-MM-dd');
    });
  }, []);
  
  const goToToday = useCallback(() => {
    setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
  }, []);
  
  // Counter handlers
  const handleIncrement = () => {
    setCount(prev => prev + 1);
  };
  
  const handleDecrement = () => {
    setCount(prev => Math.max(prev - 1, 0));
  };
  
  // Save entry handler
  const handleSave = () => {
    try {
      const parsedDuration = parseInt(duration, 10) || 0;
      
      const entry: Entry = {
        date: selectedDate,
        count: count,
        totalDuration: parsedDuration,
        note: note.trim().length > 0 ? note : undefined
      };
      
      addEntry(entry);
      Alert.alert('Success', 'Entry saved successfully.');
    } catch (error) {
      console.error('Error saving entry:', error);
      Alert.alert('Error', 'Failed to save entry. Please try again.');
    }
  };
  
  // Calculate if selected date is today
  const isSelectedDateToday = isToday(parseISO(selectedDate));
  
  // Get duration label based on minutes
  const getDurationLabel = (minutes: number): string => {
    if (minutes <= 5) return "Quick Session";
    if (minutes <= 15) return "Brief Session";
    if (minutes <= 30) return "Standard Session";
    if (minutes <= 60) return "Extended Session";
    return "Marathon Session";
  };
  
  return (
    <ScrollView style={styles.container}>
      {/* Date Selector */}
      <View style={styles.dateSelector}>
        <TouchableOpacity 
          style={[styles.dateButton, { backgroundColor: colors.primary }]}
          onPress={goToPreviousDay}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.dateDisplay}
          onPress={() => {
            // Date picker could be implemented here
            // For now, we'll just go to today
            goToToday();
          }}
        >
          <Text style={[styles.dateText, { color: colors.text }]}>
            {format(parseISO(selectedDate), 'MMMM d, yyyy')}
          </Text>
          {isSelectedDateToday && (
            <Text style={[styles.todayBadge, { backgroundColor: colors.accent }]}>
              TODAY
            </Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.dateButton, 
            { backgroundColor: colors.primary },
            isSelectedDateToday && styles.disabledButton
          ]}
          onPress={goToNextDay}
          disabled={isSelectedDateToday}
        >
          <Ionicons name="chevron-forward" size={24} color="white" />
        </TouchableOpacity>
        
        {!isSelectedDateToday && (
          <TouchableOpacity 
            style={[styles.todayButton, { backgroundColor: colors.accent }]}
            onPress={goToToday}
          >
            <Text style={styles.todayButtonText}>Today</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Counter */}
      <View style={styles.counterContainer}>
        <TouchableOpacity 
          style={[styles.counterButton, { backgroundColor: colors.accent }]}
          onPress={handleDecrement}
          disabled={count === 0}
        >
          <Text style={styles.counterButtonText}>-</Text>
        </TouchableOpacity>
        
        <View style={styles.countDisplay}>
          <Text style={[styles.countText, { color: colors.primary }]}>{count}</Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.counterButton, { backgroundColor: colors.primary }]}
          onPress={handleIncrement}
        >
          <Text style={styles.counterButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      
      {/* Duration Input */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Duration (minutes):</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            value={duration}
            onChangeText={setDuration}
            keyboardType="number-pad"
          />
          <Text style={[styles.durationLabel, { color: colors.accent }]}>
            {getDurationLabel(parseInt(duration, 10) || 0)}
          </Text>
        </View>
      </View>
      
      {/* Note Input */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Notes:</Text>
        <TextInput
          style={[styles.textArea, { color: colors.text, borderColor: colors.border }]}
          value={note}
          onChangeText={setNote}
          placeholder="Any details worth remembering?"
          placeholderTextColor="#666"
          multiline
          numberOfLines={4}
        />
      </View>
      
      {/* Save Button */}
      <TouchableOpacity 
        style={[styles.saveButton, { backgroundColor: colors.primary }]}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>Save Session</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dateButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  dateDisplay: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
  },
  todayBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  todayButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  todayButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  counterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  countDisplay: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'column',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  durationLabel: {
    marginTop: 4,
    fontSize: 14,
    fontStyle: 'italic',
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LogScreen;