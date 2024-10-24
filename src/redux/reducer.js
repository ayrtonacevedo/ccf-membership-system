import {
  FETCH_MEMBERS_START,
  FETCH_MEMBERS_SUCCESS,
  FETCH_MEMBERS_FAILURE,
  DELETE_MEMBER_SUCCESS,
  DELETE_MEMBER_FAILURE,
  ADD_MEMBER_SUCCESS,
  ADD_MEMBER_FAILURE,
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_IMAGE_FAILURE,
  CLEAR_IMAGE_URL,
} from "./actions";

//INITIAL STATE
const initialState = {
  members: [],
  loading: false,
  error: null,
  imageUrl: null,
};
export default function rootReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_MEMBERS_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_MEMBERS_SUCCESS:
      return {
        ...state,
        members: action.payload,
        loading: false,
      };
    case FETCH_MEMBERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_MEMBER_SUCCESS:
      return {
        ...state,
        members: state.members.filter((member) => member.id !== action.payload),
      };
    case DELETE_MEMBER_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_MEMBER_SUCCESS:
      return {
        ...state,
        members: [...state.members, action.payload],
      };
    case ADD_MEMBER_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case UPLOAD_IMAGE_SUCCESS:
      return {
        ...state,
        imageUrl: action.payload,
      };
    case UPLOAD_IMAGE_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case CLEAR_IMAGE_URL:
      return {
        ...state,
        imageUrl: null, // Limpiar el estado de imageUrl
      };

    default:
      return state;
  }
}
