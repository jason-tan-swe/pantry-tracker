import { firestore } from './';
import { doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, increment, collection } from 'firebase/firestore';

const USERS_COLLECTION = 'users';

export const addOrIncrementItem = async (userEmail, itemName) => {
  const userPantryRef = doc(firestore, USERS_COLLECTION, userEmail, 'pantry', itemName);
  const itemDoc = await getDoc(userPantryRef);

  if (itemDoc.exists()) {
    await updateDoc(userPantryRef, {
      quantity: increment(1)
    });
  } else {
    await setDoc(userPantryRef, {
      name: itemName,
      quantity: 1
    });
  }
};

export const removeOrDecrementItem = async (userEmail, itemName) => {
  const userPantryRef = doc(firestore, USERS_COLLECTION, userEmail, 'pantry', itemName);
  const itemDoc = await getDoc(userPantryRef);

  if (itemDoc.exists()) {
    const currentQuantity = itemDoc.data().quantity;
    if (currentQuantity > 1) {
      await updateDoc(userPantryRef, {
        quantity: increment(-1)
      });
    } else {
      await deleteDoc(userPantryRef);
    }
  }
};

export const getItem = async (userEmail, itemName) => {
  const userPantryRef = doc(firestore, USERS_COLLECTION, userEmail, 'pantry', itemName);
  const itemDoc = await getDoc(userPantryRef);
  return itemDoc.exists() ? itemDoc.data() : null;
};

export const getAllItems = async (userEmail) => {
  const userPantryRef = collection(firestore, USERS_COLLECTION, userEmail, 'pantry');
  const querySnapshot = await getDocs(userPantryRef);
  return querySnapshot.docs.map(doc => doc.data());
};