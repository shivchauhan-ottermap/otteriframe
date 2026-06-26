import MowCanvas from "./MowCanvas";
import { HERO_META } from "./trraData";

export default function Hero() {
  return (
    <section className="trra-hero">
      <MowCanvas />
      <div className="trra-hero-inner">
        <div className="trra-eyebrow">Ottermap × TerraSync · Internship · Round 2</div>
        <h1>
          Build the
          <br />
          <em>Velocity Zone Manager</em>
        </h1>
        <p className="trra-hero-sub">
          A full-stack technical task set in the real world of robotic mower fleet management. You're not building a
          demo — you're building the kind of thing that ships on Day 1.
        </p>
        <div className="trra-hero-meta">
          {HERO_META.map((chip) => (
            <span key={chip.strong} className="trra-meta-chip">
              <strong>{chip.strong}</strong>
              {chip.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
