export function isNewArrival(firstRegisteredAt: string, today = new Date()): boolean {
  const registered = new Date(firstRegisteredAt);
  const elapsedDays = Math.floor((today.getTime() - registered.getTime()) / 86_400_000);
  return elapsedDays >= 0 && elapsedDays < 30;
}
