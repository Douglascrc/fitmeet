import React, {useState, useEffect} from "react";
import {useRoute} from "@react-navigation/native";
import Geocoder from "react-native-geocoding";
import ActivityDescription from "../components/ActivityDescription/ActivityDescription";
import {useTypedNavigation} from "../hooks/useTypedNavigation";
import useAppContext from "../hooks/useContext";
import {MainStackParamList} from "../routes/AppRoutes";
import type {RouteProp} from "@react-navigation/native";
import {Activity} from "../types/Activity";
import {ParticipantStatus} from "../types/ActivityProps";

const mapStringToStatus = (status: string): ParticipantStatus | undefined => {
  switch (status) {
    case "NOT_SUBSCRIBED":
      return ParticipantStatus.NOT_SUBSCRIBED;
    case "PENDING":
      return ParticipantStatus.PENDING;
    case "APPROVED":
      return ParticipantStatus.APPROVED;
    case "DENIED":
      return ParticipantStatus.DENIED;
    case "CHECKED_IN":
      return ParticipantStatus.CHECKED_IN;
    case "ACTIVITY_ENDED":
      return ParticipantStatus.ACTIVITY_ENDED;
    default:
      return undefined;
  }
};

const mapToActivityProps = (activity: Activity) => {
  const now = new Date();
  const scheduledDate = new Date(activity.scheduledDate);

  const isFinalized = activity.completedAt !== null || scheduledDate < now;

  return {
    ...activity,
    confirmationCode: activity.confirmationCode ?? undefined,
    location: {
      latitude: activity.address.latitude,
      longitude: activity.address.longitude,
      address: "",
    },
    isFinalized,
    userSubscriptionStatus: mapStringToStatus(activity.userSubscriptionStatus),
  };
};

const ActivityDetails = () => {
  const route =
    useRoute<RouteProp<MainStackParamList, "ActivityDescription">>();
  const {activity: rawActivity} = route.params;
  const [activity, setActivity] = useState(mapToActivityProps(rawActivity));

  const navigation = useTypedNavigation();
  const {user} = useAppContext();
  const userId = user?.id;

  const handleClose = () => {
    navigation.goBack();
  };

  const handleEdit = () => {
    navigation.navigate("ActivityForm", {
      activityId: activity.id,
      isEditMode: true,
    });
  };

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const {latitude, longitude} = rawActivity.address;
        const response = await Geocoder.from(latitude, longitude);

        if (response.results.length > 0) {
          const formattedAddress = response.results[0].formatted_address;

          setActivity(prev => ({
            ...prev,
            location: {
              ...prev.location,
              address: formattedAddress,
            },
          }));
        }
      } catch (error) {
        console.error("Erro ao converter coordenadas em endereço:", error);
      }
    };

    fetchAddress();
  }, [rawActivity]);

  return (
    <ActivityDescription
      activity={activity}
      onClose={handleClose}
      onEdit={activity.creator.id === userId ? handleEdit : undefined}
    />
  );
};

export default ActivityDetails;
