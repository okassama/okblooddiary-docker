
import { db } from './firebase';
import { 
    collection, 
    doc, 
    setDoc, 
    deleteDoc, 
    onSnapshot, 
    query, 
    orderBy, 
    writeBatch,
    getDocs
} from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { Reading, UserProfile } from '../types';
import * as idbService from './dbService';

// --- Service Functions ---

export const saveUserProfile = async (uid: string, profile: Omit<UserProfile, 'id' | 'password'>) => {
    if (!db) {
        // Fallback for local mode if called incorrectly - should not happen in normal flow
        return idbService.saveUserProfile({ ...profile, id: parseInt(uid, 10) });
    }
    const profileRef = doc(db, 'users', uid);
    // Store profile data inside a 'profile' field
    await setDoc(profileRef, { profile }, { merge: true });
};

export const addReading = async (uid: string, readingData: Omit<Reading, 'id' | 'userId'>) => {
    if (!db) {
        return idbService.addReading(parseInt(uid, 10), readingData);
    }
    const newId = Date.now();
    const readingRef = doc(db, 'users', uid, 'readings', String(newId));
    // Save the full reading object, including a consistent userId (the string uid)
    await setDoc(readingRef, { ...readingData, id: newId, userId: uid });
};

export const deleteReading = async (uid:string, readingId: number) => {
    if (!db) {
        return idbService.deleteReading(readingId);
    }
    const readingRef = doc(db, 'users', uid, 'readings', String(readingId));
    await deleteDoc(readingRef);
};

export const deleteAllReadings = async (uid: string) => {
    if (!db) {
        return idbService.deleteAllReadings(parseInt(uid, 10));
    }
    const readingsColRef = collection(db, 'users', uid, 'readings');
    const snapshot = await getDocs(readingsColRef);
    if (snapshot.empty) return;
    
    const batch = writeBatch(db);
    snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
    });
    await batch.commit();
};

export const deleteUser = async (uid: string) => {
    if (!db) return;
    await deleteAllReadings(uid);
    const userRef = doc(db, 'users', uid);
    await deleteDoc(userRef);
};


// Custom Hook for real-time data from Firestore
export const useUserData = (uid?: string) => {
    const [readings, setReadings] = useState<Reading[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db || !uid) {
            setLoading(false);
            return;
        }

        setLoading(true);

        const profileRef = doc(db, 'users', uid);
        const unsubscribeProfile = onSnapshot(profileRef, (docSnap) => {
            if (docSnap.exists() && docSnap.data().profile) {
                const profileData = docSnap.data().profile;
                // Shape the data to match the UserProfile interface, using uid as the id
                setUserProfile({ ...profileData, id: uid });
            } else {
                setUserProfile(null);
            }
        }, (error) => {
            console.error("Error fetching profile:", error);
            setUserProfile(null);
        });

        const readingsColRef = collection(db, 'users', uid, 'readings');
        const q = query(readingsColRef, orderBy('date', 'desc'), orderBy('timeOfDay', 'desc'), orderBy('readingNumber', 'desc'));
        
        const unsubscribeReadings = onSnapshot(q, (snapshot) => {
            const fetchedReadings = snapshot.docs.map(doc => doc.data() as Reading);
            setReadings(fetchedReadings);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching readings:", error);
            setReadings([]);
            setLoading(false);
        });

        return () => {
            unsubscribeProfile();
            unsubscribeReadings();
        };

    }, [uid]);

    return { readings, userProfile, loading };
};
