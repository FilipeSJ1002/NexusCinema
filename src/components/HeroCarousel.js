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

  
  const isDesktop = Platform.OS === "web" && width > 768;

  
  const goToIndex = (index) => {
    flatListRef.current?.scrollToIndex({
      index: index,
      animated: true,
    });
    setCurrentIndex(index);
  };

  
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

  
  const handleScrollEnd = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  
  const scrollLeft = () => {
    let nextIndex = currentIndex - 1;
    if (nextIndex < 0) nextIndex = data.length - 1; 
    goToIndex(nextIndex);
  };

  const scrollRight = () => {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= data.length) nextIndex = 0; 
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
      {}
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
        
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      {}
      {isDesktop && (
        <TouchableOpacity
          style={[styles.arrowBtn, styles.arrowRight]}
          onPress={scrollRight}
        >
          <Text style={styles.arrowText}>❯</Text>
        </TouchableOpacity>
      )}

      {}
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
    position: "relative", 
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

  
  arrowBtn: {
    position: "absolute",
    top: "50%",
    marginTop: -25, 
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0, 0, 0, 0.6)", 
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10, 
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

  
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    width: "100%",
  },
  dotTouchArea: {
    padding: 10, 
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  activeDot: {
    backgroundColor: THEME.nebula,
    width: 24, 
  },
});
