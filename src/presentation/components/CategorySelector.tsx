import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Category } from '../../domain/entities/Category';

interface CategorySelectorProps {
categories: Category[];
selectedCategoryId?: number;
onSelect: (categoryId: number) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
categories,
selectedCategoryId,
onSelect,
}) => {
return (
  <View style={styles.container}>
    <Text style={styles.label}>Categoria do gasto</Text>
    <View style={styles.categoriesGrid}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryButton,
            { backgroundColor: category.color + '20' },
            selectedCategoryId === category.id && {
              borderWidth: 2,
              borderColor: category.color,
            },
          ]}
          onPress={() => onSelect(category.id!)}
        >
          <Text style={styles.categoryIcon}>{category.icon}</Text>
          <Text style={styles.categoryName}>{category.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
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
categoriesGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 12,
},
categoryButton: {
  alignItems: 'center',
  padding: 12,
  borderRadius: 12,
  width: '30%',
},
categoryIcon: {
  fontSize: 28,
  marginBottom: 4,
},
categoryName: {
  fontSize: 11,
  color: '#666',
  textAlign: 'center',
},
});