import React from 'react';
import {View, Text, Image} from 'react-native';
import {styles} from '../pages/Home/style';

interface ActivityCardProps {
  title: string;
  date: string;
  participants: number;
  imageSource: any;
}

export function ActivityCard({
  title,
  date,
  participants,
  imageSource,
}: ActivityCardProps) {
  return (
    <View style={styles.activityCard}>
      <Image source={imageSource} style={styles.activityImage} />
      <Text style={styles.activityTitle}>{title}</Text>
      <View style={styles.activityInfo}>
        <Text style={styles.activityDate}>{date}</Text>
        <Text style={styles.separator}>|</Text>
        <Text style={styles.participants}>{participants}</Text>
      </View>
    </View>
  );
}
