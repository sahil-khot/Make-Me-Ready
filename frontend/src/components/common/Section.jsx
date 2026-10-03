import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Icon } from "./Icon.jsx";

export const Section = ({
  title,
  icon,
  to = "#",
  sub,
  children,
  right,
}) => (
  <section className="mt-12 animate-up">
    <div className="flex items-end justify-between mb-5">
      <div>
        <h2 className="h2 flex items-center gap-3">
          {icon && <Icon n={icon} className="text-acc" size={22} />}
          {title}
        </h2>
        {sub && <p className="text-sm text-mute mt-1">{sub}</p>}
      </div>
      {right || (
        <Link
          to={to}
          className="text-sm text-acc flex items-center gap-1 hover:gap-2 transition-all"
        >
          View All <ArrowRight size={15} />
        </Link>
      )}
    </div>
    {children}
  </section>
);
