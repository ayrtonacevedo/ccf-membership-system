import { db } from "../firebaseConfig/firebase";
import { collection, addDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { MEMBER } from "./member";

// Función para convertir las fechas a Timestamps de Firebase
const convertir = (d) => {
  const date = new Date(d + "T00:00:00");
  return Timestamp.fromDate(date);
};

// Verifica si los miembros ya han sido cargados en la base de datos
const checkIfSeeded = async () => {
  const docRef = doc(db, "settings", "seedStatus");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().seeded; // Devuelve true si ya están cargados, false en caso contrario
  } else {
    return false; // No existe el documento, lo que significa que no se ha hecho la carga
  }
};

// Marca en la base de datos que los miembros ya han sido cargados
const markAsSeeded = async () => {
  const docRef = doc(db, "settings", "seedStatus");
  await setDoc(docRef, { seeded: true });
};

// Función para cargar los miembros en la base de datos
const seedMembersInBD = async () => {
  const alreadySeeded = await checkIfSeeded(); // Verificar si ya fueron cargados

  if (alreadySeeded) {
    console.log("Los miembros ya fueron cargados.");
    return;
  }

  const membersCollection = collection(db, "socios");

  for (let member of MEMBER) {
    try {
      await addDoc(membersCollection, {
        name: member.name,
        dni: member.dni,
        phone: member.phone,
        membershipStartDate: convertir(member.membershipStartDate),
        membershipEndDate: convertir(member.membershipEndDate),
        observaciones: member.observaciones,
      });
      console.log(`Socio ${member.name} agregado exitosamente.`);
    } catch (error) {
      console.error("Error agregando al socio: ", error);
    }
  }

  await markAsSeeded(); // Marca como "sembrados" los miembros en Firestore
};

export { seedMembersInBD };
