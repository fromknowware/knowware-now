// The honest caption that travels with every story diagram, on the page and inside the GIF.
export function diagramCaption(o: { simulation?: boolean; alleged?: boolean }): string {
  if (o.simulation) return 'Diagram of a simulated scenario. No real people or systems were involved.';
  if (o.alleged) return 'Diagram of the allegation as described by the sources, not a finding.';
  return 'Diagram of the structure the sources describe. Not a recording.';
}
