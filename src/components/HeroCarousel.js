import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

const THEME = {
  void: "#070714",
  nebula: "#7b2cbf",
  starlight: "#ffffff",
  darkMatter: "#1a1a2e",
};

export default function HeroCarousel({ data }) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Exibe as setas apenas se estiver na Web e a tela for grande
  const isDesktop = Platform.OS === "web" && width > 768;

  // Função central para mover o carrossel (conserta o erro de sincronia)
  const goToIndex = (index) => {
    flatListRef.current?.scrollToIndex({
      index: index,
      animated: true,
    });
    setCurrentIndex(index);
  };

  // Efeito do Auto-Scroll (A cada 5 segundos)
  useEffect(() => {
    if (!data || data.length === 0) return;

    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= data.length) {
        nextIndex = 0;
      }
      goToIndex(nextIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, data]);

  // Atualiza a bolinha se o usuário arrastar com o dedo/mouse
  const handleScrollEnd = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  // Funções das Setas da Web
  const scrollLeft = () => {
    let nextIndex = currentIndex - 1;
    if (nextIndex < 0) nextIndex = data.length - 1; // Se está no primeiro, vai pro último
    goToIndex(nextIndex);
  };

  const scrollRight = () => {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= data.length) nextIndex = 0; // Se está no último, volta pro primeiro
    goToIndex(nextIndex);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => router.push(`/movie/${item.id}`)}
      style={{ width, height: 450 }}
    >
      <ImageBackground
        source={{
          uri: `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`,
        }}
        style={styles.heroImage}
      >
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>{item.title || item.name}</Text>
          <Text style={styles.heroOverview} numberOfLines={3}>
            {item.overview}
          </Text>
          <View style={styles.heroButton}>
            <Text style={styles.heroButtonText}>▶ Assistir Agora</Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  if (!data || data.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Seta Esquerda (Aparece sobre a imagem na web) */}
      {isDesktop && (
        <TouchableOpacity
          style={[styles.arrowBtn, styles.arrowLeft]}
          onPress={scrollLeft}
        >
          <Text style={styles.arrowText}>❮</Text>
        </TouchableOpacity>
      )}

      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        onMomentumScrollEnd={handleScrollEnd}
        // ESSA É A LINHA MÁGICA QUE CONSERTA O BUG DE NÃO ROLAR SOZINHO:
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      {/* Seta Direita (Aparece sobre a imagem na web) */}
      {isDesktop && (
        <TouchableOpacity
          style={[styles.arrowBtn, styles.arrowRight]}
          onPress={scrollRight}
        >
          <Text style={styles.arrowText}>❯</Text>
        </TouchableOpacity>
      )}

      {/* Bolinhas indicadoras do carrossel (agora clicáveis!) */}
      <View style={styles.dotsContainer}>
        {data.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => goToIndex(index)}
            style={styles.dotTouchArea}
          >
            <View
              style={[styles.dot, currentIndex === index && styles.activeDot]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 450,
    marginBottom: 30,
    position: "relative", // Importante para as setas flutuarem em relação a este container
  },
  heroImage: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  heroOverlay: {
    padding: 20,
    backgroundColor: "rgba(7, 7, 20, 0.7)",
    paddingTop: 50,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: THEME.starlight,
    marginBottom: 10,
  },
  heroOverview: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 15,
    lineHeight: 20,
    maxWidth: 800,
  },
  heroButton: {
    backgroundColor: THEME.starlight,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  heroButtonText: { color: THEME.void, fontWeight: "bold", fontSize: 16 },

  // Estilos das Setas do Carrossel Hero
  arrowBtn: {
    position: "absolute",
    top: "50%",
    marginTop: -25, // Para centralizar perfeitamente (metade da altura)
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Fundo redondo semi-transparente
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10, // Garante que a seta fique por cima da imagem
  },
  arrowLeft: { left: 20 },
  arrowRight: { right: 20 },
  arrowText: {
    color: THEME.starlight,
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: -2,
    marginTop: -2,
  },

  // Estilos das Bolinhas
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    width: "100%",
  },
  dotTouchArea: {
    padding: 10, // Aumenta a área de clique para o dedo/mouse
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  activeDot: {
    backgroundColor: THEME.nebula,
    width: 24, // Fica mais esticadinho indicando que é a atual
  },
});
