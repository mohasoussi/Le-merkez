/** URL publique d'un média téléversé (uniquement les clés « public/… », servies par /media). */
export function mediaUrl(key: string) {
  return `/media/${key.replace(/^public\//, "")}`;
}
