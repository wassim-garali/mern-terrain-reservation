import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  Divider,
  FormControl,
  FormLabel,
  Input,
  useToast
} from '@chakra-ui/react';

import { ArrowBackIcon } from '@chakra-ui/icons';

// 🔹 Backgrounds par sport
import bgFoot from '../assets/back3.jpg';
import bgBasket from '../assets/terrbasket.jpg';
import bgTennis from '../assets/terraintennis.jpg';
import bgPadel from '../assets/back6.jpg';
import bgDefault from '../assets/back1.jpg';

function TerrainDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, isAuthenticated } = useAuth();

  const [terrain, setTerrain] = useState(null);
  const [bgImage, setBgImage] = useState(bgDefault);

  const [date, setDate] = useState('');
  const [startHour, setStartHour] = useState(8);
  const [duration, setDuration] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/terrains/${id}`)
      .then(res => {
        setTerrain(res.data);

        // 🎯 Choix du background selon le sport
        switch (res.data.sport) {
          case 'foot':
            setBgImage(bgFoot);
            break;
          case 'basket':
            setBgImage(bgBasket);
            break;
          case 'tennis':
            setBgImage(bgTennis);
            break;
          case 'padel':
            setBgImage(bgPadel);
            break;
          default:
            setBgImage(bgDefault);
        }
      })
      .catch(() =>
        toast({
          title: 'Erreur',
          description: 'Impossible de charger le terrain.',
          status: 'error',
          duration: 3000,
          isClosable: true
        })
      );
  }, [id, toast]);

  const handleReservation = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast({
        title: 'Connexion requise',
        description: 'Veuillez vous connecter pour réserver.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
      navigate('/login');
      return;
    }

    try {
      setLoading(true);

      await api.post('/reservations', {
        terrain: terrain._id,
        user: user._id,
        date,
        startTime: `${startHour}:00`,
        endTime: `${startHour + duration}:00`,
        durationHours: duration,
        totalPrice: duration * terrain.pricePerHour
      });

      toast({
        title: 'Réservation confirmée',
        status: 'success',
        duration: 3000,
        isClosable: true
      });

      navigate('/profile');
    } catch (err) {
      toast({
        title: 'Erreur',
        description: err.response?.data?.message || 'Erreur lors de la réservation',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  if (!terrain) return null;

  return (
    <Box minH="100vh" px={5} py={10}>
      {/* 🌄 Background dynamique */}
      <Box
        position="fixed"
        top={0}
        left={0}
        w="100%"
        h="100%"
        zIndex={-1}
        backgroundImage={`url(${bgImage})`}
        backgroundSize="cover"
        backgroundPosition="center"
        filter="brightness(0.6)"
      />

      <Box maxW="800px" mx="auto">
        <Button
          leftIcon={<ArrowBackIcon />}
          variant="ghost"
          color="white"
          mb={4}
          onClick={() => navigate('/terrains')}
        >
          Retour aux terrains
        </Button>

        <Box bg="white" p={6} borderRadius="md" shadow="xl">
          <Stack spacing={4}>
            <Heading>{terrain.name}</Heading>

            <Text><strong>Sport :</strong> {terrain.sport}</Text>
            <Text><strong>Capacité :</strong> {terrain.capacity}</Text>
            <Text><strong>Prix :</strong> {terrain.pricePerHour} DT / heure</Text>
            <Text><strong>Localisation :</strong> {terrain.location}</Text>

            <Divider />

            <Heading size="md">Réserver ce terrain</Heading>

            <form onSubmit={handleReservation}>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Date</FormLabel>
                  <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Heure de début</FormLabel>
                  <Input
                    type="number"
                    min={8}
                    max={20}
                    value={startHour}
                    onChange={e => setStartHour(Number(e.target.value))}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Durée (heures)</FormLabel>
                  <Input
                    type="number"
                    min={1}
                    max={4}
                    value={duration}
                    onChange={e => setDuration(Number(e.target.value))}
                  />
                </FormControl>

                <Button type="submit" colorScheme="teal" isLoading={loading}>
                  Réserver
                </Button>
              </Stack>
            </form>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export default TerrainDetails;
