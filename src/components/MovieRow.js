import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  FlatList,
  Image,
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

export default function MovieRow({
  title,
  data,
  isSearch = false,
  type = "movie",
}) {
  const router = useRouter();

  const flatListRef = useRef(null);
  const { width } = useWindowDimensions();
  const [scrollX, setScrollX] = useState(0);

  
  const [contentWidth, setContentWidth] = useState(0);

  
  const isDesktop = Platform.OS === "web" && width > 768;
  const showArrows = isDesktop && !isSearch && data && data.length > 0;

  const scrollAmount = width * 0.75;

  const handleScroll = (event) => {
    setScrollX(event.nativeEvent.contentOffset.x);
  };

  
  const scrollLeft = () => {
    if (scrollX <= 0) {
      
      flatListRef.current?.scrollToOffset({
        offset: contentWidth - width,
        animated: true,
      });
    } else {
      
      flatListRef.current?.scrollToOffset({
        offset: Math.max(scrollX - scrollAmount, 0),
        animated: true,
      });
    }
  };

  const scrollRight = () => {
    
    if (scrollX + width >= contentWidth - 20) {
      
      flatListRef.current?.scrollToOffset({
        offset: 0,
        animated: true,
      });
    } else {
      
      flatListRef.current?.scrollToOffset({
        offset: scrollX + scrollAmount,
        animated: true,
      });
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      key={item.id.toString()}
      style={[styles.card, isSearch && styles.searchCard]}
      onPress={() => router.push(`/${type}/${item.id}`)}
    >
      {item.poster_path ? (
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
          style={styles.poster}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.poster, styles.noPoster]}>
          <Text style={styles.noPosterText}>Sem Imagem</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (isSearch) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.searchGrid}>
          {data.map((item) => renderItem({ item }))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.rowWrapper}>
        {}
        {showArrows && (
          <TouchableOpacity
            style={[styles.arrowBtn, styles.arrowLeft]}
            onPress={scrollLeft}
          >
            <Text style={styles.arrowText}>❮</Text>
          </TouchableOpacity>
        )}

        <FlatList
          style={{ flex: 1 }}
          ref={flatListRef}
          data={data}
          keyExtractor={(item) => item.id.toString()}
          horizontal={true}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          
          onContentSizeChange={(w) => setContentWidth(w)}
        />

        {showArrows && (
          <TouchableOpacity
            style={[styles.arrowBtn, styles.arrowRight]}
            onPress={scrollRight}
          >
            <Text style={styles.arrowText}>❯</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  title: {
    color: THEME.starlight,
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
    marginBottom: 15,
  },
  listContent: {
    paddingHorizontal: 15,
  },
  card: {
    marginHorizontal: 5,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: THEME.darkMatter,
  },
  poster: {
    width: 140,
    height: 210,
    borderRadius: 8,
  },
  noPoster: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222",
  },
  noPosterText: {
    color: "#777",
    fontSize: 12,
  },
  searchGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  searchCard: {
    marginHorizontal: 8,
    marginBottom: 20,
  },
  rowWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  arrowBtn: {
    width: 50,
    height: 210,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: THEME.void,
    zIndex: 10,
  },
  arrowLeft: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  arrowRight: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  arrowText: {
    color: THEME.starlight,
    fontSize: 30,
    fontWeight: "bold",
  },
});
