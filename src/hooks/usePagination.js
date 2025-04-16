// src/hooks/usePagination.js
import { useState, useEffect } from 'react';

export const usePagination = (items, itemsPerPageParam = 5) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(itemsPerPageParam);
  
  // Recalcular cuando cambien los items
  useEffect(() => {
    // Resetear a la primera página si hay menos elementos que antes
    if (items.length > 0 && currentPage > Math.ceil(items.length / itemsPerPage)) {
      setCurrentPage(1);
    }
  }, [items, currentPage, itemsPerPage]);
  
  // Calcular índices
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  // Obtener items actuales
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  
  // Calcular total de páginas
  const totalPages = Math.ceil(items.length / itemsPerPage);
  
  return {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    currentItems,
    totalPages,
    indexOfFirstItem,
    indexOfLastItem
  };
};