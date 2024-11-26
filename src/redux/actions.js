import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  deleteDoc,
  addDoc,
  getDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, storage } from "../firebaseConfig/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  formatTimestampToDate,
  convertDateToTimestamp,
} from "../utils/helpers";

//ACTIONS TYPES
// GET MEMBERS
export const FETCH_MEMBERS_START = "FETCH_MEMBERS_START";
export const FETCH_MEMBERS_SUCCESS = "FETCH_MEMBERS_SUCCESS";
export const FETCH_MEMBERS_FAILURE = "FETCH_MEMBERS_FAILURE";
// GET MEMBER
export const FETCH_MEMBER_SUCCESS = "FETCH_MEMBER_SUCCESS";
export const FETCH_MEMBER_FAILURE = "FETCH_MEMBER_FAILURE";
//GET MEMBER BY DNI

// UPDATE MEMBER
export const UPDATE_MEMBER_SUCCESS = "UPDATE_MEMBER_SUCCESS";
export const UPDATE_MEMBER_FAILURE = "UPDATE_MEMBER_FAILURE";
//DeleteMember
export const DELETE_MEMBER_SUCCESS = "DELETE_MEMBER_SUCCESS";
export const DELETE_MEMBER_FAILURE = "DELETE_MEMBER_FAILURE";
//AddMember
export const ADD_MEMBER_SUCCESS = "ADD_MEMBER_SUCCESS";
export const ADD_MEMBER_FAILURE = "ADD_MEMBER_FAILURE";
//Clear Member
export const CLEAR_MEMBER = "CLEAR_MEMBER";
//AddImg
export const UPLOAD_IMAGE_SUCCESS = "UPLOAD_IMAGE_SUCCESS";
export const UPLOAD_IMAGE_FAILURE = "UPLOAD_IMAGE_FAILURE";

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
  return async () => {
    try {
      const storageRef = ref(storage, `imgProfile/${image.name}`);
      await uploadBytes(storageRef, image);
      const url = await getDownloadURL(storageRef);

      return url;
    } catch (error) {
      console.error("Error al subir la imagen: ", error.message);
      throw error; // Permite manejar errores en createMember
    }
  };
};

//GET MEMBER BY ID
export const fetchMemberById = (id) => {
  return async (dispatch) => {
    try {
      const memberDoc = await getDoc(doc(db, "socios", id));
      if (memberDoc.exists()) {
        const data = memberDoc.data();
        dispatch({
          type: FETCH_MEMBER_SUCCESS,
          payload: {
            ...data,
            membershipStartDate: formatTimestampToDate(
              data.membershipStartDate
            ),
            membershipEndDate: formatTimestampToDate(data.membershipEndDate),
          },
        });
      } else {
        throw new Error("Socio no encontrado");
      }
    } catch (error) {
      dispatch({
        type: FETCH_MEMBER_FAILURE,
        payload: error.message,
      });
    }
  };
};

// UpdateMember
export const updateMember = (id, memberData) => {
  return async (dispatch) => {
    try {
      const memberDoc = doc(db, "socios", id);
      await updateDoc(memberDoc, {
        ...memberData,
        membershipStartDate: convertDateToTimestamp(
          memberData.membershipStartDate
        ),
        membershipEndDate: convertDateToTimestamp(memberData.membershipEndDate),
        img: memberData.img,
      });
      dispatch({ type: UPDATE_MEMBER_SUCCESS });
      return true;
    } catch (error) {
      dispatch({
        type: UPDATE_MEMBER_FAILURE,
        payload: error.message,
      });
      return false;
    }
  };
};
// Clear member
export const clearMember = () => ({
  type: CLEAR_MEMBER,
});

// socios activos
export const getActiveMembers = (currentDate) => async (dispatch) => {
  try {
    // Crear una consulta para obtener los socios activos (fechaVencimiento > fecha actual)
    const sociosRef = collection(db, "socios");
    const q = query(sociosRef, where("membershipEndDate", ">=", currentDate));

    // Ejecutar la consulta
    const querySnapshot = await getDocs(q);

    //convertir los datos de los documentos a un  formato adecuado
    const activeMembers = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // despachar los datos de los socios activos al estado global de redux
    dispatch({
      type: "SET_ACTIVE_MEMBERS",
      payload: activeMembers,
    });
  } catch (error) {
    console.error("Error al obtener socios activos", error);
  }
};
//Socios vencidos
export const getExpiredMembers = (currentDate) => async (dispatch) => {
  try {
    //Crear una consulta para obtener los socios vencidos (fechaVencimineto < fecha actual)
    const sociosRef = collection(db, "socios");
    const q = query(sociosRef, where("membershipEndDate", "<", currentDate));
    //ejecutar la consulta
    const querySnapshot = await getDocs(q);
    //convertir los datos de los documentos a un  formato adecuado
    const expiredMembers = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // despachar los datos de los socios activos al estado global de redux
    dispatch({
      type: "SET_EXPIRED_MEMBERS",
      payload: expiredMembers,
    });
  } catch (error) {
    console.error("Error al obtener vencidos activos", error.message);
  }
};
// Socios por vencer
export const getExpiringSoonMembers = (currentDate) => async (dispatch) => {
  try {
    const fiveDaysFromNow = new Date(currentDate);
    fiveDaysFromNow.setDate(currentDate.getDate() + 5); // fecha actual + 5 Dias
    // Crear una consulta para obtener todos los socios
    //Normalizar la fecha actual para que solo incluya año, mes y dia (sin hr)
    const currentDateNormalized = new Date(currentDate.setHours(0, 0, 0, 0));
    const fiveDaysFromNowNormalized = new Date(
      fiveDaysFromNow.setHours(0, 0, 0, 0)
    );

    const sociosRef = collection(db, "socios");
    const q = query(
      sociosRef,
      where("membershipEndDate", ">=", currentDateNormalized),
      where("membershipEndDate", "<=", fiveDaysFromNowNormalized)
    );

    // Ejecutar la consulta
    const querySnapshot = await getDocs(q);
    const expiringMembers = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // despacho la acction
    dispatch({
      type: "SET_EXPIRING_MEMBERS",
      payload: expiringMembers,
    });
  } catch (error) {
    console.error("Error al obtener socios por vencer pronto", error.message);
  }
};
