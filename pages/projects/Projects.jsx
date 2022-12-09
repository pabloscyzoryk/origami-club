// imports
import useCollection from "../../hooks/useCollection";
import { useState } from "react";
import { SearchIcon } from "@chakra-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faClose } from "@fortawesome/free-solid-svg-icons";

// chakra ui
import {
  Flex,
  Input,
  InputRightElement,
  InputGroup,
  Heading,
  Button,
  SimpleGrid,
  Text,
  Select,
  Tooltip
} from "@chakra-ui/react";

// components
import ProjectsList from "../../components/ProjectsList";
import ProjectsListSkeleton from "../../components/ProjectsListSkeleton";
import Footer from "../../components/Footer";

// styles
import "./Projects.css";

export default function Projects() {
  const [query, setQuery] = useState("");
  const { documents, error, isPending } = useCollection("projects");
  const [advOptionsShown, setAdvOptionsShown] = useState(false);

  const [categoryFilters, setCategoryFilters] = useState({
    plant: false,
    animal: false,
    decoration: false,
    toy: false,
    transport: false,
    other: false,
  });

  const [favFilter, setFavFilter] = useState(false);
  const [sorts, setSorts] = useState({
    byDate: 'true',
    asc: 'false'
  });

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
            placeholder="search by: title, author, date or difficulty"
            onChange={(e) => setQuery(e.target.value)}
          />
          <InputRightElement children={<SearchIcon />}></InputRightElement>
        </InputGroup>
        <Tooltip label='Advaned Options' hasArrow aria-label='A tooltip'>
          <Button
            ml={5}
            onClick={() => {
              setAdvOptionsShown((prevOptions) => !prevOptions);
            }}
          >
            <FontAwesomeIcon icon={advOptionsShown ?  faClose : faGear} />
          </Button>
        </Tooltip>
      </Flex>

      {advOptionsShown && (
        <Flex
          gap={20}
          direction="column"
          width="100vw"
          justify="center"
          align="center"
        >
          <SimpleGrid
            mb="7vh"
            minChildWidth="80px"
            width="75%"
            align="center"
            justify="center"
            mt="-15vh"
            spacing={10}
          >
            {/* input sort by date, select favs, pick random, most liked */}
            {!categoryFilters.plant && (
              <Button
                onClick={() => {
                  setCategoryFilters({ ...categoryFilters, plant: true });
                }}
              >
                Plant
              </Button>
            )}
            {categoryFilters.plant && (
              <Button
                bgColor="#ffcc5c"
                _hover={{ bgColor: "#ffb61a" }}
                onClick={() => {
                  setCategoryFilters({ ...categoryFilters, plant: false });
                }}
              >
                Plant
              </Button>
            )}

            {!categoryFilters.animal && (
              <Button
                onClick={() => {
                  setCategoryFilters({ ...categoryFilters, animal: true });
                }}
              >
                Animal
              </Button>
            )}
            {categoryFilters.animal && (
              <Button
                bgColor="#ffcc5c"
                _hover={{ bgColor: "#ffb61a" }}
                onClick={() => {
                  setCategoryFilters({ ...categoryFilters, animal: false });
                }}
              >
                Animal
              </Button>
            )}

            {!categoryFilters.decoration && (
              <Button
                onClick={() => {
                  setCategoryFilters({ ...categoryFilters, decoration: true });
                }}
              >
                Decoration
              </Button>
            )}
            {categoryFilters.decoration && (
              <Button
                bgColor="#ffcc5c"
                _hover={{ bgColor: "#ffb61a" }}
                onClick={() => {
                  setCategoryFilters({ ...categoryFilters, decoration: false });
                }}
              >
                Decoration
              </Button>
            )}

            {!categoryFilters.toy && (
              <Button
                onClick={() => {
                  setCategoryFilters({ ...categoryFilters, toy: true });
                }}
              >
                Toy
              </Button>
            )}
            {categoryFilters.toy && (
              <Button
                bgColor="#ffcc5c"
                _hover={{ bgColor: "#ffb61a" }}
                onClick={() => {
                  setCategoryFilters({ ...categoryFilters, toy: false });
                }}
              >
                Toy
              </Button>
            )}

            {!categoryFilters.transport && (
              <Button
                onClick={() => {
                  setCategoryFilters({ ...categoryFilters, transport: true });
                }}
              >
                Transport
              </Button>
            )}
            {categoryFilters.transport && (
              <Button
                bgColor="#ffcc5c"
                _hover={{ bgColor: "#ffb61a" }}
                onClick={() => {
                  setCategoryFilters({ ...categoryFilters, transport: false });
                }}
              >
                Transport
              </Button>
            )}

            {!categoryFilters.other && (
              <Button
                onClick={() => {
                  setCategoryFilters({ ...categoryFilters, other: true });
                }}
              >
                Other
              </Button>
            )}
            {categoryFilters.other && (
              <Button
                bgColor="#ffcc5c"
                _hover={{ bgColor: "#ffb61a" }}
                onClick={() => {
                  setCategoryFilters({ ...categoryFilters, other: false });
                }}
              >
                Other
              </Button>
            )}
          </SimpleGrid>

          <SimpleGrid
            mb="7vh"
            minChildWidth="200px"
            width="75%"
            align="center"
            justify="center"
            mt="-15vh"
            spacing={10}
          >
            {!favFilter && (
              <Button
                onClick={() => {
                  setFavFilter(true);
                }}
              >
                Favourites
              </Button>
            )}
            {favFilter && (
              <Button
                bgColor="#ffcc5c"
                _hover={{ bgColor: "#ffb61a" }}
                onClick={() => {
                  setFavFilter(false);
                }}
              >
                Favourites
              </Button>
            )}

            <Flex minWidth='200px' align='center' justify='center' gap={5}>
              <Text>Sort by: </Text>
              <Select maxWidth='20%' minWidth='85px' value={sorts.byDate} onChange={e => {setSorts({ ...sorts, byDate: e.target.value })}}>
                <option value='true'>Date</option>
                <option value='false'>Rate</option>
              </Select>
              <Select maxWidth='20%' minWidth='85px' value={sorts.asc} onChange={e => {setSorts({ ...sorts, asc: e.target.value })}}>
                <option value='true'>ASC</option>
                <option value='false'>DESC</option>
              </Select>
            </Flex>
          </SimpleGrid>
        </Flex>
      )}

      <Flex width="100wv" justifyContent="center">
        <Heading>Recent projects:</Heading>
      </Flex>

      {documents && (
        <>
          <ProjectsList
            documents={documents}
            error={error}
            query={query}
            filters={categoryFilters}
            favFilter={favFilter}
            sorts={sorts}
          />
        </>
      )}

      {isPending && <ProjectsListSkeleton />}

      <Flex height="27vh" justify="end" direction="column">
        <Footer />
      </Flex>
    </div>
  );
}
