// imports
import { useState, useRef } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Resizer from "react-image-file-resizer";
import { projectFirestore, projectStorage } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import uuid from "react-uuid";

// chakra ui
import {
  Heading,
  Input,
  Textarea,
  Button,
  Text,
  Select,
  Tooltip,
  Flex,
} from "@chakra-ui/react";

// styles
import "./Create.css";

export default function Create() {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectThumbnail, setProjectThumbnail] = useState(
    "https://content.hostgator.com/img/weebly_image_sample.png"
  );
  const [category, setCategory] = useState("Plant");
  const [steps, setSteps] = useState([
    {
      photoSrc: "https://content.hostgator.com/img/weebly_image_sample.png",
      stepDescription: "",
      id: uuid(),
      thumbnailFile: null,
    },
  ]);
  const [difficulty, setDifficulty] = useState("Beginner");
  const [thumbnailError, setThumbnailError] = useState(null);
  const [uploadError, setUploadError] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [progress, setProgress] = useState(0);

  const selectFile = useRef();
  const select = useRef();

  const handleNewStep = () => {
    setSteps((prevSteps) => [
      ...prevSteps,
      {
        photoSrc: "https://content.hostgator.com/img/weebly_image_sample.png",
        stepDescription: "",
        id: uuid(),
        thumbnailFile: null,
      },
    ]);
  };

  const handleRemoveStep = (id) => {
    setSteps((prevSteps) => prevSteps.filter((step) => step.id !== id));
  };

  const handleUpdateStepThumbnail = async (value, id) => {
    value = value.target.files[0];

    if (!value) {
      return;
    }

    if (!value.type.includes("image")) {
      return;
    }

    const selected = await resizeFile(value);

    if (selected.size > 1000000) {
      console.log("image file must be less than 1000kb");
      return;
    }

    const fileReaderInstance = new FileReader();
    fileReaderInstance.readAsDataURL(selected);
    fileReaderInstance.onload = () => {
      const base64data = fileReaderInstance.result;

      setSteps((prevSteps) =>
        prevSteps.map((s) => {
          if (s.id === id) {
            return { ...s, photoSrc: base64data, thumbnailFile: selected };
          } else {
            return s;
          }
        })
      );
    };
  };

  const handleUpdateStepDescription = (value, id) => {
    setSteps((prevSteps) =>
      prevSteps.map((s) => {
        if (s.id === id) {
          return { ...s, stepDescription: value };
        } else {
          return s;
        }
      })
    );
  };

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        700,
        700,
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
    const savedImg = projectThumbnail;
    setProjectThumbnail(null);
    const file = e.target.files[0];

    if (!file) {
      setThumbnailError("Please select a file");
      setProjectThumbnail(savedImg);
      return;
    }

    if (!file.type.includes("image")) {
      setThumbnailError("Selected file must be an image");
      setProjectThumbnail(savedImg);
      return;
    }

    const selected = await resizeFile(file);

    if (selected.size > 1000000) {
      setThumbnailError("Image file size must be less than 1000kb");
      setProjectThumbnail(savedImg);
      return;
    }

    setThumbnailError(null);
    const fileReaderInstance = new FileReader();
    fileReaderInstance.readAsDataURL(selected);
    fileReaderInstance.onload = () => {
      const base64data = fileReaderInstance.result;
      setProjectThumbnail(base64data);
    };
  };

  const handlePublish = async () => {
    setUploadError(false);

    const comments = [];
    const favList = [];
    const starsList = [];

    const tmstamp = new Date().getTime();

    if (
      projectTitle &&
      projectDescription &&
      projectThumbnail &&
      steps.every((step) => step.stepDescription)
    ) {
      setIsPending(true);

      for (let i = 0; i < steps.length; i++) {
        try {
          if (
            steps[i].photoSrc ===
            "https://content.hostgator.com/img/weebly_image_sample.png"
          ) {
            continue;
          }

          // upload step thumbnail
          const uploadPath = `projects/${user.uid}/${projectTitle}_${tmstamp}/${steps[i].id}_${i}`;
          const img = await projectStorage
            .ref(uploadPath)
            .put(steps[i].thumbnailFile);
          const imgUrl = await img.ref.getDownloadURL();

          steps[i].photoSrc = imgUrl;
          delete steps[i].thumbnailFile;
          setProgress(i / steps.length);
        } catch (error) {
          console.log(error);
        }
      }

      const project = {
        title: projectTitle,
        description: projectDescription,
        thumbnail: projectThumbnail,
        authorDisplayName: user.displayName,
        authorUid: user.uid,
        createdAt: new Date(),
        timestamp: new Date().getTime(),
        steps,
        difficulty,
        comments,
        favList,
        starsList,
        category,
      };

      try {
        await projectFirestore
          .collection("projects")
          .doc()
          .set({ ...project });
        navigate("/projects");
      } catch (err) {
        setUploadError(err);
      }
    } else {
      setUploadError(
        "You are missing either the title, description or some step description."
      );
    }

    setIsPending(false);
  };

  const handleBorderColor = () => {
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
    <div className="create-wrapper">
      <Heading>Project Editor</Heading>
      <Text>title:</Text>
      <Input
        type="text"
        value={projectTitle}
        onChange={(e) => setProjectTitle(e.target.value)}
        maxLength="25"
      />

      <Text>description:</Text>
      <Textarea
        rows="4"
        type="text"
        id="desc"
        value={projectDescription}
        onChange={(e) => setProjectDescription(e.target.value)}
        maxLength="200"
      />

      <Text>thumbnail (recommended size: 1920 x 1080): </Text>
      <Tooltip
        aria-label="A tooltip"
        label="Hey! Click me!"
        hasArrow
        placement="right"
      >
        <img
          alt="project thumbnail"
          className="create-thumbnail"
          src={projectThumbnail}
          onClick={() => {
            selectFile.current.click();
          }}
        />
      </Tooltip>
      <Text>category: </Text>
      <Select
        width="50%"
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
        }}
      >
        <option value="Plant">Plant</option>
        <option value="Animal">Animal</option>
        <option value="Decoration">Decoration</option>
        <option value="Toy">Toy</option>
        <option value="Transport">Transport</option>
        <option value="Other">Other</option>
      </Select>
      <Text>difficulty: </Text>
      <Select
        ref={select}
        width="50%"
        value={difficulty}
        onChange={(e) => {
          setDifficulty(e.target.value);
        }}
        borderColor={handleBorderColor}
      >
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
        <option value="Master">Master</option>
      </Select>

      <Input
        type="file"
        ref={selectFile}
        style={{ display: "none", border: "1px solid #555", maxWidth: "25vw" }}
        onChange={(e) => handleFileChange(e)}
      />
      {thumbnailError && <Text fontSize="1.1em">{thumbnailError}</Text>}

      {steps.map((step, index) => (
        <div className="project-step" key={step.id}>
          <Heading>Step {index + 1}</Heading>
          {index !== 0 && (
            <div className="project-step-trash">
              <FontAwesomeIcon
                icon={faTrashCan}
                onClick={() => {
                  handleRemoveStep(step.id);
                }}
              />
            </div>
          )}
          <Tooltip
            placement="right"
            aria-label="A tool tip"
            hasArrow
            label="Hey! Click me!"
          >
            <img
              className="create-thumbnail"
              src={step.photoSrc}
              onClick={() => {
                document.querySelector("#file" + step.id).click();
              }}
              alt="step thumbnail"
            />
          </Tooltip>
          <Input
            id={"file" + step.id}
            type="file"
            style={{
              border: "1px solid #555",
              maxWidth: "25vw",
              display: "none",
            }}
            defaultValue={step.stepThumbnail}
            onChange={(e) => {
              handleUpdateStepThumbnail(e, step.id);
            }}
          />
          <Input
            type="text"
            defaultValue={step.stepDescription}
            onChange={(e) =>
              handleUpdateStepDescription(e.target.value, step.id)
            }
            placeholder="step description"
            maxLength="150"
          />
        </div>
      ))}

      <div className="create-menu">
        {!isPending && (
          <Button
            color="white"
            bgColor="#ffcc5c"
            _hover={{ bgColor: "#ffb61a" }}
            onClick={handleNewStep}
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        )}

        {isPending && (
          <Button
            color="white"
            bgColor="#ffcc5c"
            _hover={{ bgColor: "#ffb61a" }}
            onClick={handleNewStep}
            isDisabled
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        )}

        {!isPending && (
          <Button
            onClick={handlePublish}
            color="white"
            _hover={{ bgColor: "#ffb61a" }}
            bgColor="#ffcc5c"
          >
            Publish Project
          </Button>
        )}

        {isPending && (
          <Flex gap={5} align="center">
            <Button
              isDisabled
              color="white"
              _hover={{ bgColor: "#ffb61a" }}
              bgColor="#ffcc5c"
            >
              Uploading project..
            </Button>
            <Text>%{Math.round(progress * 100)}</Text>
          </Flex>
        )}
      </div>

      {uploadError && (
        <Text mb={5} mt={-5}>
          {uploadError}
        </Text>
      )}
    </div>
  );
}
