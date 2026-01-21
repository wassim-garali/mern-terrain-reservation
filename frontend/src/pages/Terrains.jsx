import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  Button,
  Stack,
  Badge,
  HStack,
  Image,
  useColorModeValue
} from '@chakra-ui/react';

// Import des icônes des sports
import padelIcon from '../assets/padel.png';
import footIcon from '../assets/football.png';
import basketIcon from '../assets/basketball.png';
import tennisIcon from '../assets/tennis.png';

// Import des images de fond pour chaque sport
import bgFoot from '../assets/back3.jpg';
import bgBasket from '../assets/terrbasket.jpg';
import bgTennis from '../assets/terraintennis.jpg';
import bgPadel from '../assets/back6.jpg';
import bgDefault from '../assets/back8.jpg';

function Terrains() {
  const [terrains, setTerrains] = useState([]);
  const [filter, setFilter] = useState('');
  const [bgImage, setBgImage] = useState(bgDefault);

  const sportsOptions = [
    { name: 'foot', icon: footIcon, bg: bgFoot },
    { name: 'basket', icon: basketIcon, bg: bgBasket },
    { name: 'tennis', icon: tennisIcon, bg: bgTennis },
    { name: 'padel', icon: padelIcon, bg: bgPadel }
  ];

  useEffect(() => {
    api.get('/terrains').then(res => setTerrains(res.data));
  }, []);

  const handleFilter = (sport) => {
    // Toggle filter
    const newFilter = filter === sport ? '' : sport;
    setFilter(newFilter);

    // Changer le background
    const sportBg = sportsOptions.find(s => s.name === newFilter);
    setBgImage(sportBg ? sportBg.bg : bgDefault);
  };

  const filteredTerrains = filter
    ? terrains.filter(t => t.sport === filter)
    : terrains;

  const cardBg = useColorModeValue('white', 'gray.700');

  return (
    <Box minH="100vh" py={10} px={5}>
      {/* Background global */}
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

      <Box maxW="1200px" mx="auto">
        <Heading mb={6} textAlign="center" size="2xl" color="white">
          Terrains disponibles
        </Heading>

        {/* Boutons filtres */}
        <HStack spacing={4} mb={6} justify="center">
          {sportsOptions.map(s => (
            <Button
              key={s.name}
              leftIcon={<Image src={s.icon} boxSize={5} />}
              colorScheme={filter === s.name ? 'teal' : 'gray'}
              onClick={() => handleFilter(s.name)}
            >
              {s.name.toUpperCase()}
            </Button>
          ))}
        </HStack>

        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
          {filteredTerrains.map(t => (
            <GridItem key={t._id}>
              <Box
                bg={cardBg}
                shadow="md"
                borderRadius="md"
                p={5}
                _hover={{ shadow: 'xl', transform: 'scale(1.03)', transition: '0.3s' }}
              >
                <Stack spacing={3}>
                  <Heading size="md">{t.name}</Heading>
                  <Badge colorScheme="teal" w="fit-content">
                    {t.sport.toUpperCase()}
                  </Badge>
                  <Text><strong>Localisation:</strong> {t.location}</Text>
                  <Text><strong>Capacité:</strong> {t.capacity} personnes</Text>
                  <Text><strong>Prix:</strong> {t.pricePerHour} DT / heure</Text>
                  <Button
                    as={Link}
                    to={`/terrains/${t._id}`}
                    colorScheme="teal"
                    size="sm"
                    mt={2}
                  >
                    Voir détails
                  </Button>
                </Stack>
              </Box>
            </GridItem>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default Terrains;
