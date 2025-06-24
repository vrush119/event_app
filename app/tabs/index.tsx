import React, { useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { useAuthStore } from '../../store/auth';
import { useRouter } from 'expo-router';
import { gql, useQuery, useMutation } from '@apollo/client';

const EVENTS_QUERY = gql`
  query {
    events {
      id
      name
      location
      startTime
      attendees { id name }
    }
  }
`;

const JOIN_EVENT = gql`
  mutation JoinEvent($eventId: ID!) {
    joinEvent(eventId: $eventId) {
      id
      attendees { id name }
    }
  }
`;

export default function Events() {
  const isLoggedIn = useAuthStore(state => state.token !== null);
  const token = useAuthStore(state => state.token);
  const router = useRouter();
  const { data, loading, error, refetch } = useQuery(EVENTS_QUERY);
  const [joinEvent] = useMutation(JOIN_EVENT);
  const [joinedEvents, setJoinedEvents] = useState<string[]>([]);

  const handleJoin = async (eventId: string) => {
    if (!isLoggedIn) {
      router.push({ pathname: '/login', params: { redirectTo: '/tabs/index' } });
    } else {
      await joinEvent({
        variables: { eventId },
        context: { headers: { Authorization: `Bearer ${token}` } },
      });
      setJoinedEvents(prev => [...prev, eventId]);
      refetch(); // Refresh the event list to update attendees
    }
  };

  if (loading) return <Text>Loading...</Text>;
  if (error || !data?.events) return <Text>Error loading events</Text>;

  return (
    <View style={{ flex: 1, padding: 24 }}>
       {data?.me && (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Hello, {data.me.name}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  )}
      <FlatList
        data={data.events}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 24, padding: 16, backgroundColor: '#25292e', borderRadius: 8 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#ffd33d', marginBottom: 4 }}>{item.name}</Text>
            <Text style={{ color: '#888', marginBottom: 8 }}>
              {item.startTime
                ? new Date(Number(item.startTime)).toLocaleString()
                : "No Date"} · {item.location}
            </Text>
            <Text style={{ fontWeight: 'bold', marginBottom: 4, color: '#fff' }}>Who's Joined:</Text>
            {item.attendees.map((att: any) => (
              <Text key={att.id} style={{ color: '#fff', marginBottom: 2 }}>• {att.name}</Text>
            ))}
            {!joinedEvents.includes(item.id) ? (
              <Button title="Join Event" onPress={() => handleJoin(item.id)} />
            ) : (
              <Text style={{ color: 'green', marginTop: 8 }}>You have joined this event!</Text>
            )}
          </View>
        )}
      />
      <Text style={{ color: 'green', marginTop: 16 }}>Live: User list updates instantly!</Text>
    </View>
  );
}