import { QueryResult } from 'pg';

describe('FAQ', () => {
  const getFaqList = () => {
    return cy
      .task<QueryResult>('connectDB', 'SELECT * FROM public.faq')
      .then((res) => {
        return res.rows;
      });
  };

  const getFaqListPublished = () => {
    return cy
      .task<QueryResult>(
        'connectDB',
        'SELECT * FROM public.faq WHERE "isPublished" = true',
      )
      .then((res) => {
        return res.rows;
      });
  };

  const openFaqItemMenuAndSelect = (faqItemIndex: number, menuItem: string) => {
    cy.getCyEl('faq-item')
      .eq(faqItemIndex)
      .find('[data-cy="faq-item-menu-button"]')
      .click();

    cy.getCyEl('faq-item')
      .eq(faqItemIndex)
      .find('.p-menuitem')
      .contains(menuItem)
      .click();
  };

  describe('Users', () => {
    beforeEach(() => {
      cy.signInAsUser();

      cy.getCyEl('menu-item').contains('Запитання та відповіді').click();
      cy.contains('h4', 'Запитання та відповіді');
    });

    it('Visit FAQ page and check initial FAQ items', () => {
      cy.getCyEl('add-faq-button').should('not.exist');
      cy.getCyEl('save-faq-order-button').should('not.exist');

      getFaqListPublished().then((faqList) => {
        cy.getCyEl('faq-item').should('have.length', faqList.length);
      });
    });
  });

  describe('Admins', () => {
    const data = [
      {
        role: 'SuperAdmin',
        signInMethod: cy.signInAsSuperAdmin,
      },
      {
        role: 'Admin',
        signInMethod: cy.signInAsAdmin,
      },
    ];

    data.forEach((item) => {
      describe(`As ${item.role}`, () => {
        beforeEach(() => {
          item.signInMethod();

          cy.getCyEl('menu-item').contains('Запитання та відповіді').click();
          cy.contains('h4', 'Запитання та відповіді');
        });

        it('Visit FAQ page and check initial FAQ items', () => {
          cy.getCyEl('add-faq-button').should('exist');
          cy.getCyEl('save-faq-order-button').should('exist');

          getFaqList().then((faqList) => {
            cy.getCyEl('faq-item').should('have.length', faqList.length);
          });
        });

        it('Create new FAQ item', () => {
          cy.getCyEl('add-faq-button').click();

          cy.getCyEl('faq-question-input').type(
            `New FAQ question ${Date.now()}`,
          );
          cy.getCyEl('faq-answer-input').type(`New FAQ answer ${Date.now()}`);

          cy.getCyEl('save-faq-button').click();

          getFaqList().then((faqList) => {
            cy.getCyEl('faq-item').should('have.length', faqList.length);
          });
        });

        it('Edit new FAQ item', () => {
          const updatedFaqData = {
            question: `Updated FAQ question ${Date.now()}`,
            answer: `Updated FAQ answer ${Date.now()}`,
          };

          openFaqItemMenuAndSelect(0, 'Редагувати');

          cy.getCyEl('faq-question-input')
            .clear()
            .type(updatedFaqData.question);
          cy.getCyEl('faq-answer-input').clear().type(updatedFaqData.answer);

          cy.getCyEl('save-faq-button').click();

          cy.getCyEl('faq-item').first().contains(updatedFaqData.question);
          cy.getCyEl('faq-item').first().contains(updatedFaqData.answer);
        });

        it('Publish new FAQ item', () => {
          getFaqListPublished().then((cachedPublishedFaqList) => {
            cy.getCyEl('faq-item').then((faqItems) => {
              const faqItemsCount = faqItems.length;

              openFaqItemMenuAndSelect(faqItemsCount - 1, 'Опублікувати');
              cy.get('.p-confirm-dialog-accept').click();
            });

            getFaqListPublished().then((faqList) => {
              expect(faqList.length).to.be.greaterThan(
                cachedPublishedFaqList.length,
              );
            });
          });
        });

        it('Unpublish new FAQ item', () => {
          getFaqListPublished().then((cachedPublishedFaqList) => {
            cy.getCyEl('faq-item').then((faqItems) => {
              const faqItemsCount = faqItems.length;

              openFaqItemMenuAndSelect(faqItemsCount - 1, 'Приховати');
              cy.get('.p-confirm-dialog-accept').click();
            });

            getFaqListPublished().then((faqList) => {
              expect(faqList.length).to.be.lessThan(
                cachedPublishedFaqList.length,
              );
            });
          });
        });
      });
    });
  });
});
