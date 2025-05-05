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
import {Activity} from "../../types/Activity";

type ActivitiesByCategory = {
  [categoryId: string]: {
    name: string;
    activities: Activity[];
  };
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: number;
  xp: number;
  achievements: string[];
  cpf: string;
};

function Home() {
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const {token} = useAppContext();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [showAllActivities, setShowAllActivities] = useState(false);

  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);
  const insets = useSafeAreaInsets();
  const [userActivities, setUserActivities] = useState<Activity[]>([]);
  const [userPreferences, setUserPreferences] = useState<string[]>([]);

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
        console.log("Preferências do usuário:", response.data);
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
  }, [token]);

  const handleCategoryPress = (categoryId: string) => {
    const category = activityTypes.find(type => type.id === categoryId);
    if (category) {
      navigation.navigate("Activities", {
        categoryId: categoryId,
        categoryName: category.name,
      });
    }
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

      <View style={styles.header}>
        <SafeAreaView style={[styles.sectionHeader, {paddingTop: insets.top}]}>
          <View>
            <Text style={styles.greeting}>Olá, Seja Bem Vindo</Text>
            <Text style={styles.userName}>{user?.name}!</Text>
          </View>
          <View style={styles.profileContainer}>
            <View style={styles.levelContainer}>
              <Image source={Star} style={styles.star} />
              <Text style={styles.level}>{user?.level}</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate({
                  name: "Profile",
                  params: {name: user?.name || "", isError: false},
                })
              }>
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
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 20}}>
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
                  isEditable={item.creator?.id === user?.id}
                  activity={item}
                />
              )}
              ListEmptyComponent={<Text>Nenhuma atividade encontrada</Text>}
              scrollEnabled={false}
              nestedScrollEnabled={true}
              style={{height: "auto"}}
            />
          </ActivitySection>

          <CategorySection
            title="Categorias"
            categories={activityTypes}
            isLoading={activityTypes.length === 0}
            onCategoryPress={handleCategoryPress}
          />
        </>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          navigation.navigate("ActivityForm", {isEditMode: false})
        }>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Home;
