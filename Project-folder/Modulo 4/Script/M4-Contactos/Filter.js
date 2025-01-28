// Importar las funciones necesarias desde firebase.js
import { db } from './firebase.js';
import { collection, getDocs, doc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js';

// Variables del DOM
const buscarContactoInput = document.getElementById('buscarMedico');
const tableBody = document.getElementById('table-body');
const paginationContainer = document.getElementById('pagination'); // Contenedor de paginación
const itemsPerPage = 20; // Número de contactos por página
let currentPage = 1; // Página actual
let contactos = []; // Variable global para almacenar los contactos

// Función para obtener todos los contactos de la base de datos
async function getContactos() {
    try {
        const querySnapshot = await getDocs(collection(db, 'contactos'));
        contactos = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            contactos.push({
                ...data,
                docId: doc.id, // Agregar el id del documento para referencia
            });
        });

        // Ordenar los contactos por nombre de representante
        contactos.sort((a, b) => (a.representante || '').localeCompare(b.representante || ''));

        renderTable(); // Renderizar la tabla con los datos obtenidos
        renderPagination(contactos.length); // Renderizar paginación
    } catch (error) {
        console.error('Error al obtener los datos:', error);
    }
}

// Función para filtrar los datos según el texto ingresado en el campo de búsqueda
function filterData() {
    const filterText = buscarContactoInput.value.trim().toLowerCase();

    // Filtrar los contactos según el nombre del representante, empresa o usuario
    return contactos.filter((contacto) => {
        const matchRepresentante = (contacto.representante || '').toLowerCase().includes(filterText);
        const matchEmpresa = (contacto.empresa || '').toLowerCase().includes(filterText);
        const matchUsuario = (contacto.usuario || '').toLowerCase().includes(filterText);
        return matchRepresentante || matchEmpresa || matchUsuario;
    });
}

// Función para renderizar la tabla con los datos filtrados y paginados
function renderTable() {
    const filteredContactos = filterData();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPageContactos = filteredContactos.slice(startIndex, startIndex + itemsPerPage);

    tableBody.innerHTML = ''; // Limpiar tabla antes de renderizar

    currentPageContactos.forEach((contacto) => {
        let fecha = 'Sin fecha';
        if (contacto.fecha) {
            fecha = new Date(contacto.fecha.seconds * 1000).toLocaleDateString('es-CL'); // Convertir timestamp a fecha
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><button class="delete-btn" data-id="${contacto.docId}"><i class="fas fa-trash"></i></button></td>
            <td>${contacto.id}</td>
            <td>${contacto.empresa || 'Sin empresa'}</td>
            <td>${contacto.representante || 'Sin representante'}</td>
            <td>${contacto.correo || 'Sin correo'}</td>
            <td>${contacto.telefono || 'Sin celular'}</td>
            <td>${contacto.anexo || 'Sin anexo'}</td>
            <td>${contacto.observacion || 'No disponible'}</td>
            <td>${fecha}</td>
            <td>${contacto.usuario || 'Desconocido'}</td>
        `;
        tableBody.appendChild(row);

        // Agregar evento al botón de eliminar
        const deleteButton = row.querySelector('.delete-btn');
        deleteButton.onclick = () => confirmDelete(contacto);
    });
}

// Función para renderizar la paginación
function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    paginationContainer.innerHTML = ''; // Limpiar paginación

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('page-btn');
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.onclick = () => {
            currentPage = i;
            renderTable(); // Actualizar la tabla al cambiar de página
        };
        paginationContainer.appendChild(pageButton);
    }
}

// Función para confirmar y eliminar un contacto
function confirmDelete(contacto) {
    const confirmacion = confirm(`¿Estás seguro de que deseas eliminar el contacto "${contacto.representante}"?`);
    if (confirmacion) {
        deleteContacto(contacto.docId);
    }
}

// Función para eliminar un contacto de Firebase
async function deleteContacto(docId) {
    try {
        await deleteDoc(doc(db, 'contactos', docId));
        alert('Contacto eliminado exitosamente.');
        getContactos(); // Recargar los datos después de eliminar
    } catch (error) {
        console.error('Error al eliminar contacto:', error);
        alert('Hubo un error al eliminar el contacto. Intenta nuevamente.');
    }
}

// Agregar evento al campo de búsqueda para filtrar en tiempo real
buscarContactoInput.addEventListener('input', () => {
    currentPage = 1; // Reiniciar a la primera página al filtrar
    renderTable(); // Actualizar la tabla con los datos filtrados
    renderPagination(filterData().length); // Actualizar paginación con el número de resultados filtrados
});

// Inicializar la tabla al cargar la página
getContactos();
