import React, {useEffect, useState} from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
} from "react-native";
import {styles} from "./style";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import Keychain from "react-native-keychain";
// @ts-ignore
import Star from "../../assets/images/star.png";
import {ActivitySection} from "../../components/ActivitySection";
import {ActivityCard} from "../../components/ActivityCard";
import {activities_api, user_api} from "../../services/api";
import useAppContext from "../../hooks/useContext";
import {ActivityType, CategorySection} from "../../components/CategorySection";
import {CategoryHeader} from "../../components/CategoryHeader";
import {PreferencesModal} from "../../components/ModalPreferences";
import {useTypedNavigation} from "../../hooks/useTypedNavigation";

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: number;
  xp: number;
  achievements: string[];
  cpf: string;
};

export type Activity = {
  id: string;
  title: string;
  description: string;
  image: string;
  scheduledDate: string;
  participantCount: number;
  private: boolean;
  type: ActivityType;
  creator: {
    id: string;
    name: string;
    avatar: string;
  };
  userSubscriptionStatus: string;
};

function Home() {
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const {token} = useAppContext();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);
  const insets = useSafeAreaInsets();
  const [userActivities, setUserActivities] = useState<Activity[]>([]);
  const [communityActivities, setCommunityActivities] = useState<Activity[]>(
    [],
  );
  const [userPreferences, setUserPreferences] = useState<string[]>([]);
  const [recommendedActivities, setRecommendedActivities] = useState<
    Activity[]
  >([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const navigation = useTypedNavigation();

  useEffect(() => {
    if (userPreferences.length === 0 && !isLoading && user) {
      setShowPreferencesModal(true);
    }
  }, [userPreferences, isLoading, user]);

  const fetchUserPreferences = async () => {
    try {
      if (token) {
        const response = await user_api.get("/preferences");
        setUserPreferences(response.data || []);
        const preferenceIds =
          response.data.map((pref: {typeId: any}) => pref.typeId) || [];
        setUserPreferences(preferenceIds);
      }
    } catch (error) {
      console.error("Erro ao buscar preferências:", error);
    }
  };

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const credentials = await Keychain.getGenericPassword();
      const allCredentials = await Keychain.getAllGenericPasswordServices();
      console.log("Serviços disponíveis no Keychain:", allCredentials);
      const tokenCredentials = await Keychain.getGenericPassword({
        service: "com.reactexample.token",
      });
      console.log("Token no Keychain existe?", !!tokenCredentials);
      if (credentials) {
        setUser(JSON.parse(credentials.password));
      }

      if (token) {
        user_api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        console.log("Fazendo requisição GET para /user");
        const response = await user_api.get("/");
        console.log("Resposta do usuário:", response.status, response.data);
        setUser(response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async (selectedPrefs: string[]) => {
    try {
      await user_api.post("/preferences/define", selectedPrefs);
      setUserPreferences(selectedPrefs);
      setShowPreferencesModal(false);
      fetchActivities();
    } catch (error) {
      console.error("Erro ao salvar preferências:", error);
    }
  };

  const fetchActivityTypes = async () => {
    try {
      if (token) {
        activities_api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
        console.log("Token:", token);
        const response = await activities_api.get("/types");
        setActivityTypes(response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar tipos de atividades:", error);
    }
  };

  const fetchActivities = async () => {
    try {
      if (token) {
        activities_api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;

        if (userPreferences.length > 0) {
          // Deve buscar as preferencias do usuário com parametros na URL que permitem filtra pelo typeId no endpoint /all se o user não tiver preferencias abre o modal
          const response = await activities_api.get(
            "/all?typeId=" + userPreferences.join(","),
          );
          setRecommendedActivities(response.data);
        }

        const response = await activities_api.get("/all");
        setAllActivities(response.data);
        setActivities(response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar atividades:", error);
    }
  };

  useEffect(() => {
    fetchUserPreferences();
    fetchActivityTypes();
    fetchActivities();
    fetchUser();
  }, []);

  const handleCategoryPress = (categoryId: string) => {
    if (selectedCategoryId === categoryId) {
      // Desseleciona a categoria se já estiver selecionada
      setSelectedCategoryId(null);
      setActivities(allActivities);
    } else {
      // Seleciona a categoria e filtra atividades
      setSelectedCategoryId(categoryId);

      // Filtrar atividades por categoria
      const filtered = allActivities.filter(
        activity => activity.type.id === categoryId,
      );
      setActivities(filtered);

      const userActs = filtered.filter(
        activity =>
          activity.creator?.id === user?.id ||
          activity.userSubscriptionStatus === "SUBSCRIBED" ||
          activity.userSubscriptionStatus === "CONFIRMED",
      );

      const communityActs = filtered.filter(
        activity => !userActs.some(ua => ua.id === activity.id),
      );

      setUserActivities(userActs);
      setCommunityActivities(communityActs);
    }
  };

  const handleBackPress = () => {
    setSelectedCategoryId(null);
    setActivities(allActivities);
  };

  const navigateToAllActivities = () => {
    let targetCategoryId: string | null = null;
    let targetCategoryName = "";

    if (userPreferences.length > 0) {
      const randomIndex = Math.floor(Math.random() * userPreferences.length);
      targetCategoryId = userPreferences[randomIndex];

      const category = activityTypes.find(type => type.id === targetCategoryId);
      if (category) {
        targetCategoryName = category.name;
      }
    } else if (activityTypes.length > 0) {
      const randomIndex = Math.floor(Math.random() * activityTypes.length);
      targetCategoryId = activityTypes[randomIndex].id;
      targetCategoryName = activityTypes[randomIndex].name;
    }

    if (targetCategoryId) {
      navigation.navigate("Activities", {
        categoryId: targetCategoryId,
        categoryName: targetCategoryName,
      });
    } else {
      setShowAllActivities(true);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <PreferencesModal
        visible={showPreferencesModal}
        activityTypes={activityTypes}
        userPreferences={userPreferences}
        onChangePreferences={setUserPreferences}
        onSavePreferences={savePreferences}
      />

      {!selectedCategoryId ? (
        <View style={styles.header}>
          <SafeAreaView
            style={[styles.sectionHeader, {paddingTop: insets.top}]}>
            <View>
              <Text style={styles.greeting}>Olá, Seja Bem Vindo</Text>
              <Text style={styles.userName}>{user?.name}!</Text>
            </View>
            <View style={styles.profileContainer}>
              <View style={styles.levelContainer}>
                <Image source={Star} style={styles.star} />
                <Text style={styles.level}>{user?.level}</Text>
              </View>
              <Image
                source={{
                  uri:
                    user?.avatar?.replace(
                      "http://localhost",
                      "http://10.0.2.2",
                    ) || "https://github.com/shadcn.png",
                }}
                style={styles.profileImage}
              />
            </View>
          </SafeAreaView>
        </View>
      ) : (
        <CategoryHeader
          title={
            activityTypes.find(t => t.id === selectedCategoryId)?.name ||
            "CATEGORIA"
          }
          onBackPress={handleBackPress}
        />
      )}

      <ScrollView style={styles.content} nestedScrollEnabled={true}>
        {!selectedCategoryId ? (
          <>
            <ActivitySection
              type="viewMore"
              title="Suas Recomendações"
              onPress={navigateToAllActivities}>
              <FlatList
                data={showAllActivities ? activities : activities.slice(0, 2)}
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
                  />
                )}
                ListEmptyComponent={<Text>Nenhuma atividade encontrada</Text>}
                scrollEnabled={true}
                nestedScrollEnabled={false}
              />
            </ActivitySection>

            <CategorySection
              title="Categorias"
              categories={activityTypes}
              isLoading={activityTypes.length === 0}
              onCategoryPress={handleCategoryPress}
              selectedCategoryId={selectedCategoryId}
            />
          </>
        ) : (
          <>
            <CategorySection
              title="CATEGORIAS"
              categories={activityTypes}
              isLoading={activityTypes.length === 0}
              onCategoryPress={handleCategoryPress}
              selectedCategoryId={selectedCategoryId}
            />

            <ActivitySection
              type="viewMore"
              title="SUAS ATIVIDADES"
              onPress={() => {
                navigateToAllActivities();
              }}>
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
                  />
                )}
                ListEmptyComponent={
                  <Text>Você não tem atividades nesta categoria</Text>
                }
                scrollEnabled={true}
                nestedScrollEnabled={false}
              />
            </ActivitySection>

            <ActivitySection type="dropdown" title="ATIVIDADES DA COMUNIDADE">
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
                  />
                )}
                ListEmptyComponent={<Text>Nenhuma atividade encontrada</Text>}
                scrollEnabled={true}
                nestedScrollEnabled={false}
              />
            </ActivitySection>
          </>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
export default Home;
