import React from "react";
import {View, Text, ScrollView} from "react-native";
import {styles} from "../pages/Home/style";
import {CategoryItem} from "./CategoryItem";

export type ActivityType = {
  id: string;
  name: string;
  description: string;
  image: string;
};

interface CategorySectionProps {
  title: string;
  categories: ActivityType[];
  isLoading: boolean;
  onCategoryPress: (categoryId: string) => void;
  selectedCategoryId?: string | null;
}

export function CategorySection({
  title,
  categories,
  isLoading,
  onCategoryPress,
  selectedCategoryId,
}: CategorySectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={true}>
        <View style={styles.categoriesContainer}>
          {!isLoading && categories.length > 0
            ? categories.map(category => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  onPress={onCategoryPress}
                  isSelected={selectedCategoryId === category.id}
                />
              ))
            : Array(5)
                .fill(0)
                .map((_, index) => (
                  <CategoryItem key={index} isLoading={true} />
                ))}
        </View>
      </ScrollView>
    </View>
  );
}
