import { initializeApp } from "firebase/app";
import { 
    createUserWithEmailAndPassword, 
    getAuth, 
    signInWithEmailAndPassword,
    signOut} from "firebase/auth";
import { 
    addDoc, 
    collection, 
    getFirestore } from "firebase/firestore";
import { toast } from "react-toastify";


const firebaseConfig = {
  apiKey: "AIzaSyAw7xuk6dP1aVAb-dHnu1R__wqMAB_lbS4",
  authDomain: "netflix-81706.firebaseapp.com",
  projectId: "netflix-81706",
  storageBucket: "netflix-81706.firebasestorage.app",
  messagingSenderId: "1074985560098",
  appId: "1:1074985560098:web:325eec185d7a48fadd027b",
  measurementId: "G-71FEK1W7PB"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (name, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await addDoc(collection (db, "users"), {
            uid: user.uid,
            name,
            authProvider: "local",
            email,
        });
    } catch (error) {
        console.log(error);
        toast.error(error.code.split('/')[1].split('-').join(' '));
    }
}

const login = async (email, password) => {
    try {
        signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.log(error);
        toast.error(error.code.split('/')[1].split('-').join(' '));
    }
}
const logout = () => {
    signOut(auth);
}

export { auth, signup , login , logout , db };