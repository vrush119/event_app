import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useAuthStore } from '../store/auth';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { gql, useMutation } from '@apollo/client';

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password)
  }
`;

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore(state => state.login);
  const token = useAuthStore(state => state.token);
  const router = useRouter();
  const params = useLocalSearchParams();
  const [loginMutation, { error }] = useMutation(LOGIN_MUTATION);
  const [loginError, setLoginError] = useState('');

  // If already logged in, show a message
  if (token) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, color: 'green' }}>You are already logged in!</Text>
      </View>
    );
  }

  const handleLogin = async () => {
    setLoginError('');
    try {
      const { data } = await loginMutation({ variables: { username, password } });
      if (data?.login) {
        login(data.login); // Store JWT token in Zustand
        router.replace({ pathname: params.redirectTo || '/tabs/events' });
      } else {
        setLoginError('Invalid credentials');
      }
    } catch (e) {
      setLoginError('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Login</Text>
      <TextInput
        placeholder="Email"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={{ marginBottom: 8, borderWidth: 1, padding: 8 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ marginBottom: 16, borderWidth: 1, padding: 8 }}
      />
      <Button title="Login" onPress={handleLogin} />
      {(error || loginError) && (
        <Text style={{ color: 'red', marginTop: 8 }}>
          {loginError || 'Login failed'}
        </Text>
      )}
    </View>
  );
}