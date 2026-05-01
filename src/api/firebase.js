import { initializeApp } from "firebase/app";
// Importamos as ferramentas para os dois mundos:
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Importamos a detecção de plataforma e a memória do celular:
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Suas credenciais do Console do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCuOwHZwRaJ31Q-H2tZbBlt-4Qq566rDnk",
  authDomain: "nexuscinema-42029.firebaseapp.com",
  projectId: "nexuscinema-42029",
  storageBucket: "nexuscinema-42029.firebasestorage.app",
  messagingSenderId: "1080257887307",
  appId: "1:1080257887307:web:a3f6c79d2157e30b63a1ce",
};

// Inicializa o app do Firebase
const app = initializeApp(firebaseConfig);

// A MÁGICA ACONTECE AQUI:
let auth;

if (Platform.OS === "web") {
  // Se estiver no navegador, usa o método padrão (que você sabe que funciona)
  auth = getAuth(app);
} else {
  // Se estiver no celular, liga o motor com o AsyncStorage para remover o aviso amarelo
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}

// Exporta a Autenticação e o Banco de Dados
export { auth };
export const db = getFirestore(app);
