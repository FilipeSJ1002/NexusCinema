import {
  Stack,
  useRootNavigationState,
  useRouter,
  useSegments,
} from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../src/api/firebase";

function RootLayoutNav({ user }) {
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key) return;

    const inAuthGroup = segments[0] === "login";

    setTimeout(() => {
      if (!user && !inAuthGroup) {
        router.replace("/login");
      } else if (user && inAuthGroup) {
        router.replace("/");
      }
    }, 1);
  }, [user, segments, navigationState?.key, router]);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#070714" },
        headerTintColor: "#e50914",
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen
        name="player"
        options={{ headerShown: true, title: "Retornar" }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // O Firebase avisa automaticamente se o usuário está logado ou não
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsInitializing(false); // Terminou de checar
    });

    return unsubscribe; // Limpeza do listener
  }, []);

  // Enquanto o Firebase decide se tem alguém logado, a gente segura a tela
  if (isInitializing) return null;

  return <RootLayoutNav user={user} />;
}
