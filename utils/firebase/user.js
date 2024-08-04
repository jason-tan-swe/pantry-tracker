import { firestore } from './';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const USERS_COLLECTION = 'users';

export const createOrUpdateUser = async (user) => {
  const userRef = doc(firestore, USERS_COLLECTION, user.email);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    // Create new user
    await setDoc(userRef, {
      name: user.name,
      email: user.email,
      pantryItems: []
    });
  } else {
    // Update existing user
    await setDoc(userRef, {
      name: user.name,
      email: user.email
    }, { merge: true });
  }
};

export const getUserData = async (userEmail) => {
  const userRef = doc(firestore, USERS_COLLECTION, userEmail);
  const userDoc = await getDoc(userRef);
  return userDoc.exists() ? userDoc.data() : null;
};
