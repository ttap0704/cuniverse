"use client";

import Link from "next/link";

// 사용자가 잘못 접근하였을 때 사용되는 Component
function WrongApproach({ text }: { text?: string }) {
  return (
    <div className="wrong-approach">
      <p>{text ?? "올바른 접근이 아닙니다."}</p>
      <Link href="/">HOME</Link>
    </div>
  );
}

export default WrongApproach;
