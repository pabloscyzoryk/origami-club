// imports
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// chakra ui
import { Heading, Flex, Box } from "@chakra-ui/react";

// components
export default function ProfileSkeleton() {
  return (
    <>
      <Flex width="100vw" height="60vh">
        <Skeleton width="100vw" height="40vh" />
      </Flex>
      <Flex width="100vw" align="center" justify="center" direction="column">
        <Box mt={-275}>
          <Skeleton width="230px" height="230px" circle />
        </Box>

        <Skeleton width={200} height={25} />

        <Skeleton count={3} width={400} height={20} />
        <Heading mt={10}>Users's projects:</Heading>
      </Flex>
    </>
  );
}
