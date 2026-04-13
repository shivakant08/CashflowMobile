import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* This will now look for app/index.tsx by default */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}