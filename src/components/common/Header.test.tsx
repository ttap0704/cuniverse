// import { fireEvent, render, screen } from "@testing-library/react";
// import Header from "./Header";
// import * as ReactQuery from "@tanstack/react-query";
// import ProviderQueryClient from "../providers/ProviderQueryClient";

// // setTimeout 등 타이머 jest로 대체
// jest.useFakeTimers();

// window.open = jest.fn();
// // useRouter mock 처리
// jest.mock("next/navigation", () => ({
//   ...require("next-router-mock"),
//   useSearchParams: () => jest.fn(),
// }));

// // react-query mock 처리
// jest.mock("@tanstack/react-query", () => {
//   const original: typeof ReactQuery = jest.requireActual(
//     "@tanstack/react-query"
//   );

//   return {
//     ...original,
//     useQuery: () => ({ isLoading: false, error: {}, data: [] }),
//   };
// });

// describe("<Header />", () => {
//   beforeEach(() => {
//     render(
//       // react-query 테스트 위한 provider
//       <ProviderQueryClient>
//         <Header />
//       </ProviderQueryClient>
//     );
//   });

//   it("1. 로고를 클릭하면 Root페이지로 이동", () => {
//     const headerAnchor = screen.getByTestId("header-anchor");
//     expect(headerAnchor).toHaveAttribute("href", "/");
//   });

//   it("2. 메뉴 드랍다운 생성", () => {
//     const headerMenu = screen.getByTestId("header-menu");
//     fireEvent.click(headerMenu);

//     const dropdownMenu = screen.getByTestId("dropdown-menu-wrapper");
//     expect(dropdownMenu.children.length).toEqual(2);
//   });
// });
