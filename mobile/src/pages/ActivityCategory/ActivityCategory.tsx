import React, {useEffect, useState} from "react";
import {View, Text, FlatList, StatusBar, ScrollView} from "react-native";
import {styles} from "./style";
import {ActivityCard} from "../../components/ActivityCard";
import {CategoryHeader} from "../../components/CategoryHeader";
import {activities_api} from "../../services/api";
import {useRoute, useNavigation} from "@react-navigation/native";
import useAppContext from "../../hooks/useContext";
import {ActivityType, CategorySection} from "../../components/CategorySection";
import {ActivitySection} from "../../components/ActivitySection";
import {Activity} from "../../types/Activity";

type RouteParams = {
  categoryId: string;
  categoryName: string;
};

export default function Activities() {
  const route = useRoute();
  const navigation = useNavigation();
  const {categoryId, categoryName} = route.params as RouteParams;
  const {user} = useAppContext();
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const [userActivities, setUserActivities] = useState<Activity[]>([]);
  const [communityActivities, setCommunityActivities] = useState<Activity[]>(
    [],
  );
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<string>(categoryId);
  const [selectedCategoryName, setSelectedCategoryName] =
    useState<string>(categoryName);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchActivityTypes();
    fetchActivities(selectedCategoryId);
  }, []);

  const fetchActivityTypes = async () => {
    try {
      const response = await activities_api.get("/types");
      setActivityTypes(response.data);
    } catch (error) {
      console.error("Erro ao buscar tipos de atividades:", error);
    }
  };

  const fetchActivities = async (categoryId: string) => {
    setIsLoading(true);
    try {
      const userActivitiesResponse = await activities_api.get(
        "user/creator/all",
      );

      let filteredUserActivities = Array.isArray(userActivitiesResponse?.data)
        ? userActivitiesResponse.data
        : [];

      if (categoryId !== "all" && filteredUserActivities.length > 0) {
        if (activityTypes.length === 0) {
          console.warn("activityTypes ainda não carregado.");
        }

        filteredUserActivities = filteredUserActivities.filter(
          (activity: Activity) => {
            const activityTypeObj = activityTypes.find(
              t => t.name === activity.type,
            );
            return activityTypeObj?.id === categoryId;
          },
        );
      }

      const allActivitiesResponse = await activities_api.get("/all");
      const allActivities = Array.isArray(allActivitiesResponse?.data)
        ? allActivitiesResponse.data
        : [];

      const communityActs = allActivities.filter(
        (activity: Activity) =>
          !filteredUserActivities.some((ua: Activity) => ua.id === activity.id),
      );

      setUserActivities(filteredUserActivities);
      setCommunityActivities(communityActs);
    } catch (error) {
      console.error("Erro ao buscar atividades:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryPress = (catId: string) => {
    setSelectedCategoryId(catId);
    fetchActivities(catId);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <CategoryHeader
        title={selectedCategoryName}
        onBackPress={handleBackPress}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 20}}>
        {isLoading ? (
          <Text style={{textAlign: "center", marginTop: 20}}>
            Carregando...
          </Text>
        ) : (
          <>
            <CategorySection
              title="CATEGORIAS"
              categories={activityTypes}
              isLoading={activityTypes.length === 0}
              onCategoryPress={handleCategoryPress}
              selectedCategoryId={selectedCategoryId}
            />

            <ActivitySection title="SUAS ATIVIDADES" type="dropdown">
              <FlatList
                data={userActivities}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                  <ActivityCard
                    title={item.title}
                    date={`${new Date(item.scheduledDate).toLocaleDateString(
                      "pt-BR",
                    )} ${new Date(item.scheduledDate).toLocaleTimeString(
                      "pt-BR",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      },
                    )}`}
                    participants={item.participantCount}
                    imageSource={{
                      uri: item.image?.replace(
                        "http://localhost",
                        "http://10.0.2.2",
                      ),
                    }}
                    isPrivate={item.private}
                    isEditable={item.creator?.id === user?.id}
                    activity={item}
                  />
                )}
                ListEmptyComponent={
                  <Text style={{padding: 10}}>
                    Você não tem atividades nesta categoria
                  </Text>
                }
                scrollEnabled={false}
                nestedScrollEnabled={true}
              />
            </ActivitySection>

            <ActivitySection title="ATIVIDADES DA COMUNIDADE" type="dropdown">
              <FlatList
                data={communityActivities}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                  <ActivityCard
                    title={item.title}
                    date={`${new Date(item.scheduledDate).toLocaleDateString(
                      "pt-BR",
                    )} ${new Date(item.scheduledDate).toLocaleTimeString(
                      "pt-BR",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      },
                    )}`}
                    participants={item.participantCount}
                    imageSource={{
                      uri: item.image?.replace(
                        "http://localhost",
                        "http://10.0.2.2",
                      ),
                    }}
                    isPrivate={item.private}
                    isEditable={item.creator?.id === user?.id}
                    activity={item}
                  />
                )}
                ListEmptyComponent={
                  <Text style={{padding: 10}}>
                    Nenhuma atividade da comunidade nesta categoria
                  </Text>
                }
                scrollEnabled={false}
                nestedScrollEnabled={true}
              />
            </ActivitySection>
          </>
        )}
      </ScrollView>
    </View>
  );
}
