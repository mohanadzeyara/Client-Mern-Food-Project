import React, { useEffect, useState } from 'react';
import { Box, Flex, Button, IconButton, Input, InputGroup, InputLeftElement, Avatar, Menu, MenuButton, MenuItem, MenuList, useDisclosure, Stack, Link as CLink } from '@chakra-ui/react';
import { HamburgerIcon, SearchIcon } from '@chakra-ui/icons';
import { Link, useLocation, useNavigate, createSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Keep search input in sync with URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQuery(params.get('q') || '');
  }, [location.search]);

  const submitSearch = (e) => {
    e?.preventDefault();
    navigate({ pathname: '/', search: `?${createSearchParams({ q: query })}` });
  };

  const NavLinks = () => (
    <>
      {user && (
        <>
          <CLink as={Link} to="/" onClick={onClose}>Recipes</CLink>
          <CLink as={Link} to="/add" onClick={onClose}>Add Recipe</CLink>
          <CLink as={Link} to="/profile" onClick={onClose}>Profile</CLink>
        </>
      )}
    </>
  );

  return (
    <Box bg="white" borderBottom="1px solid #eee" px={4} py={2} position="sticky" top="0" zIndex="10">
      <Flex align="center" gap={4}>
        <IconButton display={{ base: 'inline-flex', md: 'none' }} icon={<HamburgerIcon />} onClick={isOpen ? onClose : onOpen} aria-label="menu" />
        <CLink as={Link} to="/" fontWeight="bold">MERN Food</CLink>

        <form onSubmit={submitSearch} style={{ flexGrow: 1 }}>
          <InputGroup maxW={{ base: 'full', md: '400px' }} ml={{ base: 0, md: 6 }}>
            <InputLeftElement><SearchIcon /></InputLeftElement>
            <Input placeholder="Search recipes..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </InputGroup>
        </form>

        <Flex ml="auto" align="center" gap={3} display={{ base: 'none', md: 'flex' }}>
          <NavLinks />
          {!user ? (
            <>
              <Button as={Link} to="/login" variant="ghost">Login</Button>
              <Button as={Link} to="/register" colorScheme="teal">Register</Button>
            </>
          ) : (
            <Menu>
              <MenuButton as={Button} rightIcon={<Avatar size="sm" name={user?.name} />}>
                {user?.name}
              </MenuButton>
              <MenuList>
                <MenuItem as={Link} to="/profile">Profile</MenuItem>
                <MenuItem onClick={logout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
      </Flex>

      {/* Mobile menu */}
      {isOpen && (
        <Box display={{ md: 'none' }} mt={2}>
          <Stack>
            <form onSubmit={submitSearch}>
              <InputGroup>
                <InputLeftElement><SearchIcon /></InputLeftElement>
                <Input placeholder="Search recipes..." value={query} onChange={(e) => setQuery(e.target.value)} />
              </InputGroup>
            </form>
            <NavLinks />
            {!user ? (
              <>
                <Button as={Link} to="/login" variant="ghost" onClick={onClose}>Login</Button>
                <Button as={Link} to="/register" colorScheme="teal" onClick={onClose}>Register</Button>
              </>
            ) : (
              <Button onClick={() => { logout(); onClose(); }}>Logout</Button>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
