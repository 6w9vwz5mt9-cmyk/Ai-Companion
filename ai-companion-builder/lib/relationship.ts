export type RelationshipLevel = "Stranger"|"Friend"|"Crush"|"Girlfriend"|"Partner";

export function levelForMessages(messagesSent: number): RelationshipLevel {
  if (messagesSent >= 400) return "Partner";
  if (messagesSent >= 150) return "Girlfriend";
  if (messagesSent >= 50) return "Crush";
  if (messagesSent >= 10) return "Friend";
  return "Stranger";
}
