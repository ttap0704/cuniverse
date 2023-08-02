"use client";

import Link from "next/link";

function WrongApproach() {
  return (
    <div className="wrong-approach">
      <p>올바른 접근이 아닙니다.</p>
      <Link href="/">HOME</Link>
    </div>
  );
}

export default WrongApproach;
