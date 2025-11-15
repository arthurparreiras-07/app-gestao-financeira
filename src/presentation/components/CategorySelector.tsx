import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../../domain/entities/Category';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../../theme/theme';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategoryId?: number;
  onSelect: (categoryId: number) => void;
}

const categoryIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  'Alimentação': 'fast-food',
  'Transporte': 'car',
  'Entretenimento': 'game-controller',
  'Compras': 'cart',
  'Saúde': 'medical',
  'Educação': 'school',
  'Outros': 'ellipsis-horizontal',
};

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategoryId,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Ionicons name="pricetags" size={20} color={colors.primary[500]} />
        <Text style={styles.label}>Categoria do gasto *</Text>
      </View>
      <View style={styles.categoriesGrid}>
        {categories.map((category) => {
          const isSelected = selectedCategoryId === category.id;
          const iconName = categoryIcons[category.name] || 'pricetag';
          
          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                { backgroundColor: `${category.color}15` },
                isSelected && {
                  backgroundColor: `${category.color}30`,
                  borderWidth: 2,
                  borderColor: category.color,
                },
              ]}
              onPress={() => onSelect(category.id!)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
                <Ionicons name={iconName} size={20} color={colors.text.inverse} />
              </View>
              <Text style={[styles.categoryName, isSelected && styles.categoryNameSelected]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryButton: {
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    width: '31%',
    ...shadows.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  categoryName: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    textAlign: 'center',
    fontWeight: fontWeight.medium,
  },
  categoryNameSelected: {
    color: colors.text.primary,
    fontWeight: fontWeight.semibold,
  },
});
