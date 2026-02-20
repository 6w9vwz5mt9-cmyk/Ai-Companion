export const PHOTO_COST = 5;

export function canAfford(balance: number, cost: number) {
  return balance >= cost;
}
