import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";

//ACTIONS TYPES
export const FETCH_MEMBERS_START = "FETCH_MEMBERS_START";
export const FETCH_MEMBERS_SUCCESS = "FETCH_MEMBERS_SUCCESS";
export const FETCH_MEMBERS_FAILURE = "FETCH_MEMBERS_FAILURE";
//Delete
export const DELETE_MEMBER_SUCCESS = "DELETE_MEMBER_SUCCESS";
export const DELETE_MEMBER_FAILURE = "DELETE_MEMBER_FAILURE";

//GET MEMBERS
export const fetchMembers = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_MEMBERS_START });
    try {
      const membersCollection = collection(db, "socios");
      const data = await getDocs(membersCollection);
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
      dispatch({ type: DELETE_MEMBER_FAILURE, payload: error.message });
    }
  };
};
