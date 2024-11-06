let currentPage = 1;
const categoriesPerPage = 9;
let filteredCategories = [];

// Fonction pour créer un avatar 3D avec Three.js
function create3DAvatar(container) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    const animate = function () {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    };

    animate();
}

// Appliquer les avatars 3D dans tous les conteneurs '.avatar-3d'
document.querySelectorAll('.avatar-3d').forEach(container => {
    create3DAvatar(container);
});

// Fonction pour appliquer l'animation lors du changement de catégories
function animateCategories(direction) {
    const categoryContainer = document.getElementById('category-container');
    categoryContainer.style.transition = 'transform 1s ease-in-out, opacity 1s ease-in-out';
    categoryContainer.style.transform = `rotateY(${direction === 'next' ? '180deg' : '-180deg'})`;
    categoryContainer.style.opacity = '0';

    setTimeout(() => {
        displayCategories(currentPage, filteredCategories);
        categoryContainer.style.transform = 'rotateY(0)';
        categoryContainer.style.opacity = '1';
    }, 1000);
}

// Fonction pour afficher les catégories paginées
function displayCategories(page, categoriesToDisplay) {
    const start = (page - 1) * categoriesPerPage;
    const end = start + categoriesPerPage;
    const paginatedCategories = categoriesToDisplay.slice(start, end);

    const categoryContainer = document.getElementById('category-container');
    categoryContainer.innerHTML = ''; // Vide le container avant de le remplir

    paginatedCategories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.classList.add('col-md-4', 'mb-4');
        categoryElement.innerHTML = `
            <div class="card h-100 shadow">
                <div class="card-body">
                    <h5 class="card-title mt-3">${category.name}</h5>
                    <p class="card-text">Testez vos connaissances dans cette catégorie.</p>
                    <a href="/quiz?category=${category._id}" class="btn btn-primary category-btn">Commencer</a>
                </div>
            </div>
        `;
        categoryContainer.appendChild(categoryElement);
    });
}

// Fonction pour mettre à jour la pagination
function updatePagination(categoriesToDisplay) {
    const totalPages = Math.ceil(categoriesToDisplay.length / categoriesPerPage);
    document.getElementById('prev-page').style.display = currentPage > 1 ? 'block' : 'none';
    document.getElementById('next-page').style.display = currentPage < totalPages ? 'block' : 'none';
}

// Navigation avec les nouveaux boutons
document.getElementById('first-page').addEventListener('click', function(event) {
    event.preventDefault();
    currentPage = 1;
    displayCategories(currentPage, filteredCategories);
    updatePagination(filteredCategories);
});

document.getElementById('last-page').addEventListener('click', function(event) {
    event.preventDefault();
    currentPage = Math.ceil(filteredCategories.length / categoriesPerPage);
    displayCategories(currentPage, filteredCategories);
    updatePagination(filteredCategories);
});

document.getElementById('next-page').addEventListener('click', function(event) {
    event.preventDefault();
    if (currentPage < Math.ceil(filteredCategories.length / categoriesPerPage)) {
        currentPage++;
        displayCategories(currentPage, filteredCategories);
        updatePagination(filteredCategories);
    }
});

document.getElementById('prev-page').addEventListener('click', function(event) {
    event.preventDefault();
    if (currentPage > 1) {
        currentPage--;
        displayCategories(currentPage, filteredCategories);
        updatePagination(filteredCategories);
    }
});

document.getElementById('current-page').addEventListener('change', function(event) {
    const newPage = parseInt(event.target.value);
    const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        displayCategories(currentPage, filteredCategories);
        updatePagination(filteredCategories);
    } else {
        event.target.value = currentPage; // Rétablir la valeur actuelle si hors limite
    }
});

function updatePagination(categoriesToDisplay) {
    const totalPages = Math.ceil(categoriesToDisplay.length / categoriesPerPage);
    document.getElementById('prev-page').style.display = currentPage > 1 ? 'block' : 'none';
    document.getElementById('next-page').style.display = currentPage < totalPages ? 'block' : 'none';
    document.getElementById('first-page').style.display = currentPage > 1 ? 'block' : 'none';
    document.getElementById('last-page').style.display = currentPage < totalPages ? 'block' : 'none';
    document.getElementById('current-page').value = currentPage;
}

// Fetch categories and initialize
async function fetchCategories() {
  try {
      const response = await fetch('/api/categories');
      const categories = await response.json();
      filteredCategories = categories;

      displayCategories(currentPage, filteredCategories);
      updatePagination(filteredCategories);
  } catch (error) {
      console.error('Erreur lors de la récupération des catégories', error);
  }
}

fetchCategories();
