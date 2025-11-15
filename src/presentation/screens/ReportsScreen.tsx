import React, { useEffect, useState } from 'react';
import {
View,
Text,
StyleSheet,
ScrollView,
Dimensions,
} from 'react-native';
import { useAppStore } from '../../application/store/useAppStore';
import { PieChart, BarChart } from 'react-native-chart-kit';

export const ReportsScreen = () => {
const { expenses, emotions, categories } = useAppStore();

const expensesByEmotion = emotions.map((emotion) => {
  const emotionExpenses = expenses.filter((e) => e.emotionId === emotion.id);
  const total = emotionExpenses.reduce((sum, e) => sum + e.amount, 0);
  return {
    name: emotion.name,
    amount: total,
    color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  };
}).filter((item) => item.amount > 0);

const expensesByCategory = categories.map((category) => {
  const categoryExpenses = expenses.filter((e) => e.categoryId === category.id);
  const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
  return {
    name: category.name,
    amount: total,
    color: category.color,
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  };
}).filter((item) => item.amount > 0);

const screenWidth = Dimensions.get('window').width;

return (
  <ScrollView style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.title}>Relatórios 📊</Text>
    </View>

    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Gastos por Emoção</Text>
      {expensesByEmotion.length > 0 ? (
        <PieChart
          data={expensesByEmotion}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      ) : (
        <Text style={styles.emptyText}>Nenhum dado disponível</Text>
      )}
    </View>

    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Gastos por Categoria</Text>
      {expensesByCategory.length > 0 ? (
        <PieChart
          data={expensesByCategory}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      ) : (
        <Text style={styles.emptyText}>Nenhum dado disponível</Text>
      )}
    </View>

    <View style={styles.summaryContainer}>
      <Text style={styles.chartTitle}>Resumo por Emoção</Text>
      {expensesByEmotion.map((item, index) => (
        <View key={index} style={styles.summaryItem}>
          <View style={[styles.colorDot, { backgroundColor: item.color }]} />
          <Text style={styles.summaryName}>{item.name}</Text>
          <Text style={styles.summaryAmount}>R$ {item.amount.toFixed(2)}</Text>
        </View>
      ))}
    </View>
  </ScrollView>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#f8f9fa',
},
header: {
  padding: 20,
  backgroundColor: '#2196F3',
  paddingTop: 60,
},
title: {
  fontSize: 28,
  fontWeight: 'bold',
  color: '#fff',
},
chartContainer: {
  backgroundColor: '#fff',
  margin: 16,
  padding: 16,
  borderRadius: 12,
  elevation: 2,
},
chartTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 16,
  color: '#333',
},
emptyText: {
  textAlign: 'center',
  color: '#999',
  fontStyle: 'italic',
  paddingVertical: 40,
},
summaryContainer: {
  backgroundColor: '#fff',
  margin: 16,
  padding: 16,
  borderRadius: 12,
  elevation: 2,
},
summaryItem: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderBottomColor: '#f0f0f0',
},
colorDot: {
  width: 12,
  height: 12,
  borderRadius: 6,
  marginRight: 12,
},
summaryName: {
  flex: 1,
  fontSize: 14,
  color: '#333',
},
summaryAmount: {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#2196F3',
},
});