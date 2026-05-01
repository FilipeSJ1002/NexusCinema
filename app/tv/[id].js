import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getTvPlayerUrl } from "../../src/api/player";
import { getDetails, getSeasonEpisodes } from "../../src/api/tmdb";

const THEME = {
  void: "#070714",
  nebula: "#7b2cbf",
  starlight: "#ffffff",
  comet: "#4cc9f0",
  darkMatter: "#1a1a2e",
};

export default function TvDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [show, setShow] = useState(null);
  const [loadingShow, setLoadingShow] = useState(true);

  // Controle de Temporadas e Episódios
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);

  // Busca os detalhes gerais da série
  useEffect(() => {
    const fetchShow = async () => {
      const data = await getDetails(id, "tv");
      if (data) {
        setShow(data);
        // Filtra a "Temporada 0" (Especiais) e guarda as temporadas reais
        const validSeasons =
          data.seasons?.filter((s) => s.season_number > 0) || [];
        setSeasons(validSeasons);

        // Define a temporada inicial selecionada (geralmente a 1)
        if (validSeasons.length > 0) {
          setSelectedSeason(validSeasons[0].season_number);
        }
      }
      setLoadingShow(false);
    };
    fetchShow();
  }, [id]);

  // Busca os episódios sempre que a temporada selecionada mudar
  useEffect(() => {
    const fetchEpisodes = async () => {
      if (selectedSeason > 0) {
        setLoadingEpisodes(true);
        const eps = await getSeasonEpisodes(id, selectedSeason);
        setEpisodes(eps);
        setLoadingEpisodes(false);
      }
    };
    fetchEpisodes();
  }, [id, selectedSeason]);

  const handlePlayEpisode = (episodeNumber) => {
    const url = getTvPlayerUrl(id, selectedSeason, episodeNumber);
    router.push({ pathname: "/player", params: { url } });
  };

  if (loadingShow)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={THEME.nebula} />
      </View>
    );
  if (!show)
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Série não encontrada.</Text>
      </View>
    );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Imagem de Fundo */}
      <ImageBackground
        source={{
          uri: `https://image.tmdb.org/t/p/w1280${show.backdrop_path}`,
        }}
        style={styles.backdrop}
      >
        <View style={styles.overlay} />
      </ImageBackground>

      <View style={styles.content}>
        <Text style={styles.title}>{show.name}</Text>

        <View style={styles.metaData}>
          <Text style={styles.metaText}>
            {show.first_air_date?.substring(0, 4)}
          </Text>
          <Text style={styles.metaDot}> • </Text>
          <Text style={styles.metaText}>
            {show.number_of_seasons} Temporada(s)
          </Text>
          <Text style={styles.metaDot}> • </Text>
          <Text style={styles.metaText}>
            ⭐ {show.vote_average?.toFixed(1)}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Sinopse</Text>
        <Text style={styles.overview}>
          {show.overview || "Nenhuma sinopse disponível."}
        </Text>

        {/* SELETOR DE TEMPORADAS (Rolagem Horizontal) */}
        <Text style={styles.sectionTitle}>Temporadas</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.seasonSelector}
        >
          {seasons.map((season) => (
            <TouchableOpacity
              key={season.id}
              style={[
                styles.seasonBadge,
                selectedSeason === season.season_number &&
                  styles.seasonBadgeActive,
              ]}
              onPress={() => setSelectedSeason(season.season_number)}
            >
              <Text
                style={[
                  styles.seasonText,
                  selectedSeason === season.season_number &&
                    styles.seasonTextActive,
                ]}
              >
                Temporada {season.season_number}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* LISTA DE EPISÓDIOS */}
        {loadingEpisodes ? (
          <ActivityIndicator
            size="large"
            color={THEME.comet}
            style={{ marginTop: 20 }}
          />
        ) : (
          <View style={styles.episodesContainer}>
            {episodes.map((episode) => (
              <TouchableOpacity
                key={episode.id}
                style={styles.episodeCard}
                onPress={() => handlePlayEpisode(episode.episode_number)}
              >
                <View style={styles.episodeImageContainer}>
                  {episode.still_path ? (
                    <Image
                      source={{
                        uri: `https://image.tmdb.org/t/p/w300${episode.still_path}`,
                      }}
                      style={styles.episodeImage}
                    />
                  ) : (
                    <View style={styles.episodeImagePlaceholder}>
                      <Text style={{ color: "#555", fontSize: 10 }}>
                        Sem Imagem
                      </Text>
                    </View>
                  )}
                  {/* Ícone de Play por cima da miniatura */}
                  <View style={styles.playIconContainer}>
                    <Text style={{ color: THEME.starlight, fontSize: 12 }}>
                      ▶
                    </Text>
                  </View>
                </View>

                <View style={styles.episodeInfo}>
                  <Text style={styles.episodeTitle}>
                    {episode.episode_number}. {episode.name}
                  </Text>
                  <Text style={styles.episodeRuntime}>
                    {episode.runtime} min
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={{ height: 50 }} />
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
  content: { padding: 20, marginTop: -30 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: THEME.starlight,
    marginBottom: 10,
  },
  metaData: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  metaText: { color: "#ccc", fontSize: 14, fontWeight: "bold" },
  metaDot: { color: THEME.nebula, fontSize: 18, marginHorizontal: 5 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: THEME.starlight,
    marginBottom: 10,
    marginTop: 10,
  },
  overview: { color: "#ccc", fontSize: 15, lineHeight: 24, marginBottom: 20 },

  // Seletor de Temporadas
  seasonSelector: { marginBottom: 20, maxHeight: 40 },
  seasonBadge: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: THEME.darkMatter,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  seasonBadgeActive: {
    backgroundColor: THEME.nebula,
    borderColor: THEME.nebula,
  },
  seasonText: { color: "#aaa", fontWeight: "bold" },
  seasonTextActive: { color: THEME.starlight },

  // Cards de Episódios
  episodesContainer: { marginTop: 10 },
  episodeCard: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: THEME.darkMatter,
    borderRadius: 8,
    overflow: "hidden",
    alignItems: "center",
  },
  episodeImageContainer: { position: "relative" },
  episodeImage: { width: 120, height: 68 }, // Proporção 16:9
  episodeImagePlaceholder: {
    width: 120,
    height: 68,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
  playIconContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: THEME.starlight,
  },
  episodeInfo: { flex: 1, paddingHorizontal: 15 },
  episodeTitle: {
    color: THEME.starlight,
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 5,
  },
  episodeRuntime: { color: "#888", fontSize: 12 },
});
