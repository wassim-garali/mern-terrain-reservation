// src/components/Footer.jsx
import { Box, Flex, Text, Link, Stack, HStack } from '@chakra-ui/react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <Box bg="teal.600" color="white" mt={10} py={6}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        maxW="1200px"
        mx="auto"
        px={4}
        justify="space-between"
        align="center"
      >
        {/* Nom de l'application */}
        <Text fontWeight="bold" fontSize="lg" mb={{ base: 2, md: 0 }}>
          Mini-Projet
        </Text>

        {/* Liens utiles */}
        <Stack direction={{ base: 'column', md: 'row' }} spacing={4} align="center" mb={{ base: 2, md: 0 }}>
          <Link href="/" _hover={{ textDecoration: 'underline' }}>
            Accueil
          </Link>
          <Link href="/terrains" _hover={{ textDecoration: 'underline' }}>
            Terrains
          </Link>
          <Link href="/profile" _hover={{ textDecoration: 'underline' }}>
            Mon profil
          </Link>
          <Link href="/contact" _hover={{ textDecoration: 'underline' }}>
            Contact
          </Link>
        </Stack>

        {/* Réseaux sociaux */}
        <HStack spacing={4}>
          <Link href="#" isExternal aria-label="Facebook" _hover={{ color: 'gray.300' }}>
            <FaFacebook />
          </Link>
          <Link href="#" isExternal aria-label="Twitter" _hover={{ color: 'gray.300' }}>
            <FaTwitter />
          </Link>
          <Link href="#" isExternal aria-label="Instagram" _hover={{ color: 'gray.300' }}>
            <FaInstagram />
          </Link>
        </HStack>

        {/* Copyright */}
        <Text fontSize="sm" mt={{ base: 2, md: 0 }}>
          &copy; {new Date().getFullYear()} Mini-Projet. Tous droits réservés.
        </Text>
      </Flex>
    </Box>
  );
}
