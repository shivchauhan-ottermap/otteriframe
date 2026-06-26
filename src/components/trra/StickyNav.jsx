import { NAV_LINKS } from "./trraData";

export default function StickyNav({ visible }) {
  return (
    <nav className={`trra-sticky-nav${visible ? " visible" : ""}`}>
      <span className="trra-nav-brand">Ottermap × TerraSync — Round 2</span>
      <div className="trra-nav-links">
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
