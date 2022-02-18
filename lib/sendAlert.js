import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "../Firebase"

export default sendAlert = async (alertType, message, relevantInfo, userId) => {

  await addDoc(collection(db, 'users', userId, 'alerts'), {
    timestamp: serverTimestamp(),
    alertType,
    message,
    isViewed: false,
    relevantInfo,
  })
}