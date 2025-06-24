import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { gql, useQuery } from '@apollo/client';

const EVENTS_QUERY = gql`
  query {
    events {
      id
      name
      location
      startTime
    }
  }
`;

export default function EventsList({ navigation }: any) {
  const { data, loading, error } = useQuery(EVENTS_QUERY);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading events</Text>;

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>All Events</Text>
      <FlatList
        data={data.events}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 16,
              backgroundColor: '#25292e',
              borderRadius: 8,
              marginBottom: 12,
            }}
            // Example: navigate to event detail page
            onPress={() => navigation.navigate('EventDetail', { event: item })}
          >
            <Text style={{ color: '#ffd33d', fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
            <Text style={{ color: '#fff', marginTop: 4 }}>
              {new Date(item.startTime).toLocaleString()} · {item.location}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}