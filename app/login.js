import { Stack } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// IMPORTAÇÕES DO FIREBASE:
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../src/api/firebase";

const THEME = {
  void: "#070714",
  nebula: "#7b2cbf",
  starlight: "#ffffff",
  darkMatter: "#1a1a2e",
  comet: "#4cc9f0",
  error: "#ff4d4d", // Cor vermelha para os avisos
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // NOVO: Estado para guardar e exibir a mensagem de erro na tela
  const [errorMsg, setErrorMsg] = useState("");

  const handleAuth = async () => {
    // Limpa qualquer erro anterior ao tentar de novo
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Preencha todos os campos!");
      return;
    }

    setIsLoading(true);

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      setIsLoading(false);

      // Mapeamento dos erros do Firebase para avisos amigáveis
      let message = "Ocorreu um erro inesperado. Tente novamente.";

      if (error.code === "auth/email-already-in-use")
        message = "Esse e-mail já está sendo usado!";
      if (error.code === "auth/weak-password")
        message = "Sua senha deve ter pelo menos 6 caracteres.";
      if (error.code === "auth/invalid-email")
        message = "Digite um e-mail válido (ex: seu@email.com).";

      // O Firebase junta e-mail e senha errada no mesmo erro por segurança
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        message = "E-mail ou senha incorretos.";
      }

      // Exibe a mensagem de erro na tela
      setErrorMsg(message);
      console.log("Erro do Firebase:", error.code);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.formContainer}>
        <View style={styles.header}>
          <Text style={styles.logoText}>
            NEXUS<Text style={styles.logoHighlight}>CINEMA</Text>
          </Text>
          <Text style={styles.subtitle}>
            {isRegistering
              ? "Crie sua conta para acessar o Nexus."
              : "Conecte-se à sua dimensão de filmes."}
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#666"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* NOVO: Exibição do Erro em texto vermelho acima do botão */}
        {errorMsg !== "" && <Text style={styles.errorText}>{errorMsg}</Text>}

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleAuth}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={THEME.starlight} />
          ) : (
            <Text style={styles.loginButtonText}>
              {isRegistering ? "Criar Conta" : "Entrar no Nexus"}
            </Text>
          )}
        </TouchableOpacity>

        {!isRegistering && (
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
          </TouchableOpacity>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {isRegistering ? "Já tem uma conta? " : "Ainda não tem uma conta? "}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setIsRegistering(!isRegistering);
              setErrorMsg(""); // Limpa os erros se a pessoa mudar de tela
            }}
          >
            <Text style={styles.registerHighlight}>
              {isRegistering ? "Entrar" : "Criar agora"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.void, justifyContent: "center" },
  formContainer: {
    paddingHorizontal: 30,
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },
  header: { alignItems: "center", marginBottom: 50 },
  logoText: {
    fontSize: 42,
    fontWeight: "900",
    color: THEME.starlight,
    letterSpacing: -1,
  },
  logoHighlight: { color: THEME.comet },
  subtitle: { color: "#888", fontSize: 16, marginTop: 5 },
  inputContainer: { marginBottom: 15 }, // Diminuí a margem para caber o erro melhor
  input: {
    backgroundColor: THEME.darkMatter,
    color: THEME.starlight,
    height: 55,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
  },

  // NOVO: Estilo da mensagem de erro
  errorText: {
    color: THEME.error,
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
  },

  loginButton: {
    backgroundColor: THEME.nebula,
    height: 55,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: THEME.nebula,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  loginButtonText: { color: THEME.starlight, fontSize: 18, fontWeight: "bold" },
  forgotPassword: { alignItems: "center", marginBottom: 40 },
  forgotPasswordText: { color: "#aaa", fontSize: 14 },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  footerText: { color: "#888", fontSize: 15 },
  registerHighlight: { color: THEME.comet, fontSize: 15, fontWeight: "bold" },
});
