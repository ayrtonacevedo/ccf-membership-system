import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

//function to format date
export const formatDate = (timestamp) => {
  if (!timestamp) return "";
  return format(timestamp.toDate(), "dd/MM/yyyy");
};
// function convert Date to Timestamp
export const convertDateToTimestamp = (d) => {
  const date = new Date(d + "T00:00:00");
  return Timestamp.fromDate(date);
};
// Function to check membership status
export const getMembershipStatus = (membershipEndDate) => {
  if (!membershipEndDate) return { status: "expired", daysRemaining: 0 };

  if (!(membershipEndDate instanceof Timestamp)) {
    throw new Error("Invalid membership end date");
  }

  const currentDate = new Date(); // Current Date
  const endDate = membershipEndDate.toDate(); //we convert the timestamp into date

  //// We calculate the difference in milliseconds and convert it to days
  const difftime = endDate - currentDate;
  const diffDays = Math.ceil(difftime / (1000 * 60 * 60 * 24));
  if (diffDays < 0) {
    return { status: "expired", daysRemaining: 0 }; // Membership has already expired
  } else if (diffDays <= 3) {
    return { status: "expiring", daysRemaining: diffDays }; // Membership expires in the next few days
  } else {
    return { status: "active", daysRemaining: diffDays }; // Membership is active
  }
};

//fuction confirmDelete
export const confirmDelete = (deleteFunction, id) => {
  MySwal.fire({
    title: "Eliminar Socio?",
    text: "¡No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    cancelButtonText: "Cancelar",
    confirmButtonText: "Si, eliminarlo!",
  }).then((result) => {
    if (result.isConfirmed) {
      deleteFunction(id);
      Swal.fire("¡Eliminado!", "Su archivo ha sido eliminado", "success");
    }
  });
};
