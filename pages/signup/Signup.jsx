// imports
import { useState, useRef } from "react";
import { useSignup } from "../../hooks/useSignup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Resizer from "react-image-file-resizer";

// components
import Footer from '../../components/Footer';

// chakra ui
import {
  Button,
  Flex,
  Heading,
  Input,
  Text,
  FormControl,
  InputRightElement,
  InputGroup,
} from "@chakra-ui/react";

// styles
import "./Signup.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(null);
  const [passwordShown, setPasswordShown] = useState(false);
  const [thumbnailName, setThumbnailName] = useState("");
  const { signup, isPending, error } = useSignup();

  const fileInput = useRef();

  const togglePassword = () => {
    setPasswordShown((currentShown) => !currentShown);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if ((email, password, displayName, thumbnail)) {
      signup(email, password, displayName, thumbnail);
    } else {
      setThumbnailError("You are missing something ;)");
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

    if (selected.size > 1000000) {
      setThumbnailError("Image file size must be less than 1000kb");
      return;
    }

    setThumbnailError(null);
    setThumbnail(selected);
    setThumbnailName(file.name);
  };

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <FormControl>
          <Flex
            height="100vh"
            width="100vw"
            alignItems="center"
            justifyContent="center"
          >
            <Flex direction="column" background="gray.100" p={20} rounded={6}>
              <Flex justifyContent="center">
                <Heading mb={6}>Sign up</Heading>
              </Flex>
              <Input
                isRequired
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength="100"
                name="email"
                placeholder="jan.kowalski@gmail.com"
                variant="filled"
                mb={3}
                type="email"
                id='email'
              />
              <Input
                isRequired
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength="100"
                name="nick"
                placeholder="jan_koxu123pl"
                variant="filled"
                mb={3}
                type="text"
                id='nick'
              />
              {!thumbnail && (
                <Button
                  mb={3}
                  _hover={{ bgColor: "#222" }}
                  color="white"
                  bgColor="#555"
                  onClick={() => {
                    fileInput.current.click();
                  }}
                >
                  Select thumbnail
                </Button>
              )}
              {thumbnail && (
                <Button
                  mb={3}
                  _hover={{ bgColor: "#222" }}
                  color="white"
                  bgColor="#555"
                  onClick={() => {
                    fileInput.current.click();
                  }}
                >
                  Selected: {thumbnailName}
                </Button>
              )}
              <Input
                type="file"
                onChange={(e) => handleFileChange(e)}
                style={{ display: "none" }}
                ref={fileInput}
                name="thumbnail"
                id='thumbnail'
              />
              <InputGroup>
                <Input
                  isRequired
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  maxLength="100"
                  name="password"
                  placeholder="***********"
                  variant="filled"
                  mb={3}
                  type={passwordShown ? "text" : "password"}
                  id='password'
                />

                <InputRightElement>
                  {passwordShown && (
                    <FontAwesomeIcon
                      icon={faEye}
                      onClick={togglePassword}
                      style={{ cursor: "pointer", color: "#555" }}
                    />
                  )}
                  {!passwordShown && (
                    <FontAwesomeIcon
                      icon={faEyeSlash}
                      onClick={togglePassword}
                      style={{ cursor: "pointer", color: "#555" }}
                    />
                  )}
                </InputRightElement>
              </InputGroup>

              {!isPending && (
                <Button color="white" bgColor="#ffcc5c" type="submit">
                  Sign up
                </Button>
              )}

              {isPending && (
                <Button
                  isDisabled
                  color="white"
                  bgColor="#ffcc5c"
                  type="submit"
                >
                  Sign up
                </Button>
              )}

              {error && <Text mt={5}>{error}</Text>}
              {thumbnailError && <Text mt={5}>{thumbnailError}</Text>}
            </Flex>
          </Flex>
        </FormControl>
      </form>
      <Footer />
    </section>
  );
}
