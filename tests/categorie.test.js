/**
 * @jest-environment jsdom
 */

global.fetch = jest.fn(() => 
  Promise.resolve({
    json: () => Promise.resolve([
      { _id: '6713a755f012fc38a3f26092', name: 'Musique' },
      { _id: '6713a755f012fc38a3f26098', name: 'Films' },
      { _id: '6713a756f012fc38a3f260a5', name: 'Jeux Vidéo' }
    ])
  })
);

document.body.innerHTML = `
  <div class="container">
    <input type="text" id="category-search" class="form-control">
    <div id="category-container" class="row"></div>
    <div class="pagination-controls">
      <button id="first-page">Premier</button>
      <button id="prev-page">Précédent</button>
      <input type="number" id="current-page" value="1" min="1">
      <button id="next-page">Suivant</button>
      <button id="last-page">Dernier</button>
    </div>
    <div class="parameters-section">
      <input type="number" id="question-count" value="10">
      <select id="difficulty">
        <option value="easy">Facile</option>
        <option value="medium">Moyen</option>
        <option value="hard">Difficile</option>
      </select>
      <input type="number" id="question-time" value="30">
      <button id="start-quick-quiz">Commencer</button>
    </div>
  </div>
`;

const categoriesPerPage = 9;
let currentPage = 1;
let allCategories = [];

function fetchCategories() {
  return fetch('/api/categories')
    .then(response => response.json())
    .then(categories => {
      allCategories = categories;
      displayCategories(categories);
    });
}

function displayCategories(categories) {
  const filteredCategories = filterCategories(categories);
  const container = document.getElementById('category-container');
  container.innerHTML = '';
  
  const start = (currentPage - 1) * categoriesPerPage;
  const end = Math.min(start + categoriesPerPage, filteredCategories.length);
  
  for (let i = start; i < end; i++) {
    const category = filteredCategories[i];
    const card = document.createElement('div');
    card.className = 'col-md-4 mb-4';
    card.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${category.name}</h5>
          <button class="btn btn-primary category-btn" data-id="${category._id}">Commencer</button>
        </div>
      </div>
    `;
    
    const button = card.querySelector('.category-btn');
    button.addEventListener('click', () => {
      window.location.href = `/quiz?category=${category._id}`;
    });
    
    container.appendChild(card);
  }
  
  updatePagination(filteredCategories);
}

function updatePagination(categoriesToDisplay) {
  const totalPages = Math.ceil(categoriesToDisplay.length / categoriesPerPage);
  document.getElementById('prev-page').style.display = currentPage > 1 ? 'block' : 'none';
  document.getElementById('next-page').style.display = currentPage < totalPages ? 'block' : 'none';
  document.getElementById('current-page').value = currentPage;
}

function filterCategories(categories) {
  const searchTerm = document.getElementById('category-search').value.toLowerCase();
  return categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm)
  );
}

document.getElementById('next-page').addEventListener('click', () => {
  currentPage++;
  displayCategories(allCategories);
});

document.getElementById('prev-page').addEventListener('click', () => {
  currentPage--;
  displayCategories(allCategories);
});

document.getElementById('category-search').addEventListener('input', () => {
  currentPage = 1;
  displayCategories(allCategories);
});

document.getElementById('start-quick-quiz').addEventListener('click', () => {
  const count = document.getElementById('question-count').value;
  const difficulty = document.getElementById('difficulty').value;
  const questionTime = document.getElementById('question-time').value;
  window.location.href = `/quiz?count=${count}&difficulty=${difficulty}&questionTime=${questionTime}`;
});

describe('Categories Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    currentPage = 1;
    
    fetchCategories();
  });
  
  test('fetches categories when page loads', () => {
    expect(global.fetch).toHaveBeenCalledWith('/api/categories');
  });

  test('displays categories in the container', async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const container = document.getElementById('category-container');
    expect(container.innerHTML).toContain('Musique');
    expect(container.innerHTML).toContain('Films');
    expect(container.innerHTML).toContain('Jeux Vidéo');
  });

  test('pagination works correctly', async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const currentPageInput = document.getElementById('current-page');
    expect(currentPageInput.value).toBe('1');
    
    document.getElementById('next-page').click();
    expect(currentPageInput.value).toBe('2');
    
    document.getElementById('prev-page').click();
    expect(currentPageInput.value).toBe('1');
  });

  test('search filter works correctly', async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const searchInput = document.getElementById('category-search');
    
    searchInput.value = 'Musique';
    searchInput.dispatchEvent(new Event('input'));
    
    const container = document.getElementById('category-container');
    expect(container.innerHTML).toContain('Musique');
    expect(container.innerHTML).not.toContain('Films');
  });

  test('quick quiz starts with parameters', () => {
    const hrefSetter = jest.fn();
    Object.defineProperty(window.location, 'href', {
      set: hrefSetter
    });
    
    document.getElementById('question-count').value = '5';
    document.getElementById('difficulty').value = 'medium';
    document.getElementById('question-time').value = '20';
    
    document.getElementById('start-quick-quiz').click();
    
    expect(hrefSetter).toHaveBeenCalledWith('/quiz?count=5&difficulty=medium&questionTime=20');
  });
});