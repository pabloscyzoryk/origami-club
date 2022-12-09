// imports
import { useState, useRef, useEffect, useCallback } from "react";
import Tilt from "react-parallax-tilt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import emailjs from "@emailjs/browser";
import MediaQuery from "react-responsive";
import useOnScreen from "../../hooks/useOnScreen";

// chakra ui
import {
  Button,
  Flex,
  Heading,
  Input,
  Textarea,
  FormControl,
} from "@chakra-ui/react";

// components
import Card from "./Card";
import Quote from "./Quote";
import UnderlineH2 from "./UnderlineH2";
import Footer from "../../components/Footer";

//imgs
import Ship from "../../assets/img/ship.png";

// styles
import "./Home.css";

export default function Home() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");

  
  // refs
  const usersRef = useRef();
  const projectsRef = useRef();
  const heroImg = useRef();
  const showMoreBtn = useRef();
  const howToStart = useRef();
  const form = useRef();
  const quotesRef = useRef();
  const showMoreBtnIsShown = useRef(false);
  const waitingTime = useRef(3500);
  
  const isVisible = useOnScreen(quotesRef);
  
  const sendEmail = () => {
    emailjs
      .sendForm(
        "service_uh7009n",
        "template_is9fp5x",
        form.current,
        "kMF5ZE-zlEw3XVMm9"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendEmail();

    setEmail("");
    setName("");
    setMessage("");
  };


  useEffect(() => {
    let timer = setTimeout(() => {
      showMoreBtn.current.style.top = "90%";
      showMoreBtnIsShown.current = true;
    }, waitingTime.current);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleScroll = useCallback(() => {
      if (!showMoreBtnIsShown) {
        showMoreBtn.current.style.display = "none";
      } else {
        showMoreBtn.current.style.top = "110%";
      }
  
      if (window.scrollY === 0) {
        waitingTime.current = 8000;
  
        setTimeout(() => {
          showMoreBtn.current.style.top = "90%";
          showMoreBtn.current.style.display = "block";
        }, waitingTime.current);
      }
  
      heroImg.current.style.filter = `blur(${Math.round(window.scrollY / 70)}px)`;
    }, [])
  

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const handleClickScroll = (elementRef) => {
    elementRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [didSeeNumbers, setDidSeeNumbers] = useState(false);

  useEffect(() => {
    if (isVisible && !didSeeNumbers) {
      setDidSeeNumbers(true);
      let usersAmount = 0;
      const usersInterval = setInterval(() => {
        usersAmount++;
        if (usersAmount >= 485) {
          clearInterval(usersInterval);
        } else {
          usersRef.current.innerText = usersAmount;
        }
      }, 0.1);

      let projectsAmount = 0;

      const projectsInterval = setInterval(() => {
        projectsAmount++;
        if (projectsAmount >= 1456) {
          clearInterval(projectsInterval);
        } else {
          projectsRef.current.innerText = projectsAmount;
        }
      }, 0.1);
    }
  }, [isVisible, didSeeNumbers]);

  return (
    <div className="home">
      <section className="hero-wrapper" ref={heroImg}>
        <Tilt scale={1}>
          <div
            className="hero-image"
            style={{ backgroundImage: "url(./assets/img/background.png)" }}
          ></div>
        </Tilt>

        <div className="hero-text">
          <h1>ORIGAMI</h1>
          <p>club</p>
        </div>

        <div
          className="hero-show-more"
          ref={showMoreBtn}
          onClick={() => {
            handleClickScroll(howToStart);
          }}
        >
          <p>
            <FontAwesomeIcon icon={faArrowDown} size="sm" /> Show more
          </p>
        </div>
      </section>

      <section className="back how-to-start" ref={howToStart}>
        <UnderlineH2 prefix="how to " text="start" end="?" />

        <MediaQuery minWidth={500}>
          <img
            className="ship"
            alt="ship"
            style={{ backgroundImage: 'url("./assets/img/ship.png")' }}
            src={Ship}
          />
        </MediaQuery>

        <MediaQuery minWidth={1215}>
          <div className="dots-container">
            <div className="dot" style={{ left: "18%", top: "82%" }}></div>
            <div className="dot" style={{ left: "24%", top: "75%" }}></div>
            <div className="dot" style={{ left: "47.5%", top: "59%" }}></div>
            <div className="dot" style={{ left: "46%", top: "50%" }}></div>
            <div className="dot" style={{ left: "44%", top: "42%" }}></div>
            <div className="dot" style={{ left: "31%", top: "23.5%" }}></div>
            <div className="dot" style={{ left: "36%", top: "20%" }}></div>
            <div className="dot" style={{ left: "41%", top: "17.5%" }}></div>
            <div className="dot" style={{ left: "46%", top: "17%" }}></div>
            <div className="dot" style={{ left: "76%", top: "32.5%" }}></div>
            <div className="dot" style={{ left: "80%", top: "35%" }}></div>
            <div className="dot" style={{ left: "83%", top: "40%" }}></div>
            <div className="dot" style={{ left: "81.5%", top: "49%" }}></div>
            <div className="dot" style={{ left: "77%", top: "54%" }}></div>
          </div>
        </MediaQuery>

        <MediaQuery minWidth={961}>
          <div className="cards-container">
            <Card
              index="1"
              title="Create a new account"
              innerText="Choose your profile picture and nickname. Let others know about you! Sign up today!"
              left="40%"
              top="75%"
            />
            <Card
              index="2"
              title="Your first project"
              innerText="Create your first origami project. Share your ideas by writing step-by-step instructions with photos."
              left="30%"
              top="40%"
            />
            <Card
              index="3"
              title="Make friends"
              innerText="Visit others' projects and write comments. Visit others' profiles and make your own."
              left="62.5%"
              top="32.5%"
            />
            <Card
              index="4"
              title="Develop yourself"
              innerText="Develop your passion with others. Our site is the perfect place for that. From origami fans for origami fans."
              left="75%"
              top="70%"
            />
          </div>
        </MediaQuery>

        <MediaQuery maxWidth={960}>
          <div className="cards-container">
            <Card
              index="1"
              title="Create a new account"
              innerText="Choose your profile picture and nickname. Let others know about you!"
            />
            <Card
              index="2"
              title="Your first project"
              innerText="Create your first origami project. Share your ideas by writing step-by-step instructions with photos."
            />
            <Card
              index="3"
              title="Make friends"
              innerText="Visit others' projects and write comments. Visit others' profiles and make your own cool."
            />
            <Card
              index="4"
              title="Develop yourself"
              innerText="Develop your passion with others. Our site is the perfect place for that. From origami fans for origami fans."
            />
          </div>
        </MediaQuery>
      </section>

      <section className="sm-back quotes">
        <div className="quotes-container" ref={quotesRef}>
          <Quote
            quote="This site is amazing! I finally learned how to make an origami plane. I'm too old for it now, but my little son plays with it all day! Greetings."
            author="Czarneusz Matojan ; Basketball player"
          />
          <Quote
            quote="My wife was arrested for possessing origami weapons. That means they are very realistic."
            author="Jo Mama ; Jo Mama"
          />
          <Quote
            quote="Never gonna give you up Never gonna let you down Never gonna run around and desert you Never gonna make you cry Never gonna say goodbye Never gonna tell a lie and hurt you"
            author="Rick Astley ; Singer"
          />
        </div>
      </section>

      <section
        className="back numbers"
        style={{ height: "40vh", position: "relative" }}
      >
        <div
          className="numbers-wrapper"
          style={{ backgroundImage: "url(./assets/img/numbersbg.png)" }}
        >
          <div>
            <p>Projects: </p>
            <p ref={projectsRef}></p>
          </div>
          <div>
            <p>Users: </p>
            <p ref={usersRef}></p>
          </div>
        </div>
      </section>

      <section className="back2 contact">
        <form onSubmit={handleSubmit} ref={form}>
          <FormControl>
            <Flex
              height="100%"
              alignItems="center"
              justifyContent="center"
              mb={55}
            >
              <Flex direction="column" background="gray.100" p={20} rounded={6}>
                <Flex justifyContent="center">
                  <Heading mb={6}>Contact</Heading>
                </Flex>
                <Input
                  isRequired
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength="100"
                  name="email"
                  placeholder="jan.kowalski@gmail.com"
                  variant="filled"
                  mb={3}
                  type="email"
                />
                <Input
                  isRequired
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength="100"
                  name="name"
                  placeholder="Jan Kowalski"
                  variant="filled"
                  mb={3}
                  type="text"
                />
                <Textarea
                  placeholder="message"
                  resize="none"
                  mb={3}
                  isRequired
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  name="message"
                  maxLength="1500"
                />
                <Button
                  color="white"
                  bgColor="#ffcc5c"
                  type="submit"
                  _hover={{ bgColor: "#ffb61a" }}
                >
                  Send
                </Button>
              </Flex>
            </Flex>
          </FormControl>
        </form>
      </section>
      <section className="small-back">
        <Footer />
      </section>
    </div>
  );
}
