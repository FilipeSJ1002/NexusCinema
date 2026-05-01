// ARQUIVO: app/player.js

import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

const THEME = {
  void: "#070714",
  nebula: "#7b2cbf",
  starlight: "#ffffff",
};

export default function Player() {
  const { url } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);

  if (!url) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Erro dimensional: Sinal de vídeo perdido.
        </Text>
      </View>
    );
  }

  // --- SOLUÇÃO PARA A WEB ---
  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <iframe
          src={url}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            backgroundColor: THEME.void,
          }}
          allowFullScreen={true}
          webkitallowfullscreen="true"
          mozallowfullscreen="true"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          // sandbox="allow-scripts allow-same-origin allow-presentation"
        />
      </View>
    );
  }

  // --- COMPORTAMENTO PARA ANDROID E IOS ---
  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={THEME.nebula} />
          <Text style={styles.loadingText}>Conectando ao Nexus...</Text>
        </View>
      )}

      <WebView
        source={{ uri: url }}
        style={styles.webview}
        originWhitelist={["*"]}
        allowsFullscreenVideo={true}
        allowsInlineMediaPlayback={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        // Removemos o setSupportMultipleWindows daqui para evitar o "engasgo" da tela branca.

        // --- A TÉCNICA DA ILUSÃO (Roda ANTES do site carregar) ---
        injectedJavaScriptBeforeContentLoaded={`
          // Mente para o site dizendo que o pop-up abriu perfeitamente.
          // Assim ele não ativa o Anti-AdBlock e não apaga o seu vídeo!
          window.open = function() { 
            return { closed: false }; 
          };
          
          // Impede redirecionamentos forçados da página
          window.location.replace = function() {};
          true;
        `}
        // (Roda DEPOIS do site carregar)
        injectedJavaScript={`
          document.body.style.backgroundColor = '${THEME.void}'; 
          true;
        `}
        // Nosso porteiro de rede (apenas como garantia final)
        onShouldStartLoadWithRequest={(request) => {
          // Se a URL for diferente da do filme e tentar mudar a tela inteira
          if (
            request.isTopFrame &&
            request.url !== url &&
            !request.url.includes("fembed.sx") &&
            !request.url.includes("redecanais")
          ) {
            console.log(
              "Tentativa de sequestro de tela abortada:",
              request.url,
            );
            return false;
          }
          return true;
        }}
        onLoadEnd={() => setLoading(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.void,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: THEME.void,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: THEME.void,
    zIndex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: THEME.void,
  },
  loadingText: {
    color: THEME.starlight,
    marginTop: 15,
    fontWeight: "bold",
  },
  errorText: {
    color: "#ff4d4d",
    fontSize: 18,
    fontWeight: "bold",
  },
});
