export function getUniqueObjectsByKey<T>(arr: T[], key: keyof T): T[] {
  // create a new Map to hold unique objects
  const uniqueObjects = new Map<T[keyof T], any>();

  // loop through the array of objects
  for (let obj of arr) {
    // get the value of the key for the current object
    const value = obj[key];

    // if the value doesn't exist in the Map,
    // add it with the object as its value
    if (!uniqueObjects.has(value)) {
      uniqueObjects.set(value, obj);
    }
  }

  // create an array of the unique objects
  return Array.from(uniqueObjects.values());
}
