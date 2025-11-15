import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Insight } from '../../application/services/InsightsService';

interface InsightCardProps {
insight: Insight;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
const getBackgroundColor = () => {
  switch (insight.type) {
    case 'warning':
      return '#FFF3E0';
    case 'success':
      return '#E8F5E9';
    default:
      return '#E3F2FD';
  }
};

return (
  <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
    <Text style={styles.icon}>{insight.icon}</Text>
    <Text style={styles.message}>{insight.message}</Text>
  </View>
);
};

const styles = StyleSheet.create({
container: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 16,
  borderRadius: 12,
  marginBottom: 12,
},
icon: {
  fontSize: 24,
  marginRight: 12,
},
message: {
  flex: 1,
  fontSize: 14,
  color: '#333',
  lineHeight: 20,
},
});