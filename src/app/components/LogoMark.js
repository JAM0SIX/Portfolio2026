import Link from "next/link";

export default function LogoMark() {
  return (
    <Link href="/" className="logo-mark" aria-label="Harry.S — back to home">
      <span className="logo-square" aria-hidden="true">
        <span className="d" /><span className="d" /><span className="d" />
        <span className="d" /><span className="d" /><span className="d" />
        <span className="d" /><span className="d" /><span className="d" />
      </span>
    </Link>
  );
}
