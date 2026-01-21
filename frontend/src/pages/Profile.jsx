import { useEffect, useState } from 'react';
import api from '../api/axios';
import {
  Box,
  Heading,
  Text,
  Stack,
  Badge,
  Spinner,
  Center,
  Card,
  CardBody
} from '@chakra-ui/react';

import bgProfile from '../assets/back8.jpg';

function Profile() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reservations/my')
      .then(res => setReservations(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box minH="100vh" py={10} px={4}>
      
      {/* 🌄 Background */}
      <Box
        position="fixed"
        top={0}
        left={0}
        w="100%"
        h="100%"
        zIndex={-1}
        backgroundImage={`url(${bgProfile})`}
        backgroundSize="cover"
        backgroundPosition="center"
        filter="brightness(0.6)"
      />

      <Box maxW="900px" mx="auto">
        <Heading color="white" mb={6} textAlign="center">
          Mes réservations
        </Heading>

        {loading ? (
          <Center mt={10}>
            <Spinner size="xl" color="teal.300" />
          </Center>
        ) : reservations.length === 0 ? (
          <Box bg="white" p={6} borderRadius="lg" textAlign="center">
            <Text fontSize="lg">Aucune réservation pour le moment 😕</Text>
          </Box>
        ) : (
          <Stack spacing={4}>
            {reservations.map(r => (
              <Card key={r._id} shadow="lg">
                <CardBody>
                  <Stack spacing={2}>
                    <Heading size="md">{r.terrain.name}</Heading>

                    <Badge colorScheme="teal" w="fit-content">
                      {r.terrain.sport.toUpperCase()}
                    </Badge>

                    <Text>
                      <strong>Date :</strong>{' '}
                      {new Date(r.date).toLocaleDateString()}
                    </Text>

                    <Text>
                      <strong>Horaire :</strong> {r.startTime} - {r.endTime}
                    </Text>

                    <Text>
                      <strong>Prix :</strong> {r.totalPrice} DT
                    </Text>
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}

export default Profile;
