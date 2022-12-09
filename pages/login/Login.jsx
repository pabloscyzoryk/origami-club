// imports
import { useState } from "react";
import { useLogin } from "../../hooks/useLogin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

// chakra ui
import {
  Button,
  Flex,
  Text,
  Heading,
  Input,
  FormControl,
  InputRightElement,
  InputGroup,
} from "@chakra-ui/react";

// components
import Footer from "../../components/Footer";

// styles
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isPending, error } = useLogin();
  const [passwordShown, setPasswordShown] = useState(false);

  const togglePassword = () => {
    setPasswordShown((currentShown) => !currentShown);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    login(email, password);
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
                <Heading mb={6}>Log in</Heading>
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
                id="email"
                type="email"
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
                  id="password"
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
                <Button
                  color="white"
                  bgColor="#ffcc5c"
                  type="submit"
                  _hover={{ bgColor: "#ffb61a" }}
                >
                  Log in
                </Button>
              )}

              {isPending && (
                <Button
                  isDisabled
                  color="white"
                  bgColor="#ffcc5c"
                  type="submit"
                  _hover={{ bgColor: "#ffb61a" }}
                >
                  Log in
                </Button>
              )}
              {error && <Text mt={5}>{error}</Text>}
            </Flex>
          </Flex>
        </FormControl>
      </form>
      <Footer />
    </section>
  );
}
