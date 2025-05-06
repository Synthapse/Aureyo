import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'; 
import { PaymentIntentSucceed } from 'pages/StripeSuccess';

export const saveUserSubscription = async (userEmail: string, data: any) => {
    const userRef = doc(db, 'users', userEmail);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
        // Create the user document if it doesn't exist
        await setDoc(userRef, { userEmail: userEmail, subscription: data });
        console.log('Created new user document with subscription.');
    } else {
        // Update existing document
        await updateDoc(userRef, { userEmail: userEmail, subscription: data });
        console.log('Updated existing user subscription.');
    }

    // Fetch and return updated data
    const updatedDoc = await getDoc(userRef);
    const userData = updatedDoc.data();
    console.log('User data:', userData);
    return userData;
};


export const getUserPointsFromSubscription = async (userEmail: string) => {
    const userRef = doc(db, 'users', userEmail);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData?.subscription?.quantity || 0; // Return points or 0 if not found
    } else {
        console.log('No such document!');
        return 0;
    }
}

export const removePointsFromSubscription = async (userEmail: string, points: number) => {
    const userRef = doc(db, 'users', userEmail);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
        const userData = userDoc.data();
        const currentPoints = userData?.subscription?.quantity || 0;

        if (currentPoints >= points) {
            await updateDoc(userRef, {
                subscription: {
                    ...userData.subscription,
                    quantity: currentPoints - points
                }
            });
            console.log('Points deducted successfully.');
        } else {
            console.log('Not enough points to deduct.');
        }
    } else {
        console.log('No such document!');
    }
}
