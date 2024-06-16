import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to={'/'} className="font-semibold text-2xl">
      <span className="text-dark-blue">exam</span>
      <span className="text-mid-blue">Ease</span>
    </Link>
  )
}
