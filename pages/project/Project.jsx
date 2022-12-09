// imports
import { useParams } from "react-router-dom";
import useDocument from "../../hooks/useDocument";
import useCollection from "../../hooks/useCollection";
import { useState, useCallback } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrashCan,
  faStar,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { projectFirestore } from "../../firebase/config";

// chakra ui
import { Heading, Image, Flex, Text, Button, Box } from "@chakra-ui/react";

// components
import Footer from "../../components/Footer";

// styles
import "./Project.css";
import blankImg from "../../assets/img/blankimg.png";
import { useEffect } from "react";

export default function Project() {
  const navigate = useNavigate();

  const { id } = useParams();
  const { user } = useAuthContext();
  const { document, error } = useDocument("projects", id);
  const { documents: users, error: usersError } = useCollection("users");
  const [deleteError, setDeleteError] = useState(null);
  const [rate, setRate] = useState(0);
  const [stars, setStars] = useState(0);

  const handleColor = (difficulty) => {
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

  const handleDelete = async () => {
    try {
      await projectFirestore.collection("projects").doc(id).delete();
      navigate("/projects");
    } catch (err) {
      setDeleteError(err);
    }
  };

  const options = {
    title: `Delete this project?`,
    message: "Are you sure? It cannnot be undone later.",
    buttons: [
      {
        label: "Yes",
        onClick: handleDelete,
      },
      {
        label: "No",
      },
    ],
    closeOnEscape: true,
    closeOnClickOutside: true,
    keyCodeForClose: [8, 32],
    willUnmount: () => {},
    afterClose: () => {},
    onClickOutside: () => {},
    onKeypress: () => {},
    onKeypressEscape: () => {},
    overlayClassName: "overlay-custom-class-name",
  };

  const calcRate = useCallback(() => {
    if(document) {
      if(document.starsList.find(rate => rate.uid === user.uid)) {
        setStars(document.starsList.find(rate => 
          rate.uid === user.uid
        ).stars);
      }

      const findAverageRate = (arr) => {
        const { length } = arr;
        return arr.reduce((acc, val) => acc + (val.stars/length), 0)};

      setRate(Math.round(findAverageRate(document.starsList) * 100) / 100);
    }
  }, [document, user.uid])

  useEffect(() => {
    document && calcRate();
  }, [document, calcRate])

  const handleFav = async () => {
    if (document) {
      const favs = document.favList;

      if (favs.includes(user.uid)) {
        const index = favs.indexOf(user.uid);
        favs.splice(index, 1);
      } else {
        favs.push(user.uid);
      }

      try {
        await projectFirestore
          .collection("projects")
          .doc(id)
          .update({ favList: favs });
      } catch (err) {
        console.log(err);
      }

      return;
    }
  };

  const handleRate = async (_stars) => {
    setStars(_stars)

    if(document) {
      const rates = document.starsList;

      if (rates.find(rate => rate.uid === user.uid)) {
        const index = rates.indexOf(rates.find(rate => rate.uid === user.uid))
        rates[index] = {
          uid: user.uid,
          stars: _stars
        }
      } else {
        rates.push({
          uid: user.uid,
          stars: _stars
        })
      }

      try {
        await projectFirestore
          .collection("projects")
          .doc(id)
          .update({ starsList: rates });
      } catch (err) {
        console.log(err);
      }

      return;
    }
  }

  return (
    <>
      {!error && !deleteError && document && (
        <>
          <Flex
            mb={10}
            mt={20}
            width="100wv"
            justify="center"
            align="center"
            direction="column"
          >
            <Heading>{document.title}</Heading>
            <Flex mb={-3} gap={1}>
              <Text>Difficulty:</Text>
              <Flex gap={4}>
                <Text color={handleColor(document.difficulty)}>
                  {document.difficulty}
                </Text>
                {rate > 0 && <Text color='#555'><FontAwesomeIcon icon={faStar} />{rate}</Text>}
                {rate <= 0 && <Text color='#555'><FontAwesomeIcon icon={faStar} /> not rated</Text>}
              </Flex>
            </Flex>
            {document.thumbnail !==
            "https://content.hostgator.com/img/weebly_image_sample.png" ? (
              <Image
                mt={5}
                borderRadius="5px"
                width="600px"
                height="350px"
                src={document.thumbnail}
                maxWidth='95vw'
              />
            ) : (
              <Image
                mt={5}
                borderRadius="5px"
                width="600px"
                height="350px"
                src={blankImg}
                maxWidth='95vw'
              />
            )}
            <Text
              fontSize="1.3em"
              mb={20}
              mt={2}
              textAlign="center"
              width="95%"
              maxHeight="100px"
            >
              {document.description}
            </Text>

            <Flex mt={-5} gap={10}>
            {document.authorUid === user.uid && (
              <>
                <Button
                  _hover={{ bgColor: "#222" }}
                  onClick={() => {
                    navigate(`/edit/${id}`);
                  }}
                  color="white"
                  bgColor="#555"
                >
                  Edit&nbsp;
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
                <Button
                  _hover={{ bgColor: "darkred" }}
                  onClick={() => {
                    confirmAlert(options);
                  }}
                  color="white"
                  bgColor="crimson"
                >
                  Delete&nbsp;
                  <FontAwesomeIcon icon={faTrashCan} />
                </Button>
                </>
            )}
              <Button
                _hover={{ bgColor: "skyblue" }}
                onClick={handleFav}
                color="white"
                bgColor="teal"
              >
                <FontAwesomeIcon icon={faHeart} />
                &nbsp;{document.favList.length}
              </Button>
              {document.authorUid !== user.uid && (
                <Flex fontSize="1.5em" gap="3px" align="center">
                  <Box onClick={() => {handleRate(1)}} cursor='pointer' _hover={{ color: "#FFD700" }} color={stars >= 1 ? "#FFD700" : '#222'}>
                    <FontAwesomeIcon icon={faStar} />
                  </Box>
                  <Box onClick={() => {handleRate(2)}} cursor='pointer' _hover={{ color: "#FFD700" }} color={stars >= 2 ? "#FFD700" : '#222' }>
                    <FontAwesomeIcon icon={faStar} />
                  </Box>
                  <Box onClick={() => {handleRate(3)}} cursor='pointer' _hover={{ color: "#FFD700" }} color={stars >= 3 ? "#FFD700" : '#222' }>
                    <FontAwesomeIcon icon={faStar} />
                  </Box>
                  <Box onClick={() => {handleRate(4)}} cursor='pointer' _hover={{ color: "#FFD700" }} color={stars >= 4 ? "#FFD700" : '#222' }>
                    <FontAwesomeIcon icon={faStar} />
                  </Box>
                  <Box onClick={() => {handleRate(5)}} cursor='pointer' _hover={{ color: "#FFD700" }} color={stars === 5 ? "#FFD700" : '#222' }>
                    <FontAwesomeIcon icon={faStar} />
                  </Box>
                </Flex>
              )}
            </Flex>

            
            {document.steps.map((step, index) => (
              <div key={index}>
                  <Heading>{index + 1}.Step</Heading>
                
                
                  {step.photoSrc !==
                    "https://content.hostgator.com/img/weebly_image_sample.png" && (
                    
                      <Image
                        mt={5}
                        borderRadius="5px"
                        width="600px"
                        height="350px"
                        src={step.photoSrc}
                        maxWidth='95vw'
                      />

      
                  )}
                
                <Text
                  mt={5}
                  mb={5}
                  fontSize="1.3em"
                  textAlign="center"
                  width="70%"
                  maxHeight="100px"
                >
                  {step.stepDescription}
                </Text>
              </div>
            ))}
          </Flex>

          <Flex width="100vw" justify="center">
            <Flex direction="column" align="center">
              {document && users && (
                <Image
                  src={
                    users.find((user) => user.id === document.authorUid)
                      .photoURL
                  }
                  width="80px"
                  height="80px"
                  borderRadius="full"
                  cursor="pointer"
                  onClick={() => {
                    navigate(`/profile/${document.authorUid}`);
                  }}
                />
              )}
              <Text
                onClick={() => {
                  navigate(`/profile/${document.authorUid}`);
                }}
                cursor="pointer"
                textDecoration="underline"
                fontSize="1.2em"
                mb={5}
              >
                by {document.authorDisplayName}
              </Text>
            </Flex>
          </Flex>
        </>
      )}

      {error && (
        <Flex width="100vw" height="100vh" justify="center" align="center">
          <Heading>{error}</Heading>
        </Flex>
      )}

      {usersError && (
        <Flex width="100vw" height="100vh" justify="center" align="center">
          <Heading>{usersError}</Heading>
        </Flex>
      )}

      {deleteError && (
        <Flex width="100vw" height="100vh" justify="center" align="center">
          <Heading>{deleteError}</Heading>
        </Flex>
      )}
      <Footer />
    </>
  );
}
