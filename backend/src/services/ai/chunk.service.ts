export const chunkText = (text: string): string[] => {
  if (!text.trim()) return [];

  // Simple MVP: one note = one chunk
  return [text];
};