'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from "@/lib/utils";

interface DropdownOption {
    value: string;
    label: string;
}

interface CustomDropdownProps {
    options: DropdownOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    id?: string;
    label?: string;
}

export function CustomDropdown({
    options,
    value,
    onChange,
    placeholder = 'Select an option',
    className = '',
    id,
    label,
}: CustomDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);
    const displayText = selectedOption ? selectedOption.label : placeholder;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isOpen) return;

            if (event.key === 'Escape') {
                setIsOpen(false);
            } else if (event.key === 'ArrowDown') {
                event.preventDefault();
                const currentIndex = options.findIndex((opt) => opt.value === value);
                const nextIndex = (currentIndex + 1) % options.length;
                onChange(options[nextIndex].value);
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                const currentIndex = options.findIndex((opt) => opt.value === value);
                const prevIndex = currentIndex <= 0 ? options.length - 1 : currentIndex - 1;
                onChange(options[prevIndex].value);
            } else if (event.key === 'Enter') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, value, options, onChange]);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className={cn("space-y-2 font-inter", className)}>
            {label && (
                <label htmlFor={id} className="block text-[13px] font-medium text-[#4f5b76]">
                    {label}
                </label>
            )}

            <div ref={dropdownRef} className="relative">
                <button
                    type="button"
                    id={id}
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full px-4 h-11 rounded-[6px] border border-[#d3dce6] bg-white text-[#061b31] focus:border-[#0a66c2] focus:ring-[3px] focus:ring-[#0a66c2]/8 transition-all outline-none font-normal text-sm shadow-sm flex items-center justify-between group"
                >
                    <span className={selectedOption ? 'text-[#061b31]' : 'text-[#a3afbf]'}>
                        {displayText}
                    </span>
                    <ChevronDown className={cn("h-4 w-4 text-[#a3afbf] transition-transform duration-200", isOpen && "rotate-180 text-[#0a66c2]")} />
                </button>

                {isOpen && (
                    <div className="absolute z-50 w-full mt-2 rounded-[8px] border border-[#e5edf5] bg-white shadow-stripe-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="py-1 max-h-64 overflow-y-auto">
                            {options.map((option) => {
                                const isSelected = option.value === value;

                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => handleSelect(option.value)}
                                        className={cn(
                                            "w-full px-4 py-2.5 text-left flex items-center justify-between text-sm transition-colors",
                                            isSelected
                                                ? "bg-[#f0f7ff] text-[#0a66c2] font-medium"
                                                : "text-[#4f5b76] hover:bg-slate-50 hover:text-[#061b31]"
                                        )}
                                    >
                                        <span>{option.label}</span>
                                        {isSelected && <Check className="h-4 w-4" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
