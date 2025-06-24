import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { gql, useMutation } from '@apollo/client';
import { useAuthStore } from '../../store/auth';
import { io } from 'socket.io-client';

const JOIN_EVENT = gql`
  mutation JoinEvent($eventId: ID!) {
    joinEvent(eventId: $eventId) {
      id
      attendees { id name }
    }
  }
`;

export default function EventDetail({ route, navigation }: any) {
  const { event } = route.params;
  const [attendees, setAttendees] = useState(event.attendees || []);
  const [hasJoined, setHasJoined] = useState(false);
  const [joinEvent] = useMutation(JOIN_EVENT);
  const token = useAuthStore(state => state.token);

 useEffect(() => {
  const socket = io('http://localhost:4000'); // Use your backend URL or LAN IP if on device
  socket.emit('joinRoom', event.id);
  socket.on('joinedUsers', (users: any[]) => setAttendees(users));
  return () => { socket.disconnect(); }; // <-- wrap in a function
}, [event.id]);

  const handleJoin = async () => {
    await joinEvent({
      variables: { eventId: event.id },
      context: { headers: { Authorization: `Bearer ${token}` } },
    });
    setHasJoined(true);
  };

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>{event.name}</Text>
      <Text style={{ color: '#888', marginBottom: 16 }}>
        {new Date(event.startTime).toLocaleString()} · {event.location}
      </Text>

      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Who's Joined:</Text>
      <FlatList
        data={attendees}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <Text style={{ marginBottom: 4 }}>• {item.name}</Text>}
        style={{ marginBottom: 16 }}
      />

      {!hasJoined ? (
        <Button title="Join Event" onPress={handleJoin} />
      ) : (
        <Text style={{ color: 'green', marginTop: 16 }}>You have joined this event!</Text>
      )}

      <Text style={{ color: 'green', marginTop: 16 }}>Live: User list updates instantly!</Text>
    </View>
  );
}