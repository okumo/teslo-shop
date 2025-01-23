export const generatePagination = (currentPage: number, totalPages: number) => {
  //Si el número total de páginas es 7 o menos
  // vamos a mostrar todas las páginas sin puntos suspensivos

  if (totalPages < 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Si la página actual está entre las 3 primeras páginas
  // mostrar las primeras 3, punros suspensivos, y luego las últimas 2

  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // si la página actual está entre las 3 últimas páginas
  // mostrar las 2 primeras, puntos suspensivos, y luego las 3 últimas
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // si la página acttual está en otro lugar medio
  // mostrar la primera página, puntos suspensivos, la página actual y vecinos

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};
