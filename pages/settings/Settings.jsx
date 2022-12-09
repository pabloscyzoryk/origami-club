// imports
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import useDocument from "../../hooks/useDocument";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Resizer from "react-image-file-resizer";
import { projectStorage, projectFirestore } from "../../firebase/config";

// chakra ui
import {
  Textarea,
  Button,
  Text,
  Flex,
  Image,
  Heading,
  Box,
  Tooltip,
} from "@chakra-ui/react";

// components
import Footer from "../../components/Footer";

// styles
import "./Settings.css";

export default function Settings() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const { document, error } = useDocument("users", id);

  const fileSelector = useRef();

  const [uploadError, setUploadError] = useState(null);

  const [profilePicture, setProfilePicture] = useState(null);
  const [profileNote, setProfileNote] = useState("");

  const [bgIndex, setBgIndex] = useState(0);

  const [newProfileNote, setNewProfileNote] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(null);
  
  const bgPhotos = useMemo(() => 
  [
    "https://cdn.pixabay.com/photo/2016/08/27/00/30/banner-1623469_960_720.jpg",
    "https://cdn.pixabay.com/photo/2017/10/07/23/16/origami-2828268_960_720.jpg",
    "https://cdn.pixabay.com/photo/2018/02/16/03/23/blue-3156843_960_720.jpg",
    "https://cdn.pixabay.com/photo/2012/09/28/20/46/book-58446_960_720.jpg",
    "https://cdn.pixabay.com/photo/2017/08/30/01/05/milky-way-2695569_960_720.jpg",
    "https://cdn.pixabay.com/photo/2016/05/24/16/48/mountains-1412683_960_720.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Flag_of_Poland_%28normative%29.svg/250px-Flag_of_Poland_%28normative%29.svg.png",
    "https://www.meme-arsenal.com/memes/0b1c5a76c2636396770461857d068a89.jpg",
    "https://s1.static.esor.pzkosz.pl/internalfiles/image/zawodnicy/s24/9092/165-165/66129.jpg",
    "https://c.tenor.com/jUMex_rdqPwAAAAM/among-us-twerk.gif",
    "https://htmlcolorcodes.com/assets/images/colors/red-color-solid-background-1920x1080.png",
    "https://digitalsynopsis.com/wp-content/uploads/2017/07/beautiful-color-ui-gradients-backgrounds-roseanna.png",
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwcNDQ0NBwcHBw0NDQ0NDQcHDQ8ICQcNFREWFhURHxUYHSggGBolJxMTITEhJSkrLi4uFx8zODMsNygtLisBCgoKDQ0NDw0NDisZFRkrKystKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKy0rKy0rKysrLSsrK//AABEIAJ8BPgMBIgACEQEDEQH/xAAXAAEBAQEAAAAAAAAAAAAAAAACAQAG/8QAFRABAQAAAAAAAAAAAAAAAAAAAAH/xAAaAQEBAQEBAQEAAAAAAAAAAAACAQADBgQF/8QAFREBAQAAAAAAAAAAAAAAAAAAAAH/2gAMAwEAAhEDEQA/AO3o0kr9dKNGnRqBRo0qlYKNGlUqBYFGnUqOdCjTo1AsCpSqVHOwKNOjWCjRpVKjnQqUqlQLAo06NYLBo0qlRzsGjSqVAoVKVSsFEaSIFFCRAo1CosNRFRBqMqMLMzIzt6hC+17mjUpVKgUKlKpWChUpVKgWBUpVKjnYFg06NYKFSlUqBYFGnRqOdgVKVSoFgVKVGs52DRp0agUKlKpUc6FSlUqBYFGnRrBRqUqlQKNEqlQKNSklYKKLUrDURWQajMzI7hKSPse6o1KVGsNg1KVRAoUadGsFGjTo1HOwaNOjUChUpVKgUKNOjWc7Bo06NQKFGnRqOdg0adGo52BUpUawWDUKjUCwaNOjUc6NGnRrBRqFUQKKKiDRqENYKlRWQRZUZHdCVR9r3dGoSVAojTGsFg0adGoFGjTo1AsGjTo1gsCjTo1Ao0adGo52DRp0agWBRp0ajnYNGnRrBYFGnUqOdgDTo1AsGjTo1HOwaJ0awUEKogUUpCgVBpIw0UKow0WVEF3SElfa92NGklYaKUkQKNGlUqBQqU6NYKFSlUqBQqUqlRzsCjTo1go0adGoFgUadGo50aNKpUCwKlKpUc7Ao06NYKFSlUqOdgVKVSoFgVKVGsFGpSSoFg1CFAqUSSsI1CRBd0lJH2vd0alKow0aJVKg0alJKwURpVKgUKlKpUCwKlKpWCwKNOjUc6FSlUqBYFGnRqOdg0adGsFgVKVGo52DRp0agUKlKpUc6FSlRrBYNGnUqBQqUqKBRqFUYKKUkQKFQqjC7tFR9j3dQaSMIpSSsNGjSqIFFKVSoFCjTo1ho0adGo50aNOjUCwKlOjWChRp0ajnRo06NQLAo06NRzsGjTo1AsCjTo1nOjRp0agUaNOjUc7Bo06NYKI06NQKNQqlQaKUqlYHcsqPte7RKqII1KSVhFCqINGjSSsFg0adGoFGjTo1gsGjTo1AsGjSqVAsCjTo1HOwaNOjWCwKNOjUc6NGnRqBYFSlUqOdgUadGsFg0aVSo52DRp0agUKlKpWCwalWogUUJEGu5RWfa90lRURESqjDRSlUrDRSkKBRSlUqBYNGnRrBQqUqiBYFSlUqBYFGnRrOdGjSqVAsCpSqVHOwKNOjUCwKlKpWc7Ao06NQLAqUqlRzsCpSqVAsCoVGsFGoVRAoiSIFdwzM+17pkVGREVkGjUIawilKogUUpCw0alKpUChUpUawUalKjUCjRp0ajnQqUqlQLAqUqNZzsGjTo1AoVKVGo52DRp0agWBUpVKznYFSlRqBYNSlUqOdCidGsNFKQ1HOv//Z",
    "https://loving-newyork.com/wp-content/uploads/2019/09/fun-things-to-do-in-nyc-at-night-160914155540002-1920x960.jpg",
    "https://i.kym-cdn.com/photos/images/facebook/002/461/184/71a.jpg",
    "https://krakowpomaga.pl/wp-content/uploads/2021/02/pexels-la-mm-1582782-990x660.jpg",
    "https://www.origami.art.pl/storage/moj-pierwszy-zuraw.jpg",
  ], []);

  const navigate = useNavigate();

  const getUser = useCallback(() => {
    if (document.id === id) {
      setProfilePicture(document.photoURL);
      setProfileNote(document.profileNote);
      setBgIndex(bgPhotos.indexOf(document.backgroundURL));
      setNewProfileNote(document.profileNote);
    }
  }, [document, id, bgPhotos]);

  useEffect(() => {
    document && getUser();
  }, [document, getUser, id]);


  const handleLeftClick = () => {
    if (bgIndex === 0) {
      setBgIndex(bgPhotos.length - 1);
    } else {
      setBgIndex(bgIndex - 1);
    }
  };

  const handleRightClick = () => {
    if (bgIndex === bgPhotos.length - 1) {
      setBgIndex(0);
    } else {
      setBgIndex(bgIndex + 1);
    }
  };

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "blob"
      );
    });

  const handleFileChange = async (e) => {
    setThumbnail(null);
    const file = e.target.files[0];

    if (!file) {
      setThumbnailError("Please select a file");
      return;
    }

    if (!file.type.includes("image")) {
      setThumbnailError("Selected file must be an image");
      return;
    }

    const selected = await resizeFile(file);

    if (selected.size > 100000) {
      setThumbnailError("Image file size must be less than 100kb");
      return;
    }

    setThumbnailError(null);
    setThumbnail(selected);

    const fileReaderInstance = new FileReader();
    fileReaderInstance.readAsDataURL(selected);
    fileReaderInstance.onload = () => {
      const base64data = fileReaderInstance.result;
      setProfilePicture(base64data);
    };
  };

  const handleSave = async () => {
    if (thumbnail) {
      try {
        // upload user thumbnail
        const uploadPath = `thumbnails/${user.uid}/${thumbnail.name}`;
        const img = await projectStorage.ref(uploadPath).put(thumbnail);
        const imgUrl = await img.ref.getDownloadURL();

        // update user doc
        await projectFirestore.collection("users").doc(user.uid).update({
          photoURL: imgUrl,
          profileNote: newProfileNote,
          backgroundURL: bgPhotos[bgIndex],
        });
      } catch (error) {
        setUploadError(error);
      }
    } else {
      try {
        await projectFirestore.collection("users").doc(user.uid).update({
          profileNote: newProfileNote,
          backgroundURL: bgPhotos[bgIndex],
        });
      } catch (error) {
        setUploadError(error);
      }
    }
    navigate("/profile/" + user.uid);
  };

  return (
    <div>
      {!error && user.uid === id && (
        <div className="settings-wrapper">
          <Flex width="100vw" height="5vh" justify="center" align="center">
            <Heading>Settings</Heading>
          </Flex>
          <Flex direction="column" jusitfy="center">
            <Text>profile note:</Text>
            <Textarea
              width="35vw"
              minWidth="300px"
              defaultValue={profileNote}
              onChange={(e) => {
                setNewProfileNote(e.target.value);
              }}
              spellCheck={false}
              maxLength="100"
              name="profile note"
            />
          </Flex>
          <Flex align="center" gap="10px">
            <Button
              color="black"
              bgColor="#ffcc5c"
              _hover={{ bgColor: "#ffb61a" }}
              onClick={handleLeftClick}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>
            <Box>
              <Text>background photo:</Text>
              <Image
                width="35vw"
                borderRadius="5px"
                minWidth="225px"
                height="22.5vh"
                src={bgPhotos[bgIndex]}
              />
            </Box>
            <Button
              color="black"
              bgColor="#ffcc5c"
              _hover={{ bgColor: "#ffb61a" }}
              onClick={handleRightClick}
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          </Flex>
          <Flex>
            <Text>profile picture:</Text>
          </Flex>
          <Flex>
            <Tooltip hasArrow aria-label="A tooltip" label="Hey! Click me!">
              <Image
                cursor="pointer"
                mt={-7}
                alt="profile avatar"
                src={profilePicture}
                onClick={() => {
                  fileSelector.current.click();
                }}
                minWidth="100px"
                minHeight="100px"
                borderRadius="full"
                width="15vw"
                height="15vw"
              />
            </Tooltip>
            {thumbnailError && <Text>Could not change picture</Text>}
            <input
              style={{ display: "none" }}
              type="file"
              ref={fileSelector}
              onChange={handleFileChange}
            />
          </Flex>
          <Flex>
            <Button
              mb={10}
              _hover={{ bgColor: "#ffb61a" }}
              onClick={handleSave}
              bgColor="#ffcc5c"
              color="white"
            >
              Save changes
            </Button>
          </Flex>
        </div>
      )}

      {!error && user.uid !== id && (
        <Flex width="100vw" height="100vh" justify="center" align="center">
          <Heading>You cannot edit someones profile ;)</Heading>
        </Flex>
      )}

      {error && (
        <Flex width="100vw" height="100vh" justify="center" align="center">
          <Heading>{error}</Heading>
        </Flex>
      )}

      {uploadError && (
        <Flex width="100vw" height="100vh" justify="center" align="center">
          <Heading>Failed to save profile :(</Heading>
        </Flex>
      )}
      <Flex height="20vh" direction="column" justify="end">
        <Footer />
      </Flex>
    </div>
  );
}
