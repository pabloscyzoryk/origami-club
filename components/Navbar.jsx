// imports
import { useRef, useEffect } from "react";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import { HamburgerIcon, CloseIcon, AddIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

// chakra ui
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Image,
} from '@chakra-ui/react';

// images
import logo from '../assets/img/logo1.svg';

// styles
import './Navbar.css';

const NavLink = ({ children }) => (
  <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}>
    {children}
  </Link>
);

export default function Navbar() {
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const navigate = useNavigate();

  const { logout, isPending } = useLogout();
  const { user } = useAuthContext();
  
  const nav = useRef();
  
  const handleMouseMove = (e) => {
    if (e.clientY < 75 || window.scrollY === 0) {
      nav.current.style.top = "0px";
    } else {
      nav.current.style.top = `-${nav.current.offsetHeight}px`;
    }
  };
  
  const handleScroll = () => {
    if (window.scrollY === 0) {
      nav.current.style.top = "0px";
    }
  };
  
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("scroll", handleScroll);
  
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <nav className='navbar' ref={nav}>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Flex align='center'>
              <Image ml={-2} cursor='pointer' onClick={() => { navigate('/') }} src={logo} width='50px' height='50px'/>
              <Box fontWeight='600' cursor={'pointer'} onClick={() => { navigate('/') }}>Origami Club</Box>
            </Flex>
            {user && <HStack onClick={() => { navigate('/projects') }}
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}>
              <NavLink onClick={() => { navigate('/projects') }}>Dashboard</NavLink>
            </HStack>}
            {user && <HStack onClick={() => { navigate('/community') }}
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}>
              <NavLink onClick={() => { navigate('/community') }}>Community</NavLink>
            </HStack>}
          </HStack>
          <Flex alignItems={'center'}>
            {!user && (<>
              <Button onClick={() => navigate('/login')}
                variant={'solid'}
                color='white'
                bgColor='#ffcc5c' 
                _hover={{ bgColor: '#ffb61a' }}
                size={'sm'}
                mr={4}
                >
                Login
              </Button>

              <Button onClick={() => navigate('/signup')}
                color='white'
                variant={'solid'}
                bgColor='#ff6f69'
                _hover={{ bgColor: '#ff4942'}}
                size={'sm'}
                mr={4}
                >
                Sign up
              </Button>
            </>)}

            {user && (
              <Button
                variant={'solid'}
                onClick={() => {navigate('/create')}}
                color='white'
                bgColor='#ffcc5c' 
                _hover={{ bgColor: '#ffb61a' }}
                size={'sm'}
                mr={4}
                leftIcon={<AddIcon />}>
                New Project
              </Button>
            )}
              { user && (
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
                <Avatar
                  size={'sm'}
                  src={user.photoURL}
                />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => { navigate('/profile/' + user.uid) }}>My Profile</MenuItem>
                <MenuItem onClick={() => { navigate('/settings/' + user.uid) }}>Settings</MenuItem>
                <MenuDivider onClick={logout}/>
                <MenuDivider onClick={logout}/>
                {!isPending && <MenuItem onClick={logout}>Logout</MenuItem>}
                {isPending && <MenuItem>Loading</MenuItem>}
              </MenuList> 
            </Menu> )}
          </Flex>
        </Flex>

        {isOpen && user ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4} onClick={() => { navigate('/projects') }}>
              <NavLink onClick={() => { navigate('/projects') }}>Dashboard</NavLink>
            </Stack>
            <Stack as={'nav'} spacing={4} onClick={() => { navigate('/community') }}>
              <NavLink onClick={() => { navigate('/community') }}>Community</NavLink>
            </Stack>
          </Box>
        ) : null}

      {isOpen && !user ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4} onClick={() => { navigate('/login') }}>
              <NavLink onClick={() => { navigate('/login') }}>Login</NavLink>
            </Stack>
            <Stack as={'nav'} spacing={4} onClick={() => { navigate('/signup') }}>
              <NavLink onClick={() => { navigate('/signup') }}>Sign up</NavLink>
            </Stack>
          </Box>
        ) : null} 
      </Box>
    </nav>
  );
}
