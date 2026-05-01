import { StyleSheet, Text, View } from "react-native";

const THEME = {
  nebula: "#7b2cbf",
  starlight: "#ffffff",
  comet: "#4cc9f0",
};

export default function NexusLogo() {
  return (
    <View style={styles.container}>
      {}
      <View style={styles.iconContainer}>
        <Text style={styles.nLetter}>N</Text>
        <Text style={styles.cLetter}>C</Text>
      </View>

      {}
      <Text style={styles.brandText}>
        NEXUS<Text style={styles.brandHighlight}>CINEMA</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: THEME.nebula,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    backgroundColor: "rgba(123, 44, 191, 0.2)", 
    position: "relative",
  },
  nLetter: {
    color: THEME.starlight,
    fontWeight: "900",
    fontSize: 16,
    position: "absolute",
    left: 6,
    top: 6,
  },
  cLetter: {
    color: THEME.comet, 
    fontWeight: "900",
    fontSize: 18,
    position: "absolute",
    right: 5,
    bottom: 5,
  },
  brandText: {
    fontSize: 22,
    fontWeight: "900",
    color: THEME.starlight,
    letterSpacing: 1,
  },
  brandHighlight: {
    color: THEME.nebula,
  },
});
