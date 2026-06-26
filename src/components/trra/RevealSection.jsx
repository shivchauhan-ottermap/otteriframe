import useReveal from "./useReveal";

export default function RevealSection({ id, className = "", children }) {
  const ref = useReveal();

  return (
    <section ref={ref} id={id} className={`trra-section trra-reveal${className ? ` ${className}` : ""}`}>
      {children}
    </section>
  );
}
