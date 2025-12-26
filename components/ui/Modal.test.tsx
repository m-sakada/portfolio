import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as fc from 'fast-check';
import Modal from './Modal';

// Generator for non-whitespace-only strings (for content that needs to be found by getByText)
const nonWhitespaceString = fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0);

describe('Modal Component Property Tests', () => {
  beforeEach(() => {
    // Reset document body overflow style before each test
    document.body.style.overflow = 'unset';
  });

  afterEach(() => {
    // Clean up after each test
    cleanup();
    document.body.style.overflow = 'unset';
    vi.clearAllMocks();
  });

  describe('Property 6: Modal Accessibility and Closability', () => {
    it('should be closable by all three methods and maintain focus trap for any modal state', async () => {
      /**
       * Feature: portfolio-site, Property 6: Modal Accessibility and Closability
       * Validates: Requirements 8.4, 8.5
       */
      const user = userEvent.setup();

      await fc.assert(
        fc.asyncProperty(
          fc.record({
            title: nonWhitespaceString,
            content: nonWhitespaceString,
            isOpen: fc.boolean(),
          }),
          async ({ title, content, isOpen }) => {
            // Clean up before each iteration
            cleanup();
            document.body.style.overflow = 'unset';
            
            const onClose = vi.fn();
            
            const { unmount } = render(
              <Modal isOpen={isOpen} onClose={onClose} title={title}>
                <div data-testid="modal-body-content">
                  {content}
                  <button>Test Button 1</button>
                  <button>Test Button 2</button>
                  <input type="text" placeholder="Test input" />
                </div>
              </Modal>
            );

            try {
              if (!isOpen) {
                // Modal should not be rendered when closed
                expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
                return;
              }

              // Modal should be rendered when open
              expect(screen.getByRole('dialog')).toBeInTheDocument();
              
              // Check title is in the modal header
              const modalTitle = screen.getByRole('heading', { level: 2 });
              // Use trim() to handle whitespace differences between generated title and rendered text
              expect(modalTitle.textContent?.trim()).toBe(title.trim());
              
              // Check content is in the modal body
              const modalBody = screen.getByTestId('modal-body-content');
              // Use textContent includes check since the body also contains buttons
              expect(modalBody.textContent).toContain(content.trim());

              // Test 1: Close button should work
              const closeButton = screen.getByLabelText('モーダルを閉じる');
              expect(closeButton).toBeInTheDocument();
              
              await user.click(closeButton);
              expect(onClose).toHaveBeenCalledTimes(1);
              
              // Reset mock for next test
              onClose.mockClear();

              // Test 2: Escape key should work
              fireEvent.keyDown(document, { key: 'Escape' });
              expect(onClose).toHaveBeenCalledTimes(1);
              
              // Reset mock for next test
              onClose.mockClear();

              // Test 3: Clicking overlay (the dialog element itself, not its children) should work
              const overlay = screen.getByRole('dialog');
              // Simulate clicking directly on the overlay (not on children)
              fireEvent.click(overlay);
              expect(onClose).toHaveBeenCalledTimes(1);

              // Test 4: Focus trap - Tab navigation should cycle through focusable elements
              const focusableElements = screen.getAllByRole('button').concat(
                screen.getAllByRole('textbox')
              );
              
              if (focusableElements.length > 1) {
                // Focus first element
                focusableElements[0].focus();
                expect(document.activeElement).toBe(focusableElements[0]);

                // Tab to next element
                await user.tab();
                expect(document.activeElement).toBe(focusableElements[1]);

                // Tab from last element should cycle to first
                focusableElements[focusableElements.length - 1].focus();
                await user.tab();
                expect(document.activeElement).toBe(focusableElements[0]);

                // Shift+Tab from first element should cycle to last
                focusableElements[0].focus();
                await user.tab({ shift: true });
                expect(document.activeElement).toBe(focusableElements[focusableElements.length - 1]);
              }

              // Test 5: Modal should have proper ARIA attributes
              const modal = screen.getByRole('dialog');
              expect(modal).toHaveAttribute('aria-modal', 'true');
              expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');
              expect(modalTitle).toHaveAttribute('id', 'modal-title');
            } finally {
              // Always clean up after each iteration
              unmount();
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should prevent clicks on modal content from closing the modal', async () => {
      /**
       * Feature: portfolio-site, Property 6: Modal Accessibility and Closability
       * Validates: Requirements 8.4, 8.5
       */
      const user = userEvent.setup();

      await fc.assert(
        fc.asyncProperty(
          fc.record({
            title: nonWhitespaceString,
            content: nonWhitespaceString,
          }),
          async ({ title, content }) => {
            // Clean up before each iteration
            cleanup();
            document.body.style.overflow = 'unset';
            
            const onClose = vi.fn();
            
            const { unmount } = render(
              <Modal isOpen={true} onClose={onClose} title={title}>
                <div data-testid="modal-content">
                  {content}
                  <button>Test Button</button>
                </div>
              </Modal>
            );

            try {
              // Clicking on modal content should NOT close the modal
              const modalContent = screen.getByTestId('modal-content');
              await user.click(modalContent);
              expect(onClose).not.toHaveBeenCalled();

              // Clicking on a button inside modal should NOT close the modal
              const button = screen.getByRole('button', { name: 'Test Button' });
              await user.click(button);
              expect(onClose).not.toHaveBeenCalled();

              // Clicking on the modal inner container (white box) should NOT close the modal
              // The inner container is the child of the dialog overlay
              const modalInnerContainer = screen.getByRole('dialog').querySelector('[tabindex="-1"]');
              if (modalInnerContainer) {
                await user.click(modalInnerContainer);
                expect(onClose).not.toHaveBeenCalled();
              }
            } finally {
              // Always clean up after each iteration
              unmount();
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle body scroll prevention when modal is open', async () => {
      /**
       * Feature: portfolio-site, Property 6: Modal Accessibility and Closability
       * Validates: Requirements 8.4, 8.5
       */
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            title: nonWhitespaceString,
            content: nonWhitespaceString,
          }),
          async ({ title, content }) => {
            // Clean up before each iteration
            cleanup();
            document.body.style.overflow = 'unset';
            
            const onClose = vi.fn();
            
            // Initially body should have normal overflow
            expect(document.body.style.overflow).toBe('unset');

            const { rerender, unmount } = render(
              <Modal isOpen={false} onClose={onClose} title={title}>
                <div>{content}</div>
              </Modal>
            );

            try {
              // Body overflow should still be normal when modal is closed
              expect(document.body.style.overflow).toBe('unset');

              // Open the modal
              rerender(
                <Modal isOpen={true} onClose={onClose} title={title}>
                  <div>{content}</div>
                </Modal>
              );

              // Body overflow should be hidden when modal is open
              await waitFor(() => {
                expect(document.body.style.overflow).toBe('hidden');
              });

              // Close the modal
              rerender(
                <Modal isOpen={false} onClose={onClose} title={title}>
                  <div>{content}</div>
                </Modal>
              );

              // Body overflow should be restored when modal is closed
              await waitFor(() => {
                expect(document.body.style.overflow).toBe('unset');
              });
            } finally {
              // Always clean up after each iteration
              unmount();
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});