import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styles} from './styles';
import {CaretDown} from 'phosphor-react-native';

interface ActivitySectionProps {
  title: string;
  type: 'viewMore' | 'dropdown';
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

  const handlePress = () => {
    if (type === 'dropdown') {
      setIsExpanded(!isExpanded);
    } else if (onPress) {
      onPress();
    }
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>

        {type === 'viewMore' ? (
          <TouchableOpacity onPress={handlePress}>
            <Text style={styles.seeMore}>VER MAIS</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handlePress}>
            <CaretDown
              size={24}
              color="#000000"
              style={{transform: [{rotate: isExpanded ? '0deg' : '180deg'}]}}
            />
          </TouchableOpacity>
        )}
      </View>

      {isExpanded && children}
    </View>
  );
}
