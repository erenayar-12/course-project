import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth } from './firebaseConfig';

const db = getFirestore();

export async function getUserRole(uid: string): Promise<'admin' | 'user'> {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (userDoc.exists()) {
    return userDoc.data().role || 'user';
  }
  return 'user';
}

export async function setUserRole(uid: string, role: 'admin' | 'user') {
  await setDoc(doc(db, 'users', uid), { role }, { merge: true });
}
