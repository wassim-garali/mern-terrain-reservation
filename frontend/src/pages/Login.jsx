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

import bgLogin from '../assets/back8.jpg';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
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
        backgroundImage={`url(${bgLogin})`}
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
        maxW="420px"
        boxShadow="2xl"
      >
        <VStack spacing={4} as="form" onSubmit={handleSubmit}>
          <Heading size="lg">Connexion</Heading>

          <Text fontSize="sm" color="gray.500" textAlign="center">
            Accédez à vos réservations et à votre profil
          </Text>

          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}

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
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>

          <Button type="submit" colorScheme="teal" width="100%" mt={2}>
            Se connecter
          </Button>

          <Text fontSize="sm">
            Pas encore de compte ?{' '}
            <Link as={RouterLink} to="/register" color="teal.500">
              Créer un compte
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}

export default Login;
