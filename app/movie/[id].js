import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getMoviePlayerUrl } from "../../src/api/player";
import { getDetails } from "../../src/api/tmdb";

const THEME = {
  void: "#070714",
  nebula: "#7b2cbf",
  starlight: "#ffffff",
  comet: "#4cc9f0",
};

export default function MovieDetails() {
  const { id } = useLocalSearchParams(); // Pega o ID da URL
  const router = useRouter();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      const data = await getDetails(id, "movie");
      setMovie(data);
      setLoading(false);
    };
    fetchMovie();
  }, [id]);

  const handlePlay = () => {
    const url = getMoviePlayerUrl(id);
    // Envia a URL gerada para a nossa tela de Player
    router.push({ pathname: "/player", params: { url } });
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={THEME.nebula} />
      </View>
    );
  if (!movie)
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Filme não encontrado.</Text>
      </View>
    );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Imagem de Fundo (Backdrop) */}
      <ImageBackground
        source={{
          uri: `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`,
        }}
        style={styles.backdrop}
      >
        <View style={styles.overlay} />
      </ImageBackground>

      <View style={styles.content}>
        {/* Título e Botão de Play */}
        <Text style={styles.title}>{movie.title}</Text>

        <View style={styles.metaData}>
          <Text style={styles.metaText}>
            {movie.release_date?.substring(0, 4)}
          </Text>
          <Text style={styles.metaDot}> • </Text>
          <Text style={styles.metaText}>{movie.runtime} min</Text>
          <Text style={styles.metaDot}> • </Text>
          <Text style={styles.metaText}>
            ⭐ {movie.vote_average?.toFixed(1)}
          </Text>
        </View>

        <TouchableOpacity style={styles.playButton} onPress={handlePlay}>
          <Text style={styles.playButtonText}>▶ Assistir Filme</Text>
        </TouchableOpacity>

        {/* Gêneros */}
        <View style={styles.genresContainer}>
          {movie.genres?.map((genre) => (
            <View key={genre.id} style={styles.genreBadge}>
              <Text style={styles.genreText}>{genre.name}</Text>
            </View>
          ))}
        </View>

        {/* Sinopse */}
        <Text style={styles.sectionTitle}>Sinopse</Text>
        <Text style={styles.overview}>
          {movie.overview || "Nenhuma sinopse disponível."}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.void },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: THEME.void,
  },
  text: { color: THEME.starlight },
  backdrop: { width: "100%", height: 300, justifyContent: "flex-end" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(7, 7, 20, 0.6)",
  },
  content: { padding: 20, marginTop: -30 }, // Sobe um pouco o conteúdo para sobrepor a imagem
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: THEME.starlight,
    marginBottom: 10,
  },
  metaData: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  metaText: { color: "#ccc", fontSize: 14, fontWeight: "bold" },
  metaDot: { color: THEME.nebula, fontSize: 18, marginHorizontal: 5 },
  playButton: {
    backgroundColor: THEME.nebula,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  playButtonText: { color: THEME.starlight, fontSize: 18, fontWeight: "bold" },
  genresContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 20 },
  genreBadge: {
    backgroundColor: THEME.darkMatter,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  genreText: { color: THEME.comet, fontSize: 12, fontWeight: "bold" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: THEME.starlight,
    marginBottom: 10,
  },
  overview: { color: "#ccc", fontSize: 15, lineHeight: 24, marginBottom: 40 },
});
