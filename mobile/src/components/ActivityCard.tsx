import React from "react";
import {View, Text, Image, TouchableOpacity} from "react-native";
import {styles} from "../pages/Home/style";

// @ts-ignore
import CalendarIcon from "../assets/images/calendar.png";
// @ts-ignore
import GroupIcon from "../assets/images/group.png";
// @ts-ignore
import PrivateIcon from "../assets/images/private.png";
import {useTypedNavigation} from "../hooks/useTypedNavigation";
import {Activity} from "../types/Activity";

interface ActivityCardProps {
  id?: string;
  title: string;
  date: string;
  participants: number;
  imageSource: any;
  isPrivate?: boolean;
  isEditable: boolean;
  onPress?: (id: string) => void;
  activity?: Activity;
}

export function ActivityCard({
  id,
  title,
  date,
  participants,
  imageSource,
  isPrivate = false,
  isEditable = false,
  onPress,
  activity,
}: ActivityCardProps) {
  const navigation = useTypedNavigation();

  const handlePress = () => {
    if (activity) {
      navigation.navigate("ActivityDescription", {activity: activity});
    } else if (id && onPress) {
      onPress(id);
    }
  };
  return (
    <TouchableOpacity
      style={styles.activityCard}
      onPress={handlePress}
      disabled={!activity && (!onPress || !id)}>
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.activityImage} />
        {isPrivate && (
          <View style={styles.privateIconContainer}>
            <Image source={PrivateIcon} style={styles.privateIcon} />
          </View>
        )}
      </View>
      <Text style={styles.activityTitle}>{title}</Text>
      <View style={styles.activityInfo}>
        <View style={styles.infoItem}>
          <Image source={CalendarIcon} />
          <Text style={styles.activityDate}>{date}</Text>
        </View>
        <Text style={styles.separator}>|</Text>
        <View style={styles.infoItem}>
          <Image source={GroupIcon} style={styles.infoIcon} />
          <Text style={styles.participants}>{participants}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
