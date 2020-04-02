import { AxiosRequestConfig } from "axios";

type Method =
  | "get"
  | "GET"
  | "delete"
  | "DELETE"
  | "head"
  | "HEAD"
  | "options"
  | "OPTIONS"
  | "post"
  | "POST"
  | "put"
  | "PUT"
  | "patch"
  | "PATCH"
  | "link"
  | "LINK"
  | "unlink"
  | "UNLINK"
  | undefined;

export const axiosCfgGen = (token: string) => (
  path: string,
  method: Method = "get"
) =>
  ({
    method,
    url: "https://api.github.com" + path,
    headers: {
      accept: "application/json",
      Authorization: `token ${token}`
    }
  } as AxiosRequestConfig);

export function genUUID() {
  let date = new Date().getTime();
  let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    let r = (date + Math.random() * 16) % 16 | 0;
    date = Math.floor(date / 16);
    return (c === "x" ? r : (r & 0x7) | 0x8).toString(16);
  });
  return uuid;
}

export function hasSame<T>(it: Iterable<T>) {
  const set = new Set<T>();
  for (const v of it) {
    if (set.has(v)) {
      return false;
    }
    set.add(v);
  }
  return true;
}
export function addByKey<K>(m: Map<K, number>, k: K, n: number) {
  let originN = m.get(k);
  if (originN === undefined) {
    m.set(k, n);
  } else if (originN + n === 0) {
    m.delete(k);
  } else {
    m.set(k, originN + n);
  }
}
export function addMap<K>(beAdded: Map<K, number>,add:Map<K, number>){
  for (const [k, v] of add) {
    if (beAdded.has(k)) {
      let sum = v + beAdded.get(k)!;
      if (sum === 0) {
        beAdded.delete(k);
      } else {
        beAdded.set(k, sum);
      }
    } else {
      beAdded.set(k, v);
    }
  }
}
export function diffSet<K>(before: Set<K> | null, after: Set<K> | null) {
  let diff = new Map<K, number>();
  after?.forEach(k => { diff.set(k, 1); });
  before?.forEach(k => {
    if (diff.has(k)) {
      diff.delete(k);
    } else {
      diff.set(k, -1);
    }
  });
  return diff;
}
export function setCout<T>(s: Map<T, number>, key: T, n: number) {
  if (!s.has(key)) {
    s.set(key, n);
    return true;
  }
  if (s.get(key)! + n === 0) {
    s.delete(key);
    return true;
  }
  s.set(key, s.get(key)! + n);
  return false;
}
