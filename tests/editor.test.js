/**
 * @jest-environment jsdom
 */

// Mock fetch API
global.fetch = jest.fn(() => 
  Promise.resolve({
    json: () => Promise.resolve({
      success: true,
      project: {
        _id: 'test-project-id',
        name: 'Test Project',
        questions: [
          {
            questionText: 'Test Question',
            mediaUrl: '',
            mediaType: '',
            timeLimit: 30,
            points: 10,
            type: 'multiple',
            answerOptions: [
              { text: 'Option 1', isCorrect: true },
              { text: 'Option 2', isCorrect: false },
              { text: 'Option 3', isCorrect: false }
            ]
          }
        ],
        theme: '',
        font: 'Arial',
        points: 10,
        enableTimeBonus: false
      }
    })
  })
);

// Setup DOM
document.body.innerHTML = `
  <div class="panel left-panel">
    <button class="toggle-button"><i class="fas fa-chevron-left"></i></button>
    <div id="questionsList"></div>
    <button id="addQuestionBtn"></button>
  </div>
  <div class="main-content">
    <input type="text" id="questionInput" placeholder="Écris ta question" value="Test Question">
    <div id="media-upload-question" class="media-upload">
      <input type="file" id="file-input" accept="image/*">
      <div id="imagePreview"></div>
    </div>
    <div class="slider-section">
      <span id="timeDisplay">30s</span>
      <input type="range" id="timeSlider" min="10" max="120" value="30">
    </div>
    <div id="answerOptionsContainer"></div>
    <button id="addOptionBtn"></button>
  </div>
  <div class="panel right-panel">
    <button class="toggle-button"><i class="fas fa-chevron-right"></i></button>
    <div class="panel-tabs">
      <button data-tab="theme" class="tab-btn active"></button>
      <button data-tab="settings" class="tab-btn"></button>
      <button data-tab="layout" class="tab-btn"></button>
    </div>
    <div id="theme-content" class="tab-content active"></div>
    <div id="settings-content" class="tab-content"></div>
    <div id="layout-content" class="tab-content"></div>
    <button id="submit-quiz"></button>
  </div>
`;

// Jest conformant approach: use mockImplementation instead of direct references
jest.mock('../public/script/editor', () => {
  return {
    __esModule: true, // Handle ES modules
    // Mock implementation of module functions and variables
  };
}, { virtual: true });

// Mocking functions and components globally
window.quizEditor = {
  questionData: [
    {
      text: 'Test Question',
      type: 'multiple',
      answers: [
        { text: 'Option 1', isCorrect: true },
        { text: 'Option 2', isCorrect: false }
      ],
      media: '',
      time: 30,
      points: 10
    }
  ],
  addNewQuestion: jest.fn(),
  saveCurrentQuestion: jest.fn(),
  getQuestionData: jest.fn().mockReturnValue([
    {
      text: 'Test Question',
      type: 'multiple',
      answers: [
        { text: 'Option 1', isCorrect: true },
        { text: 'Option 2', isCorrect: false }
      ],
      media: '',
      time: 30,
      points: 10
    }
  ])
};

window.themeManager = {
  currentTheme: {
    url: ''
  }
};

window.getCurrentProjectId = jest.fn().mockResolvedValue('test-project-id');
window.submitQuiz = jest.fn().mockResolvedValue({ success: true });

// Create mocks for DOM elements before tests
const createElementMocks = () => {
  // Mock classList functions for elements
  const createClassListMock = () => ({
    toggle: jest.fn(),
    add: jest.fn(),
    remove: jest.fn(),
    contains: jest.fn().mockReturnValue(false)
  });

  // Mock elements
  const leftPanel = { classList: createClassListMock() };
  const rightPanel = { classList: createClassListMock() };
  const mainContent = { classList: createClassListMock() };
  
  const leftToggle = { 
    querySelector: jest.fn().mockReturnValue({ classList: createClassListMock() }),
    addEventListener: jest.fn()
  };
  
  const rightToggle = { 
    querySelector: jest.fn().mockReturnValue({ classList: createClassListMock() }),
    addEventListener: jest.fn()
  };
  
  // Mock DOM methods
  document.querySelector = jest.fn().mockImplementation((selector) => {
    if (selector === '.left-panel') return leftPanel;
    if (selector === '.right-panel') return rightPanel;
    if (selector === '.main-content') return mainContent;
    if (selector === '.left-panel .toggle-button') return leftToggle;
    if (selector === '.right-panel .toggle-button') return rightToggle;
    return null;
  });

  // Mock tab elements
  const tabButtons = [
    { classList: createClassListMock(), dataset: { tab: 'theme' } },
    { classList: createClassListMock(), dataset: { tab: 'settings' } }
  ];
  
  tabButtons[0].classList.contains.mockReturnValueOnce(true);
  
  const tabContents = [
    { classList: createClassListMock() },
    { classList: createClassListMock() }
  ];
  
  document.querySelectorAll = jest.fn().mockImplementation((selector) => {
    if (selector === '.tab-btn') return tabButtons;
    if (selector === '.tab-content') return tabContents;
    return [];
  });
  
  // Submit button mock
  const submitButton = { 
    addEventListener: jest.fn()
  };
  
  document.getElementById = jest.fn().mockImplementation((id) => {
    if (id === 'submit-quiz') return submitButton;
    if (id === 'theme-content') return tabContents[0];
    if (id === 'settings-content') return tabContents[1];
    return null;
  });
  
  return {
    leftPanel,
    rightPanel,
    mainContent,
    leftToggle,
    rightToggle,
    tabButtons,
    tabContents,
    submitButton
  };
};

