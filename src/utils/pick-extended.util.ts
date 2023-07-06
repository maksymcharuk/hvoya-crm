import { get, isArray, map, merge, pick, set } from 'lodash';

export function pickExtended<T>(object: T, paths: string[]): T {
  return paths.reduce((result, path) => {
    if (path.includes('[].')) {
      const [collectionPath, itemPath] = path.split(/\[]\.(.+)/);
      const collection = get(object, collectionPath!);

      if (!isArray(collection)) {
        return result;
      }

      const partialResult = {};
      set(
        partialResult,
        collectionPath!,
        map(collection, (item) => pickExtended(item, [itemPath!])),
      );

      return merge(result, partialResult);
    }

    return merge<T, Partial<T>>(result as T, pick(object, [path]));
  }, {} as T);
}
