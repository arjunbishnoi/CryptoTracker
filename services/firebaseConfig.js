import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA_QS9SQRy0_lBg60NiLmTn4rK_StGWd64",
  authDomain: "arjun-crypto.firebaseapp.com",
  projectId: "arjun-crypto",
  storageBucket: "arjun-crypto.appspot.com",
  messagingSenderId: "1057068930229",
  appId: "1:1057068930229:web:2ba22755a53d5d5954dafc",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const favoritesCollection = collection(db, "favorites");

export async function addFavorite(crypto) {
  const ref = await addDoc(favoritesCollection, crypto);
  return ref.id;
}

export async function getFavorites() {
  const snapshot = await getDocs(favoritesCollection);
  return snapshot.docs.map((doc) => ({ docId: doc.id, ...doc.data() }));
}

export async function removeFavorite(docId) {
  await deleteDoc(doc(db, "favorites", docId));
}
