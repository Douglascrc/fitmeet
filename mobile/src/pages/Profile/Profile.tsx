import React, {useEffect, useState, useRef} from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import useAppContext from "../../hooks/useContext";
import {activities_api, user_api} from "../../services/api";
import {ActivityCard} from "../../components/ActivityCard";
import {styles} from "./style";
import {User} from "../Home/Home";
import {useTypedNavigation} from "../../hooks/useTypedNavigation";
import {CaretLeft, Medal, PencilSimple, SignOut} from "phosphor-react-native";
import {ActivitySection} from "../../components/ActivitySection";
import {Activity} from "../../types/Activity";
import Toast from "react-native-toast-message";

const {width} = Dimensions.get("window");
const CARD_WIDTH = Math.min(width - 26, 403);

export function Profile() {
  const {token, logout} = useAppContext();
  const [user, setUser] = useState<User | null>(null);
  const [userActivities, setUserActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  const flatListRef = useRef<FlatList>(null);
  const navigation = useTypedNavigation();

  useEffect(() => {
    fetchUserData();
    fetchUserActivities();
  }, []);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      if (token) {
        user_api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await user_api.get("/");
        setUser(response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserActivities = async () => {
    try {
      if (token) {
        const response = await activities_api.get("/user/creator/all");
        console.log("Atividades do usuário:", response.data);
        setUserActivities(response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar atividades do usuário:", error);
    }
  };

  const renderCard = ({item, index}: {item: any; index: number}) => {
    if (index === 0) {
      return (
        <View style={[styles.card, {width: CARD_WIDTH}]}>
          <Medal size={32} />

          <View style={styles.levelCardContent}>
            <View>
              <Text style={styles.levelLabel}>Seu nível é</Text>
              <Text style={styles.levelNumber}>{user?.level || 0}</Text>
            </View>

            <View style={styles.trophyContainer}>
              <Image
                source={require("../../assets/images/trofeu.png")}
                style={styles.trophyImage}
                resizeMode="contain"
              />
            </View>
          </View>

          <Text style={styles.pointsLabel}>Pontos para o próximo nível</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progress,
                  {width: `${((user?.xp || 0) % 50) * 2}%`},
                ]}
              />
            </View>
            <Text style={styles.pointsText}>{(user?.xp ?? 0) % 50}/50 pts</Text>
          </View>
        </View>
      );
    } else if (index === 1) {
      return (
        <View style={[styles.card, {width: CARD_WIDTH}]}>
          <View style={styles.achievementsGrid}>
            {user?.achievements && user.achievements.length > 0 ? (
              user.achievements
                .slice(0, 2)
                .map((achievement: {criterion: string} | string, i) => (
                  <View key={i} style={styles.achievementItem}>
                    <Image
                      source={require("../../assets/images/medalha.png")}
                      style={styles.achievementIcon}
                      resizeMode="contain"
                    />
                    <Text style={styles.achievementName} numberOfLines={2}>
                      {typeof achievement === "string"
                        ? achievement
                        : achievement.criterion || "Conquista"}
                    </Text>
                  </View>
                ))
            ) : (
              <Text style={styles.noAchievements}>
                Ainda não possui conquistas
              </Text>
            )}
          </View>
        </View>
      );
    }
    return null;
  };

  const renderPaginationDots = () => {
    return (
      <View style={styles.paginationContainer}>
        {[0, 1].map(i => (
          <View
            key={i}
            style={[
              styles.paginationDot,
              i === activeSlide ? styles.paginationDotActive : {},
            ]}
          />
        ))}
      </View>
    );
  };

  const handleScroll = (event: {nativeEvent: {contentOffset: {x: any}}}) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffset / CARD_WIDTH);
    setActiveSlide(currentIndex);
  };

  const handleLogout = () => {
    Toast.show({
      type: "info",
      text1: "Saindo...",
      text2: "Você será desconectado em breve.",
      visibilityTime: 1500,
      onHide: () => {
        logout();
        navigation.navigate({
          name: "Login",
          params: {name: "Login", isError: false},
        });
      },
    });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <View style={styles.header}>
        <SafeAreaView style={styles.headerSafeArea}>
          <TouchableOpacity
            style={styles.headerLeft}
            activeOpacity={1}
            hitSlop={{top: 25, bottom: 25, left: 25, right: 25}}
            onPress={() => navigation.goBack()}>
            <CaretLeft size={32} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>PERFIL</Text>

          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() =>
                navigation.navigate({
                  name: "EditProfile",
                  params: {name: "EditProfile", userId: user?.id},
                })
              }>
              <PencilSimple size={32} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
              <SignOut size={32} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.profileInfo}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: user?.avatar?.replace("http://localhost", "http://10.0.2.2"),
            }}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.name}>{user?.name}</Text>
      </View>

      <ScrollView
        style={[styles.scrollView]}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.carouselContainer}>
          <FlatList
            ref={flatListRef}
            data={[{id: "level"}, {id: "achievements"}]}
            renderItem={renderCard}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToInterval={CARD_WIDTH}
            snapToAlignment="center"
            decelerationRate="fast"
            contentContainerStyle={{marginRight: 13}}
            onScroll={handleScroll}
            onMomentumScrollEnd={handleScroll}
            initialNumToRender={2}
            style={{overflow: "visible"}}
          />
          {renderPaginationDots()}
        </View>

        <View style={styles.activitiesSection}>
          <ActivitySection title="SUAS ATIVIDADES" type="dropdown">
            {userActivities.length > 0 ? (
              userActivities.map(item => (
                <ActivityCard
                  key={item.id}
                  title={item.title}
                  date={`${new Date(item.scheduledDate).toLocaleDateString(
                    "pt-BR",
                  )} ${new Date(item.scheduledDate).toLocaleTimeString(
                    "pt-BR",
                    {hour: "2-digit", minute: "2-digit", hour12: false},
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
              ))
            ) : (
              <Text style={styles.noActivities}>
                Nenhuma atividade encontrada
              </Text>
            )}
          </ActivitySection>
        </View>

        <View style={styles.activitiesSection}>
          <ActivitySection title="Histórico de Atividades" type="dropdown">
            {userActivities.map(item => (
              <ActivityCard
                key={item.id}
                title={item.title}
                date={`${new Date(item.scheduledDate).toLocaleDateString(
                  "pt-BR",
                )} ${new Date(item.scheduledDate).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}`}
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
            ))}
          </ActivitySection>
        </View>
      </ScrollView>
    </View>
  );
}

export default Profile;
