// src/components/Navbar.jsx
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Flex,
  HStack,
  Link,
  Button,
  IconButton,
  useDisclosure,
  Stack,
  Text,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Booking', path: '/terrains' },
  ];

  if (user?.role === 'admin') {
    navLinks.push({ name: 'Dashbord', path: '/home' });
    navLinks.push({ name: 'Stadium', path: '/admin/terrains' });
  }

  return (
    <Box bg="teal.800" color="white" shadow="md" position="sticky" top={0} zIndex={1000}>
      <Flex
        h={16}
        alignItems="center"
        justifyContent="space-between"
        maxW="1200px"
        mx="auto"
        px={4}
      >
        {/* ☰ Mobile menu */}
        <IconButton
          size="md"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Toggle Menu"
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
          color="white"
          bg="teal.500"
          _hover={{ bg: 'teal.700' }}
        />

        {/* Logo + Nom app */}
        <HStack spacing={2}>
          <Box
            bg="teal.400"
            color="white"
            px={3}
            py={1}
            borderRadius="md"
            fontWeight="bold"
          >
            ⚽
          </Box>
          <Text fontSize="xl" fontWeight="bold" color="white">
            SportBooking
          </Text>
        </HStack>

        {/* Desktop nav links */}
        <HStack
          as="nav"
          spacing={6}
          display={{ base: 'none', md: 'flex' }}
        >
          {navLinks.map(link => (
            <Link
              key={link.path}
              as={RouterLink}
              to={link.path}
              fontWeight="medium"
              color={isActive(link.path) ? 'white' : 'gray.200'}
              borderBottom={isActive(link.path) ? '2px solid white' : 'none'}
              _hover={{ textDecoration: 'none', color: 'whiteAlpha.900' }}
            >
              {link.name}
            </Link>
          ))}
        </HStack>

        {/* User actions */}
        {isAuthenticated ? (
          <Menu>
            <MenuButton>
              <HStack spacing={3}>
                <Avatar size="sm" name={user?.name} />
                <Text display={{ base: 'none', md: 'block' }} color="white">
                  {user?.name || 'Profil'}
                </Text>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem color="teal.700" as={RouterLink} to="/profile">
                My reservations
              </MenuItem>
              <Divider />
              <MenuItem color="red.500" onClick={logout}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <HStack spacing={3}>
            <Button
              as={RouterLink}
              to="/login"
              variant="outline"
              colorScheme="whiteAlpha"
              borderColor="white"
              color="white"
              _hover={{ bg: 'teal.700' }}
            >
              Sign in
            </Button>
            <Button
              as={RouterLink}
              to="/register"
              colorScheme="teal"
              bg="teal.500"
              _hover={{ bg: 'teal.700' }}
            >
              Sign up
            </Button>
          </HStack>
        )}
      </Flex>

      {/* Mobile menu */}
      {isOpen && (
        <Box pb={4} px={4} display={{ md: 'none' }}>
          <Stack spacing={3}>
            {navLinks.map(link => (
              <Link
                key={link.path}
                as={RouterLink}
                to={link.path}
                py={2}
                fontWeight="medium"
                color={isActive(link.path) ? 'white' : 'gray.200'}
                onClick={onClose}
              >
                {link.name}
              </Link>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
