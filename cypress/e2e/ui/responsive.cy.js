// Tests for UI elements and responsive design

describe('UI Tests', () => {
    beforeEach(() => {
      cy.clearLocalStorage();
      cy.visit('/');
    });
  
    it('should have correct header elements when not logged in', () => {
      cy.get('.header').within(() => {
        cy.contains('Todo App');
        cy.get('[data-testid=login-link]').should('be.visible');
        cy.get('[data-testid=register-link]').should('be.visible');
        cy.get('[data-testid=logout-button]').should('not.exist');
      });
    });
  
    it('should have correct header elements when logged in', () => {
      cy.fixture('../../fixtures/users').then((users) => {
        const testUser = users.validUser;
        
        // Login
        cy.login(testUser.email, testUser.password);
        
        // Check header after login
        cy.get('.header').within(() => {
          cy.contains('Todo App');
          cy.get('[data-testid=login-link]').should('not.exist');
          cy.get('[data-testid=register-link]').should('not.exist');
          cy.get('[data-testid=logout-button]').should('be.visible');
        });
      });
    });
  
    it('should correctly display form validation', () => {
      // Test form validation on the login form
      cy.visit('/login');
      cy.get('[data-testid=login-submit]').click();
      
      // Check HTML5 validation messages for required fields
      cy.get('[data-testid=email-input]').then($el => {
        expect($el[0].validationMessage).to.not.be.empty;
      });
    });
  
    it('should display responsive layout on different viewports', () => {
      // Test on mobile viewport
      cy.viewport('iphone-x');
      cy.visit('/login');
      cy.get('[data-testid=login-form]').should('be.visible');
      cy.get('.container').should('have.css', 'padding');
      
      // Test on tablet viewport
      cy.viewport('ipad-2');
      cy.get('[data-testid=login-form]').should('be.visible');
      
      // Test on desktop viewport
      cy.viewport('macbook-15');
      cy.get('[data-testid=login-form]').should('be.visible');
    });
  
    it('should have proper styling on todo items', () => {
      cy.fixture('../../fixtures/users').then((users) => {
        const testUser = users.validUser;
        
        // Login
        cy.login(testUser.email, testUser.password);
        
        // Create a todo for testing
        const todoText = 'UI test todo ' + Date.now();
        cy.createTodo(todoText);
        
        // Check styling on todo item
        cy.contains(todoText)
          .parents('[data-testid=todo-item]')
          .should('have.css', 'display', 'flex')
          .should('have.css', 'background-color')
      });
    });
  });