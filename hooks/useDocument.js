// imports
import { useEffect, useState } from "react";
import { projectFirestore } from "../firebase/config";

const useDocument = (collection, id) => {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(null);

  // realtime document data
  useEffect(() => {
    setIsPending(true);
    const ref = projectFirestore.collection(collection).doc(id);

    const unsubscribe = ref.onSnapshot(
      (snapshot) => {
        // need to make sure the doc exists & has data
        if (snapshot.data()) {
          setDocument({ ...snapshot.data(), id: snapshot.id });
          setError(null);
          setIsPending(false);
        } else {
          setError("No such document exists");
          setIsPending(false);
        }
      },
      (err) => {
        console.log(err.message);
        setError("failed to get document");
      }
    );

    // unsubscribe on unmount
    return () => unsubscribe();
  }, [collection, id]);

  return { document, error, isPending };
};

export default useDocument;
