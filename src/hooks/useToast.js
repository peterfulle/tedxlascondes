// src/hooks/useToast.js
import { useState } from 'react';

export const useToast = () => {
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });
  
  const showToast = (message, type = 'info') => {
    setToast({ visible: true, message, type });
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };
  
  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };
  
  return { toast, showToast, hideToast };
};