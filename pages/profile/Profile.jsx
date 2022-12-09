// imports
import { useParams } from "react-router-dom";
import useCollection from "../../hooks/useCollection";
import useDocument from "../../hooks/useDocument";
import { projectFirestore } from "../../firebase/config";
import { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

// chakra ui
import { Heading, Image, Flex, Text, Button } from "@chakra-ui/react";

// components
import ProjectsList from "../../components/ProjectsList";
import ProfileSkeleton from "./ProfileSkeleton";
import ProjectsListSkeleton from "../../components/ProjectsListSkeleton";
import Footer from "../../components/Footer";

// styles
import "./Profile.css";

export default function Profile() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const { document, error, isPending } = useDocument("users", id);
  const {
    documents: projects,
    error: projectsError,
    isPending: projectsPending,
  } = useCollection("projects");

  const [profilePicture, setProfilePicture] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [profileNote, setProfileNote] = useState("");
  const [backgroundURL, setBackgroundURL] = useState("");
  const [profileLikes, setProfileLikes] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const navigate = useNavigate();

  const getUser = useCallback(() => {
    if (document.id === id) {
      setProfilePicture(document.photoURL);
      setDisplayName(document.displayName);
      setProfileNote(document.profileNote);
      setProfileLikes(document.profileLikes);
      setBackgroundURL(document.backgroundURL);
      setIsOnline(document.online);
    }

    console.log(document);
  }, [document, id]);

  useEffect(() => {
    document && getUser();
  }, [document, getUser, id]);

  const handleLike = async () => {
    if (document) {
      const likes = profileLikes;

      if (likes.includes(user.uid)) {
        const index = likes.indexOf(user.uid);
        likes.splice(index, 1);
      } else {
        likes.push(user.uid);
      }

      try {
        await projectFirestore
          .collection("users")
          .doc(id)
          .update({ profileLikes: likes });
      } catch (err) {
        console.log(err);
      }

      setProfileLikes(likes);
      return;
    }
  };

  return (
    <section className="profile">
      {document && !error && user.uid === id && (
        <>
          <Flex width="100vw" height="60vh">
            <Image src={backgroundURL} width="100vw" height="40vh" />
          </Flex>
          <Flex
            width="100vw"
            align="center"
            justify="center"
            direction="column"
          >
            <Image
              border={isOnline ? "thick solid limegreen" : "none"}
              src={profilePicture}
              mt={-275}
              width="230px"
              height="230px"
              borderRadius="full"
            />
            <Text fontSize="1.5em">{displayName}</Text>
            <Text maxWidth="90vw" textAlign="center">
              {profileNote}
            </Text>
            <Flex mt={5} gap={5}>
              <Button
                _hover={{ bgColor: "#222" }}
                onClick={() => {
                  navigate(`/settings/${id}`);
                }}
                color="white"
                bgColor="#555"
              >
                Edit&nbsp;
                <FontAwesomeIcon icon={faEdit} />
              </Button>
              {profileLikes && (
                <Button
                  _hover={{ bgColor: "skyblue" }}
                  color="white"
                  bgColor="teal"
                >
                  <FontAwesomeIcon icon={faHeart} />
                  &nbsp;{profileLikes.length}
                </Button>
              )}
            </Flex>
            <Heading mt={10}>Your projects:</Heading>
          </Flex>
          {projects && (
            <ProjectsList
              documents={projects}
              authorQuery={id}
              error={projectsError}
            />
          )}
        </>
      )}

      {document && !error && user.uid !== id && (
        <>
          <Flex width="100vw" height="60vh">
            <Image src={backgroundURL} width="100vw" height="40vh" />
          </Flex>
          <Flex
            width="100vw"
            align="center"
            justify="center"
            direction="column"
          >
            <Image
              border={isOnline ? "thick solid limegreen" : "none"}
              src={profilePicture}
              mt={-275}
              width="230px"
              height="230px"
              borderRadius="full"
            />
            <Text maxWidth="90vw" textAlign="center" fontSize="1.5em">
              {displayName}
            </Text>
            <Flex mt={4} mb={4} gap={5}>
              {profileLikes && (
                <Button
                  _hover={{ bgColor: "skyblue" }}
                  onClick={handleLike}
                  color="white"
                  bgColor="teal"
                >
                  <FontAwesomeIcon icon={faHeart} />
                  &nbsp;{profileLikes.length}
                </Button>
              )}
            </Flex>
            <Text>{profileNote}</Text>
            <Heading mt={10}>{displayName}'s projects:</Heading>
          </Flex>
          {projects && (
            <ProjectsList
              documents={projects}
              authorQuery={id}
              error={projectsError}
            />
          )}
        </>
      )}

      {isPending && <ProfileSkeleton />}
      {projectsPending && <ProjectsListSkeleton />}

      {error && (
        <Flex width="100vw" height="100vh" justify="center" align="center">
          <Heading>{error}</Heading>
        </Flex>
      )}
      <Flex height="20vh" justify="end" direction="column">
        <Footer />
      </Flex>
    </section>
  );
}
