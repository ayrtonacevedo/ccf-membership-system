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

export const formatTimestampToDate = (timestamp) => {
  if (!timestamp || !timestamp.toDate) return "";
  return timestamp.toDate().toISOString().substring(0, 10);
};

export const formatTimestampToLocaleDate = (timestamp) => {
  const date = timestamp.toDate(); // Convierte el Timestamp a un objeto Date
  return date.toLocaleDateString(); // Devuelve la fecha en formato legible
};

// function convert Date to Timestamp
export const convertDateToTimestamp = (d) => {
  const date = new Date(d + "T00:00:00");
  return Timestamp.fromDate(date);
};
// Function to check membership status
export const getMembershipStatus = (membershipEndDate) => {
  if (!membershipEndDate) {
    return { status: "expired", daysRemaining: 0 };
  }

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Ajustar a inicio del día
  const endDate = new Date(membershipEndDate.toDate());
  endDate.setHours(0, 0, 0, 0); // Ajustar a inicio del día

  const diffTime = endDate - currentDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { status: "expired", daysRemaining: 0 };
  }

  if (diffDays === 0) {
    return { status: "expiring", daysRemaining: 0 }; // Vence hoy
  }

  if (diffDays <= 5) {
    return { status: "expiring", daysRemaining: diffDays };
  }

  return { status: "active", daysRemaining: diffDays };
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
// validaciones dni, phone
export const isValidDni = (dni) => dni && /^\d{7,8}$/.test(dni);

export const isValidPhone = (phone) => phone && /^\d{10,}$/.test(phone);

// paginacion
export function paginate(items, currentPage, pageSize) {
  const startIndex = (currentPage - 1) * pageSize;
  return items.slice(startIndex, startIndex + pageSize);
}
