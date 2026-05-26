export function getScatterPosition(index: number) {
  const angle = index * 2.399963229728653;
  const radius = 4 + Math.sqrt(index) * 2.2;

  return { x: Math.cos(angle) * radius, y: 0, z: Math.sin(angle) * radius };
}

export function createNameSlug(displayName: string) {
  return (
    displayName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "guest"
  );
}
