// src/pages/AdminTerrains.jsx
import { useEffect, useState, useRef } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Heading,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  Button,
  Stack,
  Text,
  Flex,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
} from '@chakra-ui/react';

// Images de fond pour chaque sport
import bgFoot from '../assets/back3.jpg';
import bgBasket from '../assets/terrbasket.jpg';
import bgTennis from '../assets/terraintennis.jpg';
import bgPadel from '../assets/back6.jpg';
import bgDefault from '../assets/back1.jpg';

export default function AdminTerrains() {
  const { user } = useAuth();
  const toast = useToast();

  const [terrains, setTerrains] = useState([]);
  const [form, setForm] = useState({
    name: '',
    sport: 'foot',
    capacity: '',
    location: '',
    pricePerHour: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [bgImage, setBgImage] = useState(bgDefault);

  const sportsOptions = [
    { name: 'foot', bg: bgFoot },
    { name: 'basket', bg: bgBasket },
    { name: 'tennis', bg: bgTennis },
    { name: 'padel', bg: bgPadel },
  ];

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const cancelRef = useRef();

  const fetchTerrains = async () => {
    try {
      const res = await api.get('/terrains');
      setTerrains(res.data);
    } catch (err) {
      console.error('Erreur fetch terrains:', err);
    }
  };

  useEffect(() => {
    fetchTerrains();
  }, []);

  // Change le background quand on change le sport dans le formulaire
  useEffect(() => {
    const sportBg = sportsOptions.find(s => s.name === form.sport);
    setBgImage(sportBg ? sportBg.bg : bgDefault);
  }, [form.sport]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        capacity: Number(form.capacity),
        pricePerHour: Number(form.pricePerHour),
      };

      if (editingId) {
        await api.put(`/terrains/${editingId}`, payload);
        toast({
          title: "Terrain modifié !",
          description: `Le terrain "${form.name}" a été mis à jour.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setEditingId(null);
      } else {
        await api.post('/terrains', payload);
        toast({
          title: "Terrain ajouté !",
          description: `Le terrain "${form.name}" a été créé.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }

      setForm({ name: '', sport: 'foot', capacity: '', location: '', pricePerHour: '' });
      fetchTerrains();
    } catch (err) {
      console.error('Erreur submit terrain:', err);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le terrain.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (terrain) => {
    setEditingId(terrain._id);
    setForm({
      name: terrain.name,
      sport: terrain.sport,
      capacity: terrain.capacity?.toString() || '',
      location: terrain.location,
      pricePerHour: terrain.pricePerHour?.toString() || ''
    });
  };

  const openDeleteDialog = (id) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const terrainToDelete = terrains.find(t => t._id === deleteId);
      await api.delete(`/terrains/${deleteId}`);
      toast({
        title: "Terrain supprimé !",
        description: `Le terrain "${terrainToDelete?.name}" a été supprimé.`,
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      setIsDeleteOpen(false);
      fetchTerrains();
    } catch (err) {
      console.error('Erreur delete terrain:', err);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le terrain.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!user || user.role !== 'admin') {
    return <Text>Accès refusé. Vous devez être admin pour voir cette page.</Text>;
  }

  return (
    <Box minH="100vh" py={10} px={5}>
      {/* Background dynamique */}
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
        <Heading mb={6} textAlign="center" color="white">Gestion des Terrains (Admin)</Heading>

        {/* Formulaire */}
        <Box mb={8} p={6} bg="whiteAlpha.900" borderRadius="xl" boxShadow="lg">
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <Input
                name="name"
                placeholder="Nom du terrain"
                value={form.name}
                onChange={handleChange}
                isRequired
              />

              <Select name="sport" value={form.sport} onChange={handleChange} isRequired>
                {sportsOptions.map((s) => (
                  <option key={s.name} value={s.name}>{s.name.toUpperCase()}</option>
                ))}
              </Select>

              <NumberInput value={form.capacity} onChange={(val) => handleNumberChange('capacity', val)}>
                <NumberInputField name="capacity" placeholder="Capacité" isRequired />
              </NumberInput>

              <Input
                name="location"
                placeholder="Localisation"
                value={form.location}
                onChange={handleChange}
                isRequired
              />

              <NumberInput value={form.pricePerHour} onChange={(val) => handleNumberChange('pricePerHour', val)}>
                <NumberInputField name="pricePerHour" placeholder="Prix / heure" isRequired />
              </NumberInput>

              <Button type="submit" colorScheme="green">
                {editingId ? 'Modifier le terrain' : 'Ajouter un terrain'}
              </Button>
            </Stack>
          </form>
        </Box>

        {/* Grille de terrains */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          {terrains.map((t) => (
            <Card
              key={t._id}
              borderRadius="xl"
              boxShadow="md"
              bg="whiteAlpha.900"
              _hover={{ transform: 'scale(1.02)', shadow: 'xl', transition: '0.2s' }}
            >
              <CardHeader>
                <Heading size="md">{t.name}</Heading>
              </CardHeader>
              <CardBody>
                <Text>Sport : <b>{t.sport.toUpperCase()}</b></Text>
                <Text>Capacité : {t.capacity}</Text>
                <Text>Lieu : {t.location}</Text>
                <Text>Prix / heure : {t.pricePerHour} DT</Text>
              </CardBody>
              <CardFooter>
                <Flex gap={2}>
                  <Button size="sm" colorScheme="teal" onClick={() => handleEdit(t)}>Modifier</Button>
                  <Button size="sm" colorScheme="red" onClick={() => openDeleteDialog(t._id)}>Supprimer</Button>
                </Flex>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>

        {/* Dialog de suppression */}
        <AlertDialog
          isOpen={isDeleteOpen}
          leastDestructiveRef={cancelRef}
          onClose={() => setIsDeleteOpen(false)}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Confirmer la suppression
              </AlertDialogHeader>

              <AlertDialogBody>
                Voulez-vous vraiment supprimer ce terrain ?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={() => setIsDeleteOpen(false)}>
                  Annuler
                </Button>
                <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                  Supprimer
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Box>
    </Box>
  );
}
