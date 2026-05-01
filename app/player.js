

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
          
        />
      </View>
    );
  }

  
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
        

        
        injectedJavaScriptBeforeContentLoaded={`
          
          
          window.open = function() { 
            return { closed: false }; 
          };
          
          
          window.location.replace = function() {};
          true;
        `}
        
        injectedJavaScript={`
          document.body.style.backgroundColor = '${THEME.void}'; 
          true;
        `}
        
        onShouldStartLoadWithRequest={(request) => {
          
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
