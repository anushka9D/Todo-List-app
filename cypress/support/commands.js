// Command to register a new user
Cypress.Commands.add('register', (name, email, password) => {
    cy.visit('/register');
    cy.get('[data-testid=name-input]').type(name);
    cy.get('[data-testid=email-input]').type(email);
    cy.get('[data-testid=password-input]').type(password);
    cy.get('[data-testid=confirm-password-input]').type(password);
    cy.get('[data-testid=register-submit]').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
  
  // Command to login a user
  Cypress.Commands.add('login', (email, password) => {
    cy.visit('/login');
    cy.get('[data-testid=email-input]').type(email);
    cy.get('[data-testid=password-input]').type(password);
    cy.get('[data-testid=login-submit]').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
  
  // Command to logout a user
  Cypress.Commands.add('logout', () => {
    cy.get('[data-testid=logout-button]').click();
    cy.url().should('include', '/login');
  });
  
  // Command to create a todo
  Cypress.Commands.add('createTodo', (text) => {
    cy.get('[data-testid=todo-input]').type(text);
    cy.get('[data-testid=todo-submit]').click();
    cy.contains(text);
  });
  
  // Command to delete the first todo
  Cypress.Commands.add('deleteFirstTodo', () => {
    cy.get('[data-testid=todo-delete]').first().click();
  });
  
  // Command to toggle completion of first todo
  Cypress.Commands.add('toggleFirstTodo', () => {
    cy.get('[data-testid=todo-toggle]').first().click();
  });
  
  // Command to directly call API to create test data
  Cypress.Commands.add('createTestTodoViaApi', (text) => {
    const token = JSON.parse(localStorage.getItem('user')).token;
    
    return cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/todos`,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        text
      }
    });
  });
  
  // Command to cleanup test data by API
  Cypress.Commands.add('cleanupTodosViaApi', () => {
    const token = JSON.parse(localStorage.getItem('user')).token;
    
    // Get all todos
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/todos`,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
      // Delete each todo
      response.body.forEach((todo) => {
        cy.request({
          method: 'DELETE',
          url: `${Cypress.env('apiUrl')}/todos/${todo._id}`,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      });
    });
  });
  
  // Command for API authentication
  Cypress.Commands.add('apiLogin', (email, password) => {
    return cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/users/login`,
      body: {
        email,
        password
      }
    }).then((response) => {
      localStorage.setItem('user', JSON.stringify(response.body));
      return response;
    });
  });