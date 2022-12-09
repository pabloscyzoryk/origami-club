import { Flex, Text, Heading, SimpleGrid, Box, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import MediaQuery from "react-responsive";
import { useAuthContext } from "../hooks/useAuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

import blankImg from "../assets/img/blankimg.png";

export default function ProjectsList({
  documents,
  error,
  query,
  authorQuery,
  filters,
  favFilter,
  sorts
}) {
  const { user } = useAuthContext();

  const calcRate = document => document.starsList.reduce((acc, val) => acc + (val.stars/document.starsList.length), 0);

  if (documents && favFilter) {
    documents = documents.filter(document => document.favList.includes(user.uid))
  }

  if (filters && documents) {
    if (Object.values(filters).some((value) => value === true)) {
      const {
        plant,
        animal,
        decoration,
        toy,
        transport,
        other,
      } = filters;

      const categories = [];

      if (plant) {
        categories.push("plant");
      }
      if (animal) {
        categories.push("animal");
      }
      if (decoration) {
        categories.push("decoration");
      }
      if (toy) {
        categories.push("toy");
      }
      if (transport) {
        categories.push("transport");
      }
      if (other) {
        categories.push("other");
      }

      console.log(categories);

      documents = documents.filter((document) => {
        if (document.category) {
          return categories.includes(document.category.toLowerCase());
        }

        return false;
      });

    }
  }
  if (documents && query) {
    query = query.trim();
    query = query.toLowerCase();
    documents = documents.filter(
      (document) =>
        document.title.toLowerCase().includes(query) ||
        document.authorDisplayName.toLowerCase().includes(query) ||
        new Date(document.timestamp)
          .toLocaleDateString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .includes(query) ||
        document.difficulty.toLowerCase().includes(query)
    );
  }

  if (documents && authorQuery) {
    authorQuery = authorQuery.trim();
    documents = documents.filter(
      (document) => document.authorUid === authorQuery
    );
  }

  if (documents && sorts) {
    let { byDate, asc } = sorts;
    // convert to boolean
    byDate = (byDate === 'true');
    asc = (asc === 'true');

    console.log(byDate, asc)

    if(byDate && asc) {  
      documents.sort((a, b) => a.timestamp - b.timestamp);
    }

    if(byDate && !asc) {
      documents.sort((a, b) => b.timestamp - a.timestamp);
    }

    if(!byDate && asc) {  
      documents.sort((a, b) => calcRate(a) - calcRate(b));
    }

    if(!byDate && !asc) {
      documents.sort((a, b) => calcRate(b) - calcRate(a));
    }

  }

  const navigate = useNavigate();

  const handleUnderlineColor = (difficulty) => {
    if (difficulty === "Beginner") {
      return "limegreen";
    } else if (difficulty === "Intermediate") {
      return "orangered";
    } else if (difficulty === "Advanced") {
      return "crimson";
    } else if (difficulty === "Master") {
      return "purple";
    }
  };

  return (
    <>
      <MediaQuery maxWidth={800}>
        <Flex width="100vw" justifyContent="center" mt={5}>
          <SimpleGrid
            minChildWidth="250px"
            spacing="50px"
            mt={8}
            width="90vw"
            mb={5}
          >
            {documents &&
              documents.map((project) => (
                <Box
                  cursor="pointer"
                  _hover={{
                    boxShadow: "2xl",
                  }}
                  boxShadow="xl"
                  p={2}
                  key={project.id}
                  borderRadius="5px"
                  onClick={() => {
                    navigate(`/project/${project.id}`);
                  }}
                >
                  <Flex justifyContent="center" gap={10}>
                    <Text
                      mb={3}
                      style={{
                        textDecorationColor: handleUnderlineColor(
                          project.difficulty
                        ),
                        textDecorationThickness: "3px",
                      }}
                      textDecoration="underline"
                      fontSize="1.2em"
                    >
                      {project.title}
                    </Text>
                      {project.starsList.length > 0 && 
                      <Text>
                        <FontAwesomeIcon icon={faStar}/> {
                        calcRate(project) > 0 &&  Math.round(calcRate(project) * 100) / 100
                        }
                      </Text>
                      }             
                  </Flex>
                  <Flex justify="center">
                    {project.thumbnail ===
                    "https://content.hostgator.com/img/weebly_image_sample.png" ? (
                      <Image
                        borderRadius="3px"
                        width="480px"
                        height="175px"
                        src={blankImg}
                        alt={project.title}
                      />
                    ) : (
                      <Image
                        borderRadius="3px"
                        width="480px"
                        height="175px"
                        src={project.thumbnail}
                        alt={project.title}
                      />
                    )}
                  </Flex>
                  <Flex justify="space-around" mt={2}>
                    <Text>
                      {new Date(project.timestamp).toLocaleDateString()}
                    </Text>
                    <Text>by {project.authorDisplayName}</Text>
                  </Flex>
                </Box>
              ))}
          </SimpleGrid>
        </Flex>
      </MediaQuery>

      <MediaQuery minWidth={801}>
        <Flex width="100vw" justifyContent="center" mt={5}>
          <SimpleGrid
            minChildWidth="250px"
            spacing="50px"
            mt={8}
            width="90vw"
            mb={5}
          >
            {documents &&
              documents.map((project) => (
                <Box
                  _hover={{
                    boxShadow: "2xl",
                  }}
                  boxShadow="xl"
                  maxWidth="350px"
                  cursor="pointer"
                  p={2}
                  key={project.id}
                  borderRadius="5px"
                  onClick={() => {
                    navigate(`/project/${project.id}`);
                  }}
                >
                  <Flex justifyContent="center" gap={10}>
                    <Text
                      mb={3}
                      style={{
                        textDecorationColor: handleUnderlineColor(
                          project.difficulty
                        ),
                        textDecorationThickness: "3px",
                      }}
                      textDecoration="underline"
                      fontSize="1.2em"
                    >
                      {project.title}
                    </Text>
                    {project.starsList.length > 0 && 
                      <Text>
                        <FontAwesomeIcon icon={faStar}/> {
                        calcRate(project) > 0 &&  calcRate(project)
                        }
                      </Text>
                      } 
                  </Flex>
                  <Flex justify="center">
                    {project.thumbnail ===
                    "https://content.hostgator.com/img/weebly_image_sample.png" ? (
                      <Image
                        borderRadius="3px"
                        width="480px"
                        height="175px"
                        src={blankImg}
                        alt={project.title}
                      />
                    ) : (
                      <Image
                        borderRadius="3px"
                        width="480px"
                        height="175px"
                        src={project.thumbnail}
                        alt={project.title}
                      />
                    )}
                  </Flex>
                  <Flex justify="space-around" mt={2}>
                    <Text>
                      {new Date(project.timestamp).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </Text>
                    <Text>by {project.authorDisplayName}</Text>
                  </Flex>
                </Box>
              ))}
          </SimpleGrid>
        </Flex>
      </MediaQuery>

      {error && (
        <Flex
          width="100vw"
          height="100vh"
          justifyContent="center"
          alignItems="center"
        >
          <Heading>{error}</Heading>
        </Flex>
      )}

      {(!documents || documents.length === 0) && (
        <Flex width="100wv" height="10vh" justify="center" align="center">
          <Text mt={-20} fontSize="1.5em">
            No projects yet
          </Text>
        </Flex>
      )}
    </>
  );
}
