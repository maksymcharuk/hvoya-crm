// Returns an array of unique objects based on condition
export function uniqueObjectsArray<T extends object>(
  arr: T[],
  condition: (currentEntity: T, nextEntity: T) => boolean,
): T[] {
  return arr.filter(
    (nextEntity, i, self) =>
      i ===
      self.findIndex((currentEntity) => condition(currentEntity, nextEntity)),
  );
}
