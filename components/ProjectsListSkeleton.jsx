import { Flex, SimpleGrid, Box } from "@chakra-ui/react";
import MediaQuery from "react-responsive";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ProjectsListSkeleton() {
  const placeholder = Array(25).fill("project-placeholder");

  return (
    <>
      <MediaQuery minWidth={801}>
        <Flex width="100vw" justifyContent="center" mt={5}>
          <SimpleGrid
            minChildWidth="250px"
            spacing="50px"
            mt={8}
            width="90vw"
            mb={5}
          >
            {placeholder.map((skeleton, index) => (
              <Box
                _hover={{
                  boxShadow: "2xl",
                }}
                boxShadow="xl"
                maxWidth="350px"
                cursor="pointer"
                p={2}
                key={index}
                borderRadius="5px"
              >
                <Flex justifyContent="center" gap={10}>
                  <Box mt={5}>
                    <Skeleton width={200} height={20} />
                  </Box>
                </Flex>

                <Flex justify="center">
                  <Skeleton borderRadius="3px" width="480px" height="175px" />
                </Flex>

                <Flex justify="space-around" mt={2}>
                  <Skeleton height={17} width={90} />
                  <Skeleton height={17} width={120} />
                </Flex>
              </Box>
            ))}
          </SimpleGrid>
        </Flex>
      </MediaQuery>

      <MediaQuery maxWidth={800}>
        <Flex width="100vw" justifyContent="center" mt={5}>
          <SimpleGrid
            minChildWidth="250px"
            spacing="50px"
            mt={8}
            width="90vw"
            mb={5}
          >
            {placeholder.map((skeleton, index) => (
              <Box
                _hover={{
                  boxShadow: "2xl",
                }}
                boxShadow="xl"
                cursor="pointer"
                p={2}
                key={index}
                borderRadius="5px"
              >
                <Flex justifyContent="center" gap={10}>
                  <Box mt={5}>
                    <Skeleton width={200} height={20} />
                  </Box>
                </Flex>

                <Flex justify="center">
                  <Skeleton borderRadius="3px" width="480px" height="175px" />
                </Flex>

                <Flex justify="space-around" mt={2}>
                  <Skeleton height={17} width={90} />
                  <Skeleton height={17} width={120} />
                </Flex>
              </Box>
            ))}
          </SimpleGrid>
        </Flex>
      </MediaQuery>
    </>
  );
}
