// Tests for database persistence and integrity

describe('Database Persistence Tests', () => {
    beforeEach(() => {
      cy.clearLocalStorage();
      
      cy.fixture('../../fixtures/users').then((users) => {
        const testUser = users.validUser;
        
        // Register test user if doesn't exist
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/users`,
          body: testUser,
          failOnStatusCode: false
        });
        
        // Login
        cy.apiLogin(testUser.email, testUser.password);
        
        // Clean up previous test data
        cy.cleanupTodosViaApi();
      });
    });
  
    it('should persist todos across page refreshes', () => {
      cy.visit('/');
      
      // Create a new todo
      const todoText = 'Persistence test todo ' + Date.now();
      cy.createTodo(todoText);
      
      // Refresh the page
      cy.reload();
      
      // Verify todo is still there after refresh
      cy.contains(todoText).should('exist');
    });
  
    it('should persist todo state (completed) across page refreshes', () => {
      cy.visit('/');
      
      // Create a new todo
      const todoText = 'State persistence test ' + Date.now();
      cy.createTodo(todoText);
      
      // Mark as completed
      cy.toggleFirstTodo();
      
      // Verify todo is marked as completed
      cy.contains(todoText)
        .parents('[data-testid=todo-item]')
        .should('have.class', 'completed');
      
      // Refresh the page
      cy.reload();
      
      // Verify completed state persists
      cy.contains(todoText)
        .parents('[data-testid=todo-item]')
        .should('have.class', 'completed');
    });
  
    it('should delete todos from the database', () => {
      cy.visit('/');
      
      // Create a new todo
      const todoText = 'Delete persistence test ' + Date.now();
      cy.createTodo(todoText);
      
      // Delete the todo
      cy.deleteFirstTodo();
      
      // Refresh the page
      cy.reload();
      
      // Verify todo is still deleted
      cy.contains(todoText).should('not.exist');
    });
  
    it('should maintain user-specific todo isolation', () => {
      // First user creates a todo
      cy.fixture('../../fixtures/users').then((users) => {
        const user1 = users.validUser;
        const todoText = 'User isolation test ' + Date.now();
        
        // Login as first user
        cy.login(user1.email, user1.password);
        
        // Create a todo as first user
        cy.createTodo(todoText);
        
        // Verify todo exists
        cy.contains(todoText).should('exist');
        
        // Logout
        cy.logout();
        
        // Create and login as second user
        const user2Email = `isolation${Date.now()}@example.com`;
        const user2Name = 'Isolation Test User';
        const user2Password = '123456';
        
        // Register second user
        cy.register(user2Name, user2Email, user2Password);
        
        // Check that the first user's todo is not visible to second user
        cy.contains(todoText).should('not.exist');
        cy.get('[data-testid=no-todos]').should('be.visible');
      });
    });
  
    it('should properly update data when modifying todos', () => {
      cy.visit('/');
      
      // Create a todo via API for more controlled testing
      const todoText = 'Update test ' + Date.now();
      cy.createTestTodoViaApi(todoText).then((response) => {
        const todoId = response.body._id;
        
        // Reload to see the new todo
        cy.reload();
        
        // Verify the todo exists
        cy.contains(todoText).should('exist');
        
        // Update the todo via API
        const token = JSON.parse(localStorage.getItem('user')).token;
        cy.request({
          method: 'PUT',
          url: `${Cypress.env('apiUrl')}/todos/${todoId}`,
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: {
            completed: true
          }
        }).then(() => {
          // Reload to see the update
          cy.reload();
          
          // Verify the todo is now completed
          cy.contains(todoText)
            .parents('[data-testid=todo-item]')
            .should('have.class', 'completed');
        });
      });
    });
  });