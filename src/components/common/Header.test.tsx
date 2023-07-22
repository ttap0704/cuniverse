import { getByTestId, render, screen } from "@testing-library/react";

import Header from "./Header";

describe("<Header />", () => {
  beforeEach(() => {
    render(<Header />);
  });

  it("로고를 클릭하면 Root페이지로 이동", () => {
    const headerAnchor = screen.getByTestId("header-anchor");
    expect(headerAnchor).toHaveAttribute("href", "/");
  });
});
