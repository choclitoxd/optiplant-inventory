import React, { useState, useRef, useEffect } from 'react';
import { CaretDown } from '@phosphor-icons/react';

export interface DropdownOption {
  value: string | number;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  themeColor?: string;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Seleccionar...',
  themeColor = '#4f46e5', // Default a indigo-600
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Cerrar al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      className={`relative inline-block w-full text-left font-sans ${className}`} 
      ref={dropdownRef}
      style={{ '--theme-color': themeColor } as React.CSSProperties}
    >
      {/* Botón Principal */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2.5 bg-white border rounded-xl shadow-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-opacity-50"
        style={{ 
          borderColor: isOpen ? 'var(--theme-color)' : '#e2e8f0', // slate-200
          boxShadow: isOpen ? '0 4px 15px -3px color-mix(in srgb, var(--theme-color) 20%, transparent)' : '',
        }}
      >
        <span className={`block truncate font-medium text-sm ${!selectedOption ? 'text-slate-400' : 'text-slate-700'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <CaretDown 
          size={16} 
          weight="bold" 
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          style={{ color: 'var(--theme-color)' }}
        />
      </button>

      {/* Menú Desplegable */}
      <div 
        className={`absolute z-50 w-full mt-2 bg-white rounded-xl overflow-hidden transition-all duration-200 origin-top ${
          isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
        }`}
        style={{ 
          border: '1px solid var(--theme-color)',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
        }}
      >
        <ul className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`px-4 py-2.5 text-sm font-medium cursor-pointer transition-colors flex items-center justify-between ${
                  isSelected ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'
                }`}
                style={
                  isSelected 
                    ? { backgroundColor: 'color-mix(in srgb, var(--theme-color) 15%, transparent)' }
                    : {}
                }
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--theme-color) 10%, transparent)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span className="truncate">{option.label}</span>
              </li>
            );
          })}
          
          {options.length === 0 && (
            <li className="px-4 py-3 text-sm text-slate-400 text-center italic">
              No hay opciones disponibles
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};
