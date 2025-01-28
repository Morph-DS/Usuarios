// Importar las funciones necesarias desde firebase.js
import { db, auth } from './firebase.js';
import { collection, addDoc, getDocs, onSnapshot, doc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js';

// Variables del DOM
const tableBody = document.getElementById('table-body');
const btnGuardar = document.getElementById('btnGuardar');
const overlay = document.getElementById('overlay');
const messagesContainer = document.getElementById('messagesContainer');
const empresaSelect = document.getElementById('empresaSelect');
const deleteContainer = document.getElementById('deleteContainer');
const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');
const btnCancelarEliminar = document.getElementById('btnCancelar');
const deleteTitle = document.getElementById('deleteTitle');

// Variables de paginación
let contactos = [];
let currentPage = 1;
const rowsPerPage = 20;

// Función para generar un ID correlativo
async function getNextId() {
    const contactosSnapshot = await getDocs(collection(db, 'contactos'));
    let maxId = 0;

    contactosSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.id) {
            const docId = parseInt(data.id, 10);
            if (!isNaN(docId) && docId > maxId) {
                maxId = docId;
            }
        }
    });

    return (maxId + 1).toString().padStart(3, '0');
}

// Mostrar mensaje de éxito o error
function showMessage(type, message) {
    alert(`${type.toUpperCase()}: ${message}`);
}

// Evento para guardar contacto
btnGuardar.onclick = async (e) => {
    e.preventDefault();
    overlay.classList.remove('hidden');

    try {
        const usuario = document.getElementById('registrarUsuario').textContent.trim() || (auth.currentUser ? auth.currentUser.email : 'Anónimo');
        const empresa = empresaSelect.value;
        const representante = document.getElementById('registrarRepresentante').value;
        const correo = document.getElementById('registrarCorreo').value;
        const telefono = document.getElementById('registrarTelefono').value;
        const anexo = document.getElementById('registrarAnexo').value;
        const observacion = document.getElementById('registrarObservacion').value;
        const newId = await getNextId();

        if (!empresa || !representante || !correo) {
            showMessage('error', 'Por favor completa todos los campos requeridos.');
            overlay.classList.add('hidden');
            return;
        }

        await addDoc(collection(db, 'contactos'), {
            id: newId,
            empresa,
            representante,
            correo,
            telefono,
            anexo,
            observacion,
            usuario,
            fecha: new Date(),
        });

        showMessage('success', `El contacto "${representante}" ha sido registrado con éxito.`);
        empresaSelect.value = '';
        document.getElementById('registrarRepresentante').value = '';
        document.getElementById('registrarCorreo').value = '';
        document.getElementById('registrarTelefono').value = '';
        document.getElementById('registrarAnexo').value = '';
        document.getElementById('registrarObservacion').value = '';
    } catch (error) {
        console.error("Error al registrar contacto:", error);
        showMessage('error', 'Error al registrar el contacto. Intenta nuevamente.');
    } finally {
        overlay.classList.add('hidden');
    }
};

// Función para cargar los contactos en la tabla
function loadContactos() {
    onSnapshot(collection(db, 'contactos'), (querySnapshot) => {
        tableBody.innerHTML = '';
        contactos = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            contactos.push({ id: parseInt(data.id, 10), data, docId: doc.id });
        });

        contactos.sort((a, b) => a.id - b.id);
        renderTable();
        renderPagination();
    });
}

// Renderizar tabla con datos paginados
function renderTable() {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const contactosToShow = contactos.slice(startIndex, endIndex);

    contactosToShow.forEach((contactoObj) => {
        const data = contactoObj.data;
        const row = document.createElement('tr');

        row.innerHTML = `
            <td><button class="delete-btn" data-id="${contactoObj.docId}"><i class="fas fa-trash"></i></button></td>
            <td>${data.id}</td>
            <td>${data.empresa}</td>
            <td>${data.representante}</td>
            <td>${data.correo}</td>
            <td>${data.telefono || 'No disponible'}</td>
            <td>${data.anexo || 'No disponible'}</td>
            <td>${data.observacion || 'No disponible'}</td>
            <td>${data.fecha?.toDate().toLocaleDateString() || 'No disponible'}</td>
            <td>${data.usuario}</td>
        `;

        tableBody.appendChild(row);

        const deleteButton = row.querySelector('.delete-btn');
        deleteButton.onclick = () => confirmDelete(contactoObj);
    });
}

// Confirmar eliminación
function confirmDelete(contactoObj) {
    deleteTitle.textContent = `¿Estás seguro de que deseas eliminar el contacto "${contactoObj.data.representante}"?`;
    deleteContainer.classList.remove('hidden');

    btnConfirmarEliminar.onclick = async () => {
        try {
            await deleteDoc(doc(db, 'contactos', contactoObj.docId));
            showMessage('success', `El contacto "${contactoObj.data.representante}" ha sido eliminado.`);
        } catch (error) {
            console.error("Error al eliminar contacto:", error);
            showMessage('error', 'Error al eliminar el contacto. Intenta nuevamente.');
        } finally {
            deleteContainer.classList.add('hidden');
        }
    };

    btnCancelarEliminar.onclick = () => {
        deleteContainer.classList.add('hidden');
    };
}

// Renderizar paginación
function renderPagination() {
    const totalPages = Math.ceil(contactos.length / rowsPerPage);
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.toggle('active', i === currentPage);
        pageButton.onclick = () => {
            currentPage = i;
            renderTable();
        };
        pagination.appendChild(pageButton);
    }
}

// Inicializar la carga de datos
window.onload = loadContactos;
