import firebase from 'firebase/compat/app';
// eslint-disable-next-line no-undef
import Timestamp = firebase.firestore.Timestamp;

export interface Store {
    id: string,
    name: string,
    userId: string,
    createdAt: Timestamp,
    updatedAt: Timestamp,
}