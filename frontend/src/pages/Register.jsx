import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Button,
  Heading,
  Input,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  Link
} from '@chakra-ui/react';

import bgRegister from '../assets/back8.jpg';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await register(username, email, password);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || "Erreur d'inscription");
    }
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
      
      {/* 🌄 Background global */}
      <Box
        position="fixed"
        top={0}
        left={0}
        w="100%"
        h="100%"
        zIndex={-1}
        backgroundImage={`url(${bgRegister})`}
        backgroundSize="cover"
        backgroundPosition="center"
        filter="brightness(0.6)"
      />

      {/* Card */}
      <Box
        bg="white"
        p={8}
        borderRadius="xl"
        w="100%"
        maxW="450px"
        boxShadow="2xl"
      >
        <VStack spacing={4} as="form" onSubmit={handleSubmit}>
          <Heading size="lg">Créer un compte</Heading>

          <Text fontSize="sm" color="gray.500" textAlign="center">
            Rejoignez la plateforme et gérez vos réservations facilement
          </Text>

          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <FormControl isRequired>
            <FormLabel>Nom d’utilisateur</FormLabel>
            <Input
              placeholder="Ex. Ahmed Ben Ali"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="vous@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Mot de passe</FormLabel>
            <Input
              type="password"
              minLength={6}
              placeholder="Au moins 6 caractères"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>

          <Button type="submit" colorScheme="teal" width="100%" mt={2}>
            S’inscrire
          </Button>

          <Text fontSize="sm">
            Déjà un compte ?{' '}
            <Link as={RouterLink} to="/login" color="teal.500">
              Se connecter
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}

export default Register;
