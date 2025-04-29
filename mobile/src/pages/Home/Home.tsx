import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {styles} from './style';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
// @ts-ignore
import Star from '../../assets/images/star.png';
import {ActivitySection} from '../../components/ActivitySection';
import {ActivityCard} from '../../components/ActivityCard';

function Home() {
  const insets = useSafeAreaInsets();

  const navigateToAllActivities = () => {
    console.log('Navegar para todas as atividades');
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, {paddingTop: insets.top}]}>
        <View>
          <Text style={styles.greeting}>Olá, Seja Bem Vindo</Text>
          <Text style={styles.userName}>Nome!</Text>
        </View>
        <View style={styles.profileContainer}>
          <View style={styles.levelContainer}>
            <Image source={Star} style={styles.star} />
            <Text style={styles.level}>5</Text>
          </View>
          <Image
            source={{uri: 'https://github.com/shadcn.png'}}
            style={styles.profileImage}
          />
        </View>
      </View>

      <ScrollView style={styles.content}>
        <ActivitySection
          type="viewMore"
          title="Suas Recomendações"
          onPress={navigateToAllActivities}>
          <ActivityCard
            title="Título da Atividade"
            date="12/10/2023"
            participants={4}
            imageSource={require('../../assets/images/activity.jpeg')}
          />
          <ActivityCard
            title="Título da atividade"
            date="30/01/2025 09:00"
            participants={2}
            imageSource={require('../../assets/images/activity.jpeg')}
          />
        </ActivitySection>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CATEGORIAS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoriesContainer}>
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <TouchableOpacity key={index} style={styles.categoryItem}>
                    {/* <Image
                      source={imagens da api}
                      style={styles.categoryImage}
                    /> */}
                    <Text style={styles.categoryText}>Treino</Text>
                  </TouchableOpacity>
                ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default Home;
