export const generateQrMarkup = (text: string): string => {
  const size = 200;
  const modules = 21;
  const cellSize = size / (modules + 8);
  const padding = cellSize * 4;
  const seed = text.split('').reduce((acc, current) => acc + current.charCodeAt(0), 0);

  const randomAt = (index: number): number => {
    return ((seed * 9301 + 49297 + index * 7919) % 233280) / 233280;
  };

  let rects = '';

  for (let row = 0; row < modules; row += 1) {
    for (let column = 0; column < modules; column += 1) {
      const isFinder =
        (row < 7 && column < 7) ||
        (row < 7 && column >= modules - 7) ||
        (row >= modules - 7 && column < 7);

      if (isFinder || randomAt(row * modules + column) > 0.45) {
        rects += `<rect x="${padding + column * cellSize}" y="${padding + row * cellSize}" width="${cellSize}" height="${cellSize}" rx="1" />`;
      }
    }
  }

  return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg"><rect width="${size}" height="${size}" fill="white" rx="12"/><g fill="#150b26">${rects}</g></svg>`;
};

export const normalizeQuery = (value: string | null | undefined): string =>
  String(value ?? '')
    .trim()
    .toLowerCase();

export const getToneClasses = (tone: string): string => {
  switch (tone) {
    case 'gold':
      return 'border-[#ffd36c]/20 bg-[#ffd36c]/6 text-[#ffd36c]';
    case 'green':
      return 'border-[#5fe0b4]/20 bg-[#5fe0b4]/6 text-[#5fe0b4]';
    case 'blue':
      return 'border-[#62b7ff]/20 bg-[#62b7ff]/6 text-[#62b7ff]';
    case 'red':
      return 'border-[#ff7878]/20 bg-[#ff7878]/6 text-[#ff7878]';
    default:
      return 'border-[#ff70b8]/20 bg-[#ff70b8]/6 text-[#ff70b8]';
  }
};
