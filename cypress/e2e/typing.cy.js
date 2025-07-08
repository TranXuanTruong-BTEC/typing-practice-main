// ... existing code ...

describe('Real-time Chat', () => {
  const userA = { username: 'testuserA', password: 'test123A' };
  const userB = { username: 'testuserB', password: 'test123B' };
  const messageA = 'Xin chào từ A!';
  const messageB = 'Chào lại từ B!';

  before(() => {
    // Đăng ký 2 tài khoản nếu chưa có
    cy.request('POST', 'http://localhost:3000/api/register', { username: userA.username, password: userA.password, gmail: userA.username + '@mail.com' });
    cy.request('POST', 'http://localhost:3000/api/register', { username: userB.username, password: userB.password, gmail: userB.username + '@mail.com' });
  });

  it('User A gửi tin nhắn, User B nhận real-time', () => {
    // Mở 2 tab song song (Cypress hỗ trợ cy.origin/cy.session)
    cy.visit('/');
    cy.window().then(winA => {
      // Đăng nhập User A
      cy.get('input[name="username"]').type(userA.username);
      cy.get('input[name="password"]').type(userA.password);
      cy.get('button[type="submit"]').click();
      // Tạo hội thoại với User B
      cy.contains('Nhắn tin mới').click();
      cy.get('input[placeholder*="Tìm username"]').type(userB.username);
      cy.contains(userB.username).click();
      // Gửi tin nhắn
      cy.get('input[placeholder="Nhập tin nhắn..."]').type(messageA);
      cy.contains('Gửi').click();
      // Kiểm tra tin nhắn xuất hiện
      cy.contains(messageA).should('exist');

      // Mở tab mới cho User B
      cy.origin(winA.location.origin, () => {
        cy.visit('/');
        cy.get('input[name="username"]').type(userB.username);
        cy.get('input[name="password"]').type(userB.password);
        cy.get('button[type="submit"]').click();
        // Chọn hội thoại với User A
        cy.contains(userA.username).click();
        // Kiểm tra tin nhắn từ A xuất hiện
        cy.contains(messageA).should('exist');
        // Gửi lại tin nhắn
        cy.get('input[placeholder="Nhập tin nhắn..."]').type(messageB);
        cy.contains('Gửi').click();
        cy.contains(messageB).should('exist');
      });
    });
  });
});
// ... existing code ...