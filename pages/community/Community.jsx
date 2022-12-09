// imports
import useCollection from "../../hooks/useCollection";
import { useState } from "react";
import { SearchIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// chakra ui
import {
  Flex,
  Input,
  InputRightElement,
  InputGroup,
  Heading,
  SimpleGrid,
  Text,
  Image,
} from "@chakra-ui/react";

// components
import Footer from "../../components/Footer";

export default function Community() {
  const [query, setQuery] = useState("");
  let { documents, error, isPending } = useCollection("users");

  const navigate = useNavigate();

  const placeholder = new Array(30).fill('user-placeholder')

  if (documents && query) {
    documents = documents.filter(document => document.displayName.includes(query) || document.id === query)
  }

  return (
    <div>
      <Flex
        width="100wv"
        height="50vh"
        justifyContent="center"
        alignItems="center"
      >
        <InputGroup width="40%" minWidth="250px">
          <Input
            placeholder="search by displayname or id"
            onChange={(e) => setQuery(e.target.value)}
          />
          <InputRightElement children={<SearchIcon />}></InputRightElement>
        </InputGroup>
      </Flex>

      <Flex width="100wv" justifyContent="center">
        {!query && <Heading>Club members:</Heading>}
        {query && <Heading>Matching users:</Heading>}
      </Flex>

      {documents && (
          <Flex width="100vw" justifyContent="center" mt={5}>
            <SimpleGrid
              minChildWidth="200px"
              spacing="50px"
              mt={8}
              width="90vw"
              mb={5}
            >
              {documents.map((document) => (
                <Flex key={document.id} cursor='pointer' onClick={() => { navigate(`/profile/${document.id}`) }} align="center" direction="column">
                  <Image
                    border={document.online ? "thick solid limegreen" : "none"}
                    borderRadius="full"
                    height="215px"
                    width="215px"
                    src={document.photoURL}
                  />
                  <Text>{document.displayName}</Text>
                </Flex>
              ))}
            </SimpleGrid>
          </Flex>
      )}

      {isPending && (
          <Flex width="100vw" justifyContent="center" mt={5}>
            <SimpleGrid
              minChildWidth="200px"
              spacing="50px"
              mt={8}
              width="90vw"
              mb={5}
            >
              {placeholder.map((skeleton, index) => (
                <Flex key={index} cursor='pointer' align="center" direction="column">
                  <Skeleton
                    height={215}
                    width={215}
                    circle
                  />
                  <Skeleton height={22} width={120}/>
                </Flex>
              ))}
            </SimpleGrid>
          </Flex>
      )}

      {documents && documents.length === 0 && !isPending && (
        <Flex height='40vh' justify='center' width='100vw'>
          <Text>Could not find any users</Text>
        </Flex>
      )}

      {error && (
        <Flex height='40vh' justify='center' width='100vw'>
          <Text>{error}</Text>
        </Flex>
      )}

      <Flex height="27vh" justify="end" direction="column">
        <Footer />
      </Flex>
    </div>
  );
}
