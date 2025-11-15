import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Emotion } from '../../domain/entities/Emotion';

interface EmotionSelectorProps {
emotions: Emotion[];
selectedEmotionId?: number;
onSelect: (emotionId: number) => void;
}

export const EmotionSelector: React.FC<EmotionSelectorProps> = ({
emotions,
selectedEmotionId,
onSelect,
}) => {
return (
  <View style={styles.container}>
    <Text style={styles.label}>Como você está se sentindo?</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.emotionsContainer}>
        {emotions.map((emotion) => (
          <TouchableOpacity
            key={emotion.id}
            style={[
              styles.emotionButton,
              selectedEmotionId === emotion.id && styles.emotionButtonSelected,
            ]}
            onPress={() => onSelect(emotion.id!)}
          >
            <Text style={styles.emotionIcon}>{emotion.icon}</Text>
            <Text style={styles.emotionName}>{emotion.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  </View>
);
};

const styles = StyleSheet.create({
container: {
  marginVertical: 16,
},
label: {
  fontSize: 16,
  fontWeight: '600',
  marginBottom: 12,
  color: '#333',
},
emotionsContainer: {
  flexDirection: 'row',
  gap: 12,
},
emotionButton: {
  alignItems: 'center',
  padding: 12,
  borderRadius: 12,
  backgroundColor: '#f5f5f5',
  minWidth: 80,
},
emotionButtonSelected: {
  backgroundColor: '#E8F4FD',
  borderWidth: 2,
  borderColor: '#2196F3',
},
emotionIcon: {
  fontSize: 32,
  marginBottom: 4,
},
emotionName: {
  fontSize: 12,
  color: '#666',
},
});