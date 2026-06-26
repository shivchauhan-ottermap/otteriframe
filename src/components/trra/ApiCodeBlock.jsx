export default function ApiCodeBlock() {
  return (
    <div className="trra-code-block">
      <span className="cm"># Auth</span>
      {"\n"}
      <span className="kw">POST</span> <span className="pt">/auth/signup</span>
      {"\n"}
      <span className="kw">POST</span> <span className="pt">/auth/login</span>
      {"\n\n"}
      <span className="cm"># Properties</span>
      {"\n"}
      <span className="kw">GET</span> <span className="pt">/properties</span>
      {"\n"}
      <span className="kw">POST</span> <span className="pt">/properties</span>
      {"\n"}
      <span className="kw">GET</span> <span className="pt">/properties/:id</span>
      {"\n"}
      <span className="kw">PUT</span> <span className="pt">/properties/:id</span>
      {"\n"}
      <span className="kw">DELETE</span> <span className="pt">/properties/:id</span>
      {"\n\n"}
      <span className="cm"># Zones</span>
      {"\n"}
      <span className="kw">GET</span> <span className="pt">/properties/:id/zones</span>
      {"\n"}
      <span className="kw">POST</span> <span className="pt">/properties/:id/zones</span>
      {"\n"}
      <span className="kw">PUT</span> <span className="pt">/properties/:id/zones/:zone_id</span>
      {"\n"}
      <span className="kw">DELETE</span> <span className="pt">/properties/:id/zones/:zone_id</span>
      {"\n"}
      <span className="kw">GET</span> <span className="pt">/properties/:id/zones/summary</span> <span className="cm">→ TER-S02</span>
      {"\n"}
      <span className="kw">GET</span> <span className="pt">/properties/:id/zones/export</span> <span className="cm">→ GeoJSON FeatureCollection</span>
      {"\n"}
      <span className="kw">POST</span> <span className="pt">/properties/:id/zones/import</span> <span className="cm">→ accepts GeoJSON FeatureCollection</span>
    </div>
  );
}
