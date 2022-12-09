// imports
import { useState, useEffect } from "react";
import {
  projectAuth,
  projectStorage,
  projectFirestore,
} from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (email, password, displayName, thumbnail) => {
    setError(null);
    setIsPending(true);

    try {
      // signup
      const res = await projectAuth.createUserWithEmailAndPassword(
        email,
        password
      );

      if (!res) {
        throw new Error("Could not complete signup");
      }

      // upload user thumbnail
      const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`;
      const img = await projectStorage.ref(uploadPath).put(thumbnail);
      const imgUrl = await img.ref.getDownloadURL();

      // profile likes
      const profileLikes = [];

      // add display name to user
      await res.user.updateProfile({ displayName, photoURL: imgUrl });

      // random background-photos array
      const bgPhotos = [
        "https://cdn.pixabay.com/photo/2016/08/27/00/30/banner-1623469_960_720.jpg",
        "https://cdn.pixabay.com/photo/2017/10/07/23/16/origami-2828268_960_720.jpg",
        "https://cdn.pixabay.com/photo/2018/02/16/03/23/blue-3156843_960_720.jpg",
        "https://cdn.pixabay.com/photo/2012/09/28/20/46/book-58446_960_720.jpg",
        "https://cdn.pixabay.com/photo/2017/08/30/01/05/milky-way-2695569_960_720.jpg",
        "https://cdn.pixabay.com/photo/2016/05/24/16/48/mountains-1412683_960_720.png",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Flag_of_Poland_%28normative%29.svg/250px-Flag_of_Poland_%28normative%29.svg.png",
        "https://www.meme-arsenal.com/memes/0b1c5a76c2636396770461857d068a89.jpg",
        "https://s1.static.esor.pzkosz.pl/internalfiles/image/zawodnicy/s24/9092/165-165/66129.jpg",
      ];

      const bgPhotoURL = bgPhotos[Math.floor(Math.random() * bgPhotos.length)];

      // create a user document
      await projectFirestore.collection("users").doc(res.user.uid).set({
        online: true,
        displayName,
        photoURL: imgUrl,
        profileNote: "hey! how are you today?",
        profileLikes,
        backgroundURL: bgPhotoURL,
      });

      // dispatch login action
      dispatch({ type: "LOGIN", payload: res.user });

      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      if (!isCancelled) {
        setError(err.message);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { signup, error, isPending };
};
