// import { Head } from "expo-router"; // Componente para alterar o título da aba
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../src/api/firebase";
import {
  getPopular,
  getTopRated,
  getUpcoming,
  searchMedia,
} from "../src/api/tmdb";
import HeroCarousel from "../src/components/HeroCarousel"; // Nosso novo componente!
import MovieRow from "../src/components/MovieRow";
import NexusLogo from "../src/components/NexusLogo";

const THEME = {
  void: "#070714",
  nebula: "#7b2cbf",
  starlight: "#ffffff",
  darkMatter: "#1a1a2e",
};

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [popularTv, setPopularTv] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPage, setSearchPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const typingTimer = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) loadAllData();
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loadAllData = async () => {
    const [popData, topData, upData, tvData] = await Promise.all([
      getPopular("movie"),
      getTopRated("movie"),
      getUpcoming(),
      getPopular("tv"),
    ]);
    setPopular(popData);
    setTopRated(topData);
    setUpcoming(upData);
    setPopularTv(tvData);
  };

  const executeSearch = async (text) => {
    setIsSearching(true);
    setSearchPage(1);
    const data = await searchMedia(text, "movie", 1);
    setSearchResults(data.results || []);
    setTotalPages(data.total_pages || 0);
  };

  const handleTextChange = (text) => {
    setSearchQuery(text);

    if (typingTimer.current) clearTimeout(typingTimer.current);

    if (text.length >= 2) {
      // AUMENTADO PARA 1.2 SEGUNDOS (1200ms) DE ESPERA
      typingTimer.current = setTimeout(() => {
        executeSearch(text);
      }, 1200);
    } else if (text.length === 0) {
      setIsSearching(false);
      setSearchResults([]);
      setSearchPage(1);
      setTotalPages(0);
    }
  };

  const handleEnterPress = () => {
    if (typingTimer.current) clearTimeout(typingTimer.current);
    if (searchQuery.length >= 2) {
      executeSearch(searchQuery);
    }
  };

  const loadMoreSearch = async () => {
    if (searchPage < totalPages) {
      const nextPage = searchPage + 1;
      const data = await searchMedia(searchQuery, "movie", nextPage);
      setSearchResults([...searchResults, ...(data.results || [])]);
      setSearchPage(nextPage);
    }
  };

  const handleLogout = () => signOut(auth);

  if (loading)
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={THEME.nebula} />
      </View>
    );
  if (!user)
    return (
      <View style={styles.centerContainer}>
        <Text style={{ color: "#fff" }}>Por favor, logue no sistema.</Text>
      </View>
    );

  // Separamos os 5 filmes mais populares para rodar no Carrossel Hero
  const heroMovies = popular.slice(0, 5);

  return (
    <View style={styles.container}>
      {/* Altera o nome na aba do navegador */}
      {/* <Head>
        <title>NexusCinema - Dimensão de Filmes</title>
      </Head> */}

      <StatusBar barStyle="light-content" backgroundColor={THEME.void} />

      <View style={styles.header}>
        <NexusLogo />
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Busque por filmes..."
        placeholderTextColor="#777"
        value={searchQuery}
        onChangeText={handleTextChange}
        onSubmitEditing={handleEnterPress}
        returnKeyType="search"
      />

      <ScrollView
        style={styles.scrollArea}
        showsVerticalScrollIndicator={false}
      >
        {isSearching ? (
          <View>
            <MovieRow
              title={`Resultados da Busca (${searchResults.length})`}
              data={searchResults}
              isSearch={true}
            />
            {searchPage < totalPages && (
              <TouchableOpacity
                style={styles.loadMoreBtn}
                onPress={loadMoreSearch}
              >
                <Text style={styles.loadMoreText}>
                  Carregar Mais Resultados
                </Text>
              </TouchableOpacity>
            )}
            <View style={{ height: 50 }} />
          </View>
        ) : (
          <>
            {/* NOVO CARROSSEL COMPONENTIZADO */}
            <HeroCarousel data={heroMovies} />

            <MovieRow title="Explorando a Galáxia (Em Alta)" data={popular} />
            <MovieRow title="Aclamados pela Crítica" data={topRated} />
            <MovieRow title="Novidades no Radar" data={upcoming} />
            <MovieRow title="Séries Dimensionais" data={popularTv} type="tv" />
            <View style={{ height: 50 }} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.void, paddingTop: 40 },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: THEME.void,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  logo: {
    fontSize: 22,
    fontWeight: "900",
    color: THEME.starlight,
    letterSpacing: 1,
  },
  logoutText: { color: "#ff4d4d", fontWeight: "bold" },
  searchInput: {
    backgroundColor: THEME.darkMatter,
    color: THEME.starlight,
    height: 45,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  scrollArea: { flex: 1 },
  loadMoreBtn: {
    backgroundColor: THEME.nebula,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 30,
    marginBottom: 40,
  },
  loadMoreText: { color: THEME.starlight, fontWeight: "bold", fontSize: 16 },
});
