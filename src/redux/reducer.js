import {
  FETCH_MEMBERS_START,
  FETCH_MEMBERS_SUCCESS,
  FETCH_MEMBERS_FAILURE,
  DELETE_MEMBER_SUCCESS,
  DELETE_MEMBER_FAILURE,
  ADD_MEMBER_SUCCESS,
  ADD_MEMBER_FAILURE,
  FETCH_MEMBER_SUCCESS,
  FETCH_MEMBER_FAILURE,
  UPDATE_MEMBER_SUCCESS,
  UPDATE_MEMBER_FAILURE,
  CLEAR_MEMBER,
} from "./actions";

//INITIAL STATE
const initialState = {
  members: [],
  member: null,
  loading: false,
  error: null,
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
    case FETCH_MEMBER_SUCCESS:
      return {
        ...state,
        member: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_MEMBER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_MEMBER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_MEMBER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CLEAR_MEMBER:
      return {
        ...state,
        member: null,
      };

    default:
      return state;
  }
}
