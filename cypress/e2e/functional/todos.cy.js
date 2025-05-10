// Tests for todo CRUD operations

describe('Todo CRUD Operations', () => {
    beforeEach(() => {
      cy.clearLocalStorage();
      
      cy.fixture('../../fixtures/users').then((users) => {
        const testUser = users.validUser;
        
        // Try to register the user first (in case it doesn't exist)
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/users`,
          body: testUser,
          failOnStatusCode: false
        });
        
        // Login via custom command
        cy.login(testUser.email, testUser.password);
        
        // Clean up todos from previous tests
        cy.cleanupTodosViaApi();
      });
    });
  
    it('should create a new todo', () => {
      const todoText = 'Test todo ' + Date.now();
      
      // Create a new todo
      cy.createTodo(todoText);
      
      // Verify todo was created
      cy.contains(todoText);
    });
  
    it('should mark a todo as completed', () => {
      const todoText = 'Complete this todo ' + Date.now();
      
      // Create a new todo
      cy.createTodo(todoText);
      
      // Mark todo as completed
      cy.toggleFirstTodo();
      
      // Verify todo is marked as completed
      cy.contains(todoText)
        .parents('[data-testid=todo-item]')
        .should('have.class', 'completed');
    });
  
    it('should delete a todo', () => {
      const todoText = 'Delete this todo ' + Date.now();
      
      // Create a new todo
      cy.createTodo(todoText);
      
      // Delete todo
      cy.deleteFirstTodo();
      
      // Verify todo has been deleted
      cy.contains(todoText).should('not.exist');
    });
  
    it('should display a message when no todos exist', () => {
      // Clean up any existing todos
      cy.cleanupTodosViaApi();
      cy.reload();
      
      // Check for "no todos" message
      cy.get('[data-testid=no-todos]').should('be.visible');
    });
  });