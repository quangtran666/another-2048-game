import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User, signOut } from "firebase/auth";
import { collection, doc, getDoc, getDocs, getFirestore, limit, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
const auth = getAuth(app);

export const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        await new Promise(resolve => setTimeout(resolve, 100));
        return result.user;
    } catch (error) {
        console.error("Error signing in with Google: ", error);
        throw error;
    }
}

export const getCurrentUser = (): Promise<User | null> =>  {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        })
    })
}

export const signOutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out: ", error);
        throw error;
    }
}

export const db = getFirestore(app);

export const saveBestScore = async (userId: string, userName: string, score: number) => {
    try {
        await setDoc(doc(db, 'scores', userId), {
            bestScore: score,
            userName,
            updatedAt: new Date().toISOString()
        })
    } catch (error) {
        console.error("Error saving best score:", error);
        throw error;
    } 
}

export const getBestScore = async (userId: string): Promise<number> => {
    try {
        const docRef = doc(db, "scores", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data().bestScore;
        }

        return 0;
    } catch (error) {
        console.error("Error getting best score:", error);
        return 0;
    }
}

export interface TopScore {
    userId: string;
    userName: string;
    bestScore: number;
    updatedAt: string;
}

export const getTopScores = async (limitCount: number = 10): Promise<TopScore[]> => {
    try {
        const scoresRef = collection(db, "scores");
        const q = query(scoresRef, orderBy("bestScore", "desc"), limit(limitCount));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            userId: doc.id,
            ...doc.data()
        } as TopScore)) 
    } catch (error) {
        console.error("Error getting top scores:", error);
        return [];
    }
} 

export const subscribeToTopScores = (limitCount: number = 10, onUpdate: (scores: TopScore[]) => void) => {
    const scoresRef = collection(db, "scores");
    const q = query(scoresRef, orderBy("bestScore", "desc"), limit(limitCount));

    return onSnapshot(q, (snapshot) => {
        const scores = snapshot.docs.map(doc => ({
            userId: doc.id,
            ...doc.data()
        } as TopScore));
        onUpdate(scores);
    }, (error) => {
        console.error("Error listening to top scores: ", error);
    });
}