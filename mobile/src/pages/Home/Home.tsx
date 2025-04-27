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

function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, Seja Bem Vindo</Text>
          <Text style={styles.userName}>Nome!</Text>
        </View>
        <View style={styles.profileContainer}>
          <Text style={styles.level}>5</Text>
          <Image
            source={{uri: 'https://github.com/shadcn.png'}}
            style={styles.profileImage}
          />
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>SUAS RECOMENDAÇÕES</Text>
            <TouchableOpacity>
              <Text style={styles.seeMore}>VER MAIS</Text>
            </TouchableOpacity>
          </View>

          {/* Cards de Atividades */}
          <View style={styles.activityCard}>
            <Image
              source={require('../../assets/images/activity.jpeg')}
              style={styles.activityImage}
            />
            <Text style={styles.activityTitle}>Título da atividade</Text>
            <View style={styles.activityInfo}>
              <Text style={styles.activityDate}>28/01/2025 08:00</Text>
              <Text style={styles.participants}>4</Text>
            </View>
          </View>
        </View>

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