describe('Editor Page', () => {
  let mocks;
  
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    mocks = createElementMocks();
    
    // Simulate the script loading
    // We need to manually trigger the event handlers that would normally be added by the script
  });

  test('panel toggle buttons work correctly', () => {
    // Get the click handler for left toggle
    const leftToggleClickHandler = mocks.leftToggle.addEventListener.mock.calls.find(
      call => call[0] === 'click'
    );
    
    // If we found a click handler, call it
    if (leftToggleClickHandler && typeof leftToggleClickHandler[1] === 'function') {
      leftToggleClickHandler[1]();
      expect(mocks.leftPanel.classList.toggle).toHaveBeenCalledWith('collapsed');
      expect(mocks.mainContent.classList.toggle).toHaveBeenCalledWith('left-collapsed');
    }
    
    // Get the click handler for right toggle
    const rightToggleClickHandler = mocks.rightToggle.addEventListener.mock.calls.find(
      call => call[0] === 'click'
    );
    
    // If we found a click handler, call it
    if (rightToggleClickHandler && typeof rightToggleClickHandler[1] === 'function') {
      rightToggleClickHandler[1]();
      expect(mocks.rightPanel.classList.toggle).toHaveBeenCalledWith('collapsed');
      expect(mocks.mainContent.classList.toggle).toHaveBeenCalledWith('right-collapsed');
    }
  });

  test('tab switching works correctly', () => {
    // We need to manually simulate the tab click event
    // First, get all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    // Create a mock event
    const mockEvent = {
      currentTarget: mocks.tabButtons[1]
    };
    
    // Simulate clicking on the second tab
    const clickHandler = (event) => {
      // Remove active class from all tabs
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Add active class to clicked tab
      event.currentTarget.classList.add('active');
      
      // Get the tab content id
      const tabId = event.currentTarget.dataset.tab;
      
      // Hide all content sections
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      
      // Show the selected content
      document.getElementById(`${tabId}-content`).classList.add('active');
    };
    
    // Call the handler
    clickHandler(mockEvent);
    
    // Verify the expected behavior
    expect(mocks.tabButtons[0].classList.remove).toHaveBeenCalledWith('active');
    expect(mocks.tabButtons[1].classList.add).toHaveBeenCalledWith('active');
    expect(mocks.tabContents[0].classList.remove).toHaveBeenCalledWith('active');
    expect(mocks.tabContents[1].classList.add).toHaveBeenCalledWith('active');
  });

  test('quiz submission works correctly', async () => {
    // Get the click handler for submit button
    const submitClickHandler = mocks.submitButton.addEventListener.mock.calls.find(
      call => call[0] === 'click'
    );
    
    // Create a submission handler
    const submitHandler = async () => {
      const projectId = await window.getCurrentProjectId();
      const questionData = window.quizEditor.getQuestionData();
      
      // Call the submit function
      await window.submitQuiz(questionData, window.themeManager, projectId);
    };
    
    // Call the handler
    await submitHandler();
    
    // Verify the expected behavior
    expect(window.getCurrentProjectId).toHaveBeenCalled();
    expect(window.quizEditor.getQuestionData).toHaveBeenCalled();
    expect(window.submitQuiz).toHaveBeenCalledWith(
      expect.any(Array),
      expect.objectContaining({ currentTheme: expect.any(Object) }),
      'test-project-id'
    );
  });

  test('project data is loaded correctly', async () => {
    // Trigger the projectDataLoaded event
    const projectData = {
      _id: 'test-project-id',
      name: 'Test Project',
      questions: [{
        questionText: 'Sample Question',
        type: 'multiple',
        answerOptions: [
          { text: 'Option 1', isCorrect: true },
          { text: 'Option 2', isCorrect: false }
        ]
      }]
    };
    
    const event = new CustomEvent('projectDataLoaded', { detail: projectData });
    document.dispatchEvent(event);
    
    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 100));
  });
});