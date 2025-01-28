document.getElementById('user-icon').addEventListener('click', function (event) {
  // Evita que el clic en el icono cierre el contenedor
  event.stopPropagation();

  const optionsContainer = document.getElementById('options-container');
  optionsContainer.classList.toggle('hidden'); // Alterna la visibilidad
});

// Opcional: Cierra el contenedor al hacer clic fuera de él
document.addEventListener('click', function (event) {
  const optionsContainer = document.getElementById('options-container');
  const userIcon = document.getElementById('user-icon');
  
  // Si el clic no es sobre el icono ni sobre el contenedor de opciones, lo cierra
  if (!userIcon.contains(event.target) && !optionsContainer.contains(event.target)) {
    optionsContainer.classList.add('hidden');
  }
});

// Redirección al hacer clic en "Cambiar Contraseña"
document.getElementById('change-password-btn').addEventListener('click', function () {
  console.log('Redirigiendo a cambiar-Pass.html');
  
  // Redirige dentro de la misma pestaña
  window.location.href = 'components/cambiar-Pass.html';  // Redirige dentro de la misma página
});
