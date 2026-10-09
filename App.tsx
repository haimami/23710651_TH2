// TH2 | 23710651 | TRAN NAM HAI | #101883
import React from 'react';
import { StatusBar, LogBox } from 'react-native';

LogBox.ignoreAllLogs();
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from '@navigation/RootNavigator';
import { STALE_TIME_MS } from '@constants/student';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME_MS,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

export default App;
