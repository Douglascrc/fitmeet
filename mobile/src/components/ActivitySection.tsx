import React, {useState} from "react";
import {View, Text, TouchableOpacity} from "react-native";
import {styles} from "../pages/Home/style";
import {CaretDown} from "phosphor-react-native";

interface ActivitySectionProps {
  title: string;
  type: "viewMore" | "dropdown";
  children: React.ReactNode;
  onPress?: () => void;
}

export function ActivitySection({
  title,
  type,
  children,
  onPress,
}: ActivitySectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showViewMore, setShowViewMore] = useState(type === "viewMore");

  const handlePress = () => {
    if (type === "viewMore" && showViewMore) {
      setShowViewMore(false);
      if (onPress) onPress();
    } else {
      setIsExpanded(!isExpanded);
      if (onPress) onPress();
    }
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>

        <TouchableOpacity onPress={handlePress}>
          {type === "viewMore" && showViewMore ? (
            <Text style={styles.seeMore}>VER MAIS</Text>
          ) : (
            <CaretDown
              size={24}
              color="#000000"
              style={{transform: [{rotate: isExpanded ? "0deg" : "180deg"}]}}
            />
          )}
        </TouchableOpacity>
      </View>

      {isExpanded && children}
    </View>
  );
}
