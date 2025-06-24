import { Stack } from 'expo-router';
import { View, Image, Text } from 'react-native';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'; // Add this

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // your backend URL
  cache: new InMemoryCache(),
});

export default function RootLayout() {
  return (
    <ApolloProvider client={client}> {/* Wrap your layout here */}
  
    <View style={{ flex: 1, backgroundColor: '#f4f4f4' }}>
      {/* Header */}
      <View
        style={{
          width: '100%',
          backgroundColor: '#25292e',
          paddingVertical: 12,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}
      >
        <Image
          source={require('../assets/images/event-header.png')}
          style={{ width: 48, height: 48, resizeMode: 'contain', marginRight: 12 }}
        />
        <Text
          style={{
            color: '#ffd33d',
            fontSize: 22,
            fontWeight: 'bold',
            letterSpacing: 1,
          }}
        >
          Event App
        </Text>
      </View>

      {/* Main content */}
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>

      {/* Footer */}
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#25292e',
          padding: 12,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: '#ffd33d', fontWeight: 'bold' }}>© 2025 Event App</Text>
      </View>
    </View>
  
  </ApolloProvider>
  );
}
