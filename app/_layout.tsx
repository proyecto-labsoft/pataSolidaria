import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
// export default function RootLayout() {
//   return (
//       <Stack>
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//       </Stack>
//   );
// }
import { PaperProvider } from 'react-native-paper';

import Head from "expo-router/head";

export default function Layout() {
  return (
    
    <PaperProvider>
      <SafeAreaProvider>
        <Head>
          <title>Expo Router Layouts Demo</title>
          <meta name="description" content="Expo Router Layouts Demo" />
        </Head>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
              name="vista-familiar"
              options={{ headerShown: false }}
          />
        </Stack>
      </SafeAreaProvider>
    </PaperProvider>
  );
}