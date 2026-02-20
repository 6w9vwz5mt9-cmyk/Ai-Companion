const BLOCKLIST = [
  "nude","naked","sex","porn","blowjob","handjob","anal","cum","dick","pussy",
  "rape","incest","underage","minor","child","teen","loli"
];

export function isExplicit(text: string) {
  const t = text.toLowerCase();
  return BLOCKLIST.some(w => t.includes(w));
}

export function safeAssistantRefusal() {
  return "I can do romance and affection, but I can’t do explicit sexual content or anything involving minors. If you want, we can keep it sweet and romantic—tell me what kind of vibe you’d like.";
}
