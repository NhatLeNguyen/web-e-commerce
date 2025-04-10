import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

export const syncUserToFirestore = async () => {
  try {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const { _id, role, fullName, email, avatar } = userData;

    if (_id) {
      await setDoc(
        doc(db, "users", _id),
        {
          uid: _id,
          role: role || "guest",
          fullName: fullName || "Guest " + _id,
          email: email || "",
          avatar: avatar || "",
        },
        { merge: true }
      );
      console.log("User synced to Firestore:", _id);
    } else {
      console.error("No user ID found in localStorage");
    }
  } catch (error) {
    console.error("Error syncing user to Firestore:", error);
  }
};
