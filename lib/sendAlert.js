import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "../Firebase";
import useAuth from "../hooks/useAuth";


export default sendAlert = async (alertType, title, message, relevantInfo, userId) => {

  await addDoc(collection(db, 'users', userId, 'alerts'), {
    timestamp: serverTimestamp(),
    alertType,
    title,
    message,
    isViewed: false,
    relevantInfo,
  })

}