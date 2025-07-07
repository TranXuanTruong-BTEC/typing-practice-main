describe('Typing Practice App', () => {
    it('Truy cập trang chủ, tìm kiếm và luyện tập', () => {
      cy.visit('http://localhost:3000');
      cy.contains('Luyện gõ phím');
      cy.get('input[placeholder="Tìm kiếm bài luyện tập..."]').type('Công nghệ');
      cy.contains('Công nghệ thông tin').click();
      cy.contains('Bắt đầu').click();
      cy.get('textarea').type('Công nghệ thông tin đã thay đổi cách chúng ta sống');
      cy.contains('Tiến độ');
    });
  
    it('Chọn bài, chọn chế độ toàn bộ nội dung và luyện tập', () => {
      cy.visit('http://localhost:3000');
      cy.get('input[placeholder="Tìm kiếm bài luyện tập..."]').type('Công nghệ');
      cy.contains('Công nghệ thông tin').click();
      cy.contains('Xác nhận & Bắt đầu').click();
      cy.contains('Bắt đầu');
      cy.get('textarea').type('Công nghệ thông tin đã thay đổi cách chúng ta sống');
      cy.contains('Tiến độ');
    });
  
    it('Chọn bài, chọn chế độ theo thời gian, luyện tập và kiểm tra hết thời gian', () => {
      cy.visit('http://localhost:3000');
      cy.get('input[placeholder="Tìm kiếm bài luyện tập..."]').type('Công nghệ');
      cy.contains('Công nghệ thông tin').click();
      cy.get('[data-cy="practice-mode-select"]').select('Theo thời gian');
      cy.get('input[type="number"]').clear().type('5');
      cy.contains('Xác nhận & Bắt đầu').click();
      cy.contains('Bắt đầu').click();
      cy.wait(6000); // chờ hết 5s
      cy.contains('Hết thời gian!');
    });
  
    it('Chọn bài, chọn chế độ theo thời gian, hoàn thành trước thời gian', () => {
      cy.visit('http://localhost:3000');
      cy.get('input[placeholder="Tìm kiếm bài luyện tập..."]').type('Công nghệ');
      cy.contains('Công nghệ thông tin').click();
      cy.get('[data-cy="practice-mode-select"]').select('Theo thời gian');
      cy.get('input[type="number"]').clear().type('30');
      cy.contains('Xác nhận & Bắt đầu').click();
      cy.contains('Bắt đầu').click();
      cy.get('textarea').type('Công nghệ thông tin đã thay đổi cách chúng ta sống và làm việc. Internet kết nối mọi người trên toàn thế giới. Máy tính và điện thoại thông minh trở thành công cụ không thể thiếu trong cuộc sống hiện đại.');
      cy.contains('Chúc mừng!');
    });
  
    it('Chọn bài, chọn chế độ theo độ dài, luyện tập và hoàn thành', () => {
      cy.visit('http://localhost:3000');
      cy.get('input[placeholder="Tìm kiếm bài luyện tập..."]').type('Công nghệ');
      cy.contains('Công nghệ thông tin').click();
      cy.get('[data-cy="practice-mode-select"]').select('Theo độ dài');
      cy.get('input[type="number"]').clear().type('20');
      cy.contains('Xác nhận & Bắt đầu').click();
      cy.contains('Bắt đầu').click();
      cy.get('textarea').type('Công nghệ thông tin đã');
      cy.contains('Chúc mừng!');
    });
  
    it('Truy cập trang admin, thêm và xóa bài tập', () => {
      cy.visit('http://localhost:3000/admin');
      cy.get('[data-cy="admin-title"]').should('be.visible').type('Test bài mới');
      cy.get('[data-cy="admin-text"]').type('Đây là nội dung test.');
      cy.get('[data-cy="admin-category"]').select(1);
      cy.get('[data-cy="admin-language"]').select(1);
      cy.get('[data-cy="admin-difficulty"]').select('easy');
      cy.get('[data-cy="admin-submit"]').click();
      cy.contains('Thêm thành công!');
      cy.contains('Test bài mới');
      cy.contains('Test bài mới').parent().parent().find('button').contains('Xóa').click();
      cy.contains('Đã xóa!');
    });
  
    it('Kiểm tra responsive trên mobile', () => {
      cy.viewport('iphone-6');
      cy.visit('http://localhost:3000');
      cy.get('input[placeholder="Tìm kiếm bài luyện tập..."]').should('be.visible');
      cy.contains('Luyện gõ phím');
    });

    it('Tìm kiếm không dấu và filter', () => {
      cy.visit('http://localhost:3000');
      cy.get('input[placeholder="Tìm kiếm bài luyện tập..."]').type('cong nghe');
      cy.contains('Công nghệ thông tin');
      cy.get('[data-cy="category-select"]').select('Công nghệ');
      cy.get('[data-cy="language-select"]').select('vi');
      cy.get('[data-cy="difficulty-select"]').select('easy');
      cy.contains('Công nghệ thông tin');
    });

    it('Thêm, sửa, xóa bài tập ở admin', () => {
      cy.visit('http://localhost:3000/admin');
      cy.get('[data-cy="admin-title"]').type('Test bài mới');
      cy.get('[data-cy="admin-text"]').type('Đây là nội dung test.');
      cy.get('[data-cy="admin-category"]').select(1);
      cy.get('[data-cy="admin-language"]').select(1);
      cy.get('[data-cy="admin-difficulty"]').select('easy');
      cy.get('[data-cy="admin-submit"]').click();
      cy.contains('Thêm thành công!');
      cy.contains('Test bài mới');
      cy.contains('Test bài mới').parent().parent().find('button').contains('Sửa').click();
      cy.get('[data-cy="admin-title"]').clear().type('Test bài sửa');
      cy.get('[data-cy="admin-submit"]').click();
      cy.contains('Sửa thành công!');
      cy.contains('Test bài sửa').parent().parent().find('button').contains('Xóa').click();
      cy.contains('Đã xóa!');
    });

    it('Kiểm tra lịch sử luyện tập', () => {
      cy.visit('http://localhost:3000/history');
      cy.contains('Lịch sử luyện tập & Biểu đồ tiến bộ');
      cy.get('table tbody tr').should('have.length.greaterThan', 0);
    });

    it('Kiểm tra leaderboard', () => {
      cy.visit('http://localhost:3000');
      cy.get('input[placeholder="Tìm kiếm bài luyện tập..."]').type('Công nghệ');
      cy.contains('Công nghệ thông tin').click();
      cy.contains('Xác nhận & Bắt đầu').click();
      cy.contains('Bắt đầu').click();
      cy.get('textarea').type('Công nghệ thông tin đã thay đổi cách chúng ta sống và làm việc. Internet kết nối mọi người trên toàn thế giới. Máy tính và điện thoại thông minh trở thành công cụ không thể thiếu trong cuộc sống hiện đại.');
      cy.contains('Chúc mừng!');
      cy.contains('Bảng xếp hạng').click();
      cy.contains('Bảng xếp hạng');
    });

    it('Kiểm tra UI/UX điều hướng', () => {
      cy.visit('http://localhost:3000');
      cy.contains('Chọn bài');
      cy.contains('Bảng xếp hạng').click();
      cy.contains('Bảng xếp hạng');
      cy.contains('Chọn bài').click();
      cy.contains('Luyện gõ phím');
    });
  });