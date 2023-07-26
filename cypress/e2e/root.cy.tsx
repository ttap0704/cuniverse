describe("지갑 연결 테스트", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("1. CONNECT WALLET 버튼 클릭", () => {
    cy.get("[data-testid=header-connect-wallet]").click();
  });
});

export {};
