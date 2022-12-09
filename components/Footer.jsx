// imports
import {
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaGithub,
  FaTwitch,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// chakra ui
import {
  Box,
  chakra,
  Container,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
  Flex,
} from "@chakra-ui/react";


const SocialButton = ({ children, label, href }) => {
  return (
    <chakra.button
      bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
      rounded={"full"}
      w={8}
      h={8}
      cursor={"pointer"}
      as={"a"}
      href={href}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      _hover={{
        bg: useColorModeValue("gray.800", "#010409"),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export default function Footer() {


  const navigate = useNavigate();

  return (
    <Box
      bg={useColorModeValue("#010409", "#010409")}
      color={useColorModeValue("rgb(139, 148, 158)", "#010409")}
      width="100vw"
    >
      <Container
        as={Stack}
        maxW={"6xl"}
        py={4}
        direction={{ base: "column", md: "row" }}
        spacing={4}
        justify={{ base: "center", md: "space-between" }}
        align={{ base: "center", md: "center" }}
      >
        <Flex gap="15px">
          <Text>© 2022 Origami Club. All rights reserved</Text>
          <Text
            cursor="pointer"
            _hover={{ textDecoration: "underline" }}
            onClick={() => {
              navigate("/sources");
            }}
          >
            Sources
          </Text>
        </Flex>

        <Stack direction={"row"} spacing={6}>
          <SocialButton
            label={"Twitter"}
            href={"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
          >
            <FaTwitter />
          </SocialButton>
          <SocialButton
            label={"YouTube"}
            href={"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
          >
            <FaYoutube />
          </SocialButton>
          <SocialButton
            label={"Instagram"}
            href={"https://www.instagram.com/pabloscyzoryk/"}
          >
            <FaInstagram />
          </SocialButton>
          <SocialButton
            label={"Github"}
            href={"https://github.com/pabloscyzoryk"}
          >
            <FaGithub />
          </SocialButton>
          <SocialButton
            label={"Twitch"}
            href={"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
          >
            <FaTwitch />
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  );
}
