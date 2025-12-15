import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  getDocs,
  collection,
  getFirestore,
} from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyAw7xuk6dP1aVAb-dHnu1R__wqMAB_lbS4",
  authDomain: "netflix-81706.firebaseapp.com",
  projectId: "netflix-81706",
  storageBucket: "netflix-81706.firebasestorage.app",
  messagingSenderId: "1074985560098",
  appId: "1:1074985560098:web:325eec185d7a48fadd027b",
  measurementId: "G-71FEK1W7PB",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ---------------- AUTH ---------------- */

const signup = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    // ✅ store user doc by UID (much easier than addDoc random ID)
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
      createdAt: Date.now(),
    });
  } catch (error) {
    console.log(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.log(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

const logout = () => {
  signOut(auth);
};

/* ---------------- MY LIST (FIRESTORE) ---------------- */
/*
  We store items here:
  users/{uid}/myList/{itemId}

  item example:
  {
    id: 123,
    type: "movie" | "tv",
    title: "Some Title",
    backdrop_path: "...",
    poster_path: "...",
    addedAt: 123456789
  }
*/

const addToMyList = async (item) => {
  const user = auth.currentUser;
  if (!user) {
    toast.error("Please log in first.");
    return;
  }

  try {
    const ref = doc(db, "users", user.uid, "myList", String(item.id));
    await setDoc(ref, { ...item, addedAt: Date.now() });
    toast.success("Added to My List");
  } catch (err) {
    console.log(err);
    toast.error("Could not add to My List");
  }
};

const removeFromMyList = async (id) => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const ref = doc(db, "users", user.uid, "myList", String(id));
    await deleteDoc(ref);
    toast.info("Removed from My List");
  } catch (err) {
    console.log(err);
    toast.error("Could not remove from My List");
  }
};

const isInMyList = async (id) => {
  const user = auth.currentUser;
  if (!user) return false;

  const ref = doc(db, "users", user.uid, "myList", String(id));
  const snap = await getDoc(ref);
  return snap.exists();
};

const getMyList = async () => {
  const user = auth.currentUser;
  if (!user) return [];

  const snap = await getDocs(collection(db, "users", user.uid, "myList"));
  return snap.docs.map((d) => d.data());
};

export {
  auth,
  db,
  signup,
  login,
  logout,
  addToMyList,
  removeFromMyList,
  isInMyList,
  getMyList,
};
