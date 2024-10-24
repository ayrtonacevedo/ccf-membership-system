import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { db, storage } from "../firebaseConfig/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

//ACTIONS TYPES
export const FETCH_MEMBERS_START = "FETCH_MEMBERS_START";
export const FETCH_MEMBERS_SUCCESS = "FETCH_MEMBERS_SUCCESS";
export const FETCH_MEMBERS_FAILURE = "FETCH_MEMBERS_FAILURE";
//DeleteMember
export const DELETE_MEMBER_SUCCESS = "DELETE_MEMBER_SUCCESS";
export const DELETE_MEMBER_FAILURE = "DELETE_MEMBER_FAILURE";
//AddMember
export const ADD_MEMBER_SUCCESS = "ADD_MEMBER_SUCCESS";
export const ADD_MEMBER_FAILURE = "ADD_MEMBER_FAILURE";
//AddImg
export const UPLOAD_IMAGE_SUCCESS = "UPLOAD_IMAGE_SUCCESS";
export const UPLOAD_IMAGE_FAILURE = "UPLOAD_IMAGE_FAILURE";
//Clear imgUrl
export const CLEAR_IMAGE_URL = "CLEAR_IMAGE_URL";

//GET MEMBERS
export const fetchMembers = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_MEMBERS_START });
    try {
      const membersCollection = collection(db, "socios");
      const orderedQuery = query(membersCollection, orderBy("name"));
      const data = await getDocs(orderedQuery);
      const members = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      dispatch({
        type: FETCH_MEMBERS_SUCCESS,
        payload: members,
      });
    } catch (error) {
      dispatch({
        type: FETCH_MEMBERS_FAILURE,
        payload: error.message,
      });
    }
  };
};
// DELETE MEMBER
export const deleteMember = (id) => {
  return async (dispatch) => {
    try {
      const members = doc(db, "socios", id);
      await deleteDoc(members);
      dispatch({ type: DELETE_MEMBER_SUCCESS, payload: id });
    } catch (error) {
      dispatch({
        type: DELETE_MEMBER_FAILURE,
        payload: error.message,
      });
    }
  };
};
// ADD MEMBER
export const addMember = (memberData) => {
  return async (dispatch) => {
    try {
      const membersCollection = collection(db, "socios");
      const docRef = await addDoc(membersCollection, memberData);
      dispatch({
        type: ADD_MEMBER_SUCCESS,
        payload: { ...memberData, id: docRef.id }, // agregamos el ID del nuevo miembro
      });
    } catch (error) {
      dispatch({
        type: ADD_MEMBER_FAILURE,
        payload: error.message,
      });
    }
  };
};
//uploadImg
export const uploadImage = (image) => {
  return async (dispatch) => {
    try {
      const storageRef = ref(storage, `imgProfile/${image.name}`);
      await uploadBytes(storageRef, image);
      const url = await getDownloadURL(storageRef);
      dispatch({
        type: UPLOAD_IMAGE_SUCCESS,
        payload: url,
      });
      return url;
    } catch (error) {
      dispatch({
        type: UPLOAD_IMAGE_FAILURE,
        payload: error.message,
      });
    }
  };
};
export const clearImageUrl = () => {
  return {
    type: CLEAR_IMAGE_URL,
  };
};
