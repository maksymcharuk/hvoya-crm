export function findOptimalDimensions(
  boxes: { width: number; height: number; depth: number }[],
): [number, number, number] {
  // Recursive function to find optimal dimensions
  function packBoxes(
    remainingBoxes: { width: number; height: number; depth: number }[],
  ) {
    if (remainingBoxes.length === 0) {
      // Base case: No more boxes to pack
      return [0, 0, 0];
    }

    let bestVolume = Infinity;
    let bestDimensions = [Infinity, Infinity, Infinity];

    for (let i = 0; i < remainingBoxes.length; i++) {
      const currentBox = remainingBoxes[i]!;

      const restOfBoxes = remainingBoxes
        .slice(0, i)
        .concat(remainingBoxes.slice(i + 1));

      const [packedDepth, packedWidth, packedHeight] = packBoxes(restOfBoxes);

      // Try all three orientations for the current box
      const orientations = [
        [currentBox.width, currentBox.height, currentBox.depth],
        [currentBox.width, currentBox.depth, currentBox.height],
        [currentBox.height, currentBox.width, currentBox.depth],
      ];

      for (const [w, h, d] of orientations) {
        const newVolume =
          w! * h! * d! +
          packedDepth! * Math.max(packedWidth!, d!) +
          packedHeight!;
        if (newVolume < bestVolume) {
          bestVolume = newVolume;
          bestDimensions = [
            w! + packedDepth!,
            Math.max(h!, d!, packedWidth!),
            Math.max(h!, d!) + packedHeight!,
          ];
        }
      }
    }

    return bestDimensions;
  }

  // Call the recursive function with the initial array of boxes
  const [depth, width, height] = packBoxes(boxes);

  return [depth!, width!, height!];
}
