describe('Editor Page', () => {
  beforeEach(() => {
    // Mock the project data
    cy.intercept('GET', '/api/current-project', {
      statusCode: 200,
      body: {
        success: true,
        project: {
          _id: 'test-project-id',
          name: 'Test Project',
          questions: [],
          theme: '',
          font: 'Arial',
          points: 10,
          enableTimeBonus: false
        }
      }
    }).as('getProject');
    
    // Visit the editor page
    cy.visit('/editor');
    cy.wait('@getProject');
  });

  it('allows adding a new question', () => {
    // Click the add question button
    cy.get('#addQuestionBtn').click();
    
    // Check if a new question card was added
    cy.get('#questionsList .question-card').should('have.length.at.least', 1);
  });

  it('allows editing question text', () => {
    // Enter question text
    const questionText = 'What is the capital of France?';
    cy.get('.main-content input[type="text"]').first().type(questionText);
    
    // Verify the question text was saved (we can check if it appears in the question list)
    cy.get('#questionsList .question-card p').should('contain', questionText);
  });

  it('allows adding answer options', () => {
    // Get initial count of answer options
    cy.get('#answerOptionsContainer .answer-option').then(($options) => {
      const initialCount = $options.length;
      
      // Click add option button
      cy.get('#addOptionBtn').click();
      
      // Verify a new option was added
      cy.get('#answerOptionsContainer .answer-option').should('have.length', initialCount + 1);
    });
  });

  it('allows marking correct answers', () => {
    // Click the correct toggle for the first answer
    cy.get('#answerOptionsContainer .answer-option:first-child .correct-toggle').click();
    
    // Verify the button style changed to indicate it's correct
    cy.get('#answerOptionsContainer .answer-option:first-child .correct-toggle')
      .should('have.class', 'text-green-500')
      .or('have.css', 'color', 'rgb(34, 197, 94)');  // green-500 color
  });

  it('allows changing question type', () => {
    // Go to layout tab
    cy.get('[data-tab="layout"]').click();
    
    // Click true/false question type
    cy.get('#truefalseBtn').click();
    
    // Verify answer options changed to true/false
    cy.get('#answerOptionsContainer .answer-option').should('have.length', 2);
    cy.get('#answerOptionsContainer .answer-option:first-child input').should('have.value', 'Vrai');
    cy.get('#answerOptionsContainer .answer-option:last-child input').should('have.value', 'Faux');
  });

  it('allows adjusting time limit', () => {
    // Move the time slider
    cy.get('#timeSlider').invoke('val', 60).trigger('input');
    
    // Verify the displayed time updated
    cy.get('#timeDisplay').should('contain', '60s');
  });

  it('allows changing theme', () => {
    // Click on a theme
    cy.get('#theme-previews .theme-preview:nth-child(2) img').click();
    
    // Verify the body background changed
    cy.get('body').should('have.css', 'background-image')
      .and('include', 'savane.jpeg');
  });

  it('allows changing font', () => {
    // Go to settings tab
    cy.get('[data-tab="settings"]').click();
    
    // Click on a font
    cy.get('[data-font="Roboto"]').click();
    
    // Verify the font changed
    cy.get('body').should('have.css', 'font-family')
      .and('include', 'Roboto');
  });

  it('allows changing point settings', () => {
    // Go to settings tab
    cy.get('[data-tab="settings"]').click();
    
    // Change default points
    cy.get('#defaultPoints').clear().type('20');
    
    // Enable time bonus
    cy.get('#enableBonus').check();
    
    // Verify the settings changed
    cy.get('#defaultPoints').should('have.value', '20');
    cy.get('#enableBonus').should('be.checked');
  });

  it('allows submitting the quiz', () => {
    // Mock the submission endpoint
    cy.intercept('PUT', '/api/quizzes/*', {
      statusCode: 200,
      body: { success: true }
    }).as('submitQuiz');
    
    // Enter basic quiz data
    cy.get('.main-content input[type="text"]').first().type('Test Question');
    
    // Add an answer
    cy.get('#answerOptionsContainer .answer-option:first-child input').type('Correct Answer');
    cy.get('#answerOptionsContainer .answer-option:first-child .correct-toggle').click();
    
    // Submit the quiz
    cy.get('#submit-quiz').click();
    
    // Verify the request was made
    cy.wait('@submitQuiz');
  });
});