"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import PhoneInputLib, {
  isValidPhoneNumber,
  getCountries,
  getCountryCallingCode,
  type Country,
} from "react-phone-number-input/max";
import flags from "react-phone-number-input/flags";
import "react-phone-number-input/style.css";

const BARE_DIAL_CODES = new Set(
  getCountries().map((c) => `+${getCountryCallingCode(c)}`)
);

export function validatePhoneNumber(
  value: string,
  required = false
): { isValid: boolean; error: string | null } {
  const trimmed = (value || "").trim();

  if (!trimmed || BARE_DIAL_CODES.has(trimmed)) {
    return required
      ? { isValid: false, error: "Phone number is required" }
      : { isValid: true, error: null };
  }

  if (!isValidPhoneNumber(trimmed)) {
    return {
      isValid: false,
      error: "Please enter a valid phone number for the selected country",
    };
  }

  return { isValid: true, error: null };
}

interface CountryOption {
  value?: Country;
  label: string;
  divider?: boolean;
}

interface ThemedCountrySelectProps {
  value?: Country;
  onChange: (value?: Country) => void;
  options: CountryOption[];
  iconComponent: React.ElementType;
  disabled?: boolean;
  readOnly?: boolean;
}

function ThemedCountrySelect({
  value,
  onChange,
  options,
  iconComponent: Icon,
  disabled = false,
  readOnly = false,
}: ThemedCountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [menuStyle, setMenuStyle] = useState<{
    top?: number;
    bottom?: number;
    left: number;
    width: number;
    maxHeight: number;
  }>({
    top: 0,
    left: 0,
    width: 260,
    maxHeight: 280,
  });

  const selectedOption = useMemo(
    () => options.find((opt) => !opt.divider && opt.value === value),
    [options, value]
  );

  const filteredOptions = useMemo(() => {
    const q = search.trim().toLowerCase();
    return options.filter((opt) => {
      if (opt.divider || !opt.value) return false;
      if (!q) return true;
      const dialCode = `+${getCountryCallingCode(opt.value)}`;
      return (
        opt.label.toLowerCase().includes(q) ||
        opt.value.toLowerCase().includes(q) ||
        dialCode.includes(q)
      );
    });
  }, [options, search]);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || typeof window === "undefined") return;
    const rect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const spaceBelow = viewportHeight - rect.bottom - 12;
    const spaceAbove = rect.top - 12;
    const openUpward = spaceBelow < 220 && spaceAbove > spaceBelow;
    const maxHeight = Math.max(
      160,
      Math.min(280, openUpward ? spaceAbove - 8 : spaceBelow - 8)
    );
    const width = Math.min(280, viewportWidth - 24);
    const left = Math.min(Math.max(12, rect.left), viewportWidth - width - 12);

    if (openUpward) {
      setMenuStyle({
        bottom: viewportHeight - rect.top + 8,
        left,
        width,
        maxHeight,
      });
    } else {
      setMenuStyle({
        top: rect.bottom + 8,
        left,
        width,
        maxHeight,
      });
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();
    setTimeout(() => searchInputRef.current?.focus(), 10);

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setSearch("");
        triggerRef.current?.focus();
      }
    };

    const handleScrollOrResize = (e: Event) => {
      if (menuRef.current && e.target instanceof Node && menuRef.current.contains(e.target)) {
        return;
      }
      updatePosition();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleScrollOrResize);
    window.addEventListener("scroll", handleScrollOrResize, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("scroll", handleScrollOrResize, true);
    };
  }, [isOpen, updatePosition]);

  const isDisabled = disabled || readOnly;

  return (
    <div className="PhoneInputCountry">
      <button
        ref={triggerRef}
        type="button"
        disabled={isDisabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={selectedOption?.label || "Select country"}
        onClick={(e) => {
          e.stopPropagation();
          if (!isDisabled) {
            if (!isOpen) updatePosition();
            setIsOpen((prev) => !prev);
          }
        }}
        className={`group inline-flex items-center gap-1.5 pr-1.5 py-0.5 rounded-lg transition-all select-none ${
          isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <span className="inline-flex items-center justify-center w-6 h-4 overflow-hidden rounded-[3px] shrink-0">
          {value && (
            <Icon
              aria-hidden
              country={value}
              label={selectedOption?.label || value}
            />
          )}
        </span>
        <span
          className={`shrink-0 inline-flex items-center justify-center w-4 h-4 rounded-md transition-transform duration-200 ${
            isOpen
              ? "rotate-180 text-[#1b7a43] bg-[#eaf4ee]"
              : "text-[#55695d] group-hover:text-[#173324]"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-3.5 h-3.5"
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>

      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            style={{
              position: "fixed",
              top: menuStyle.top,
              bottom: menuStyle.bottom,
              left: menuStyle.left,
              width: menuStyle.width,
              maxHeight: menuStyle.maxHeight,
              boxShadow:
                "0 20px 40px -12px rgba(23, 51, 36, 0.28), 0 0 0 1px rgba(82, 183, 136, 0.18)",
            }}
            className="z-[110] flex flex-col rounded-2xl bg-[#fcfdfb] border border-[#cfe1d7] p-1.5 animate-fadeIn overflow-hidden"
          >
            <div className="p-1 pb-1.5 border-b border-[#e4efe8] mb-1">
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country or +code..."
                className="w-full px-2.5 py-1.5 rounded-xl text-xs bg-white border border-[#cfe1d7] text-[#173324] placeholder-[#7a8a80] outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#52b788]/20"
              />
            </div>

            <div className="overflow-y-auto space-y-0.5 pr-0.5">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-3 text-xs text-center text-[#7a8a80]">
                  No country found
                </div>
              ) : (
                filteredOptions.map((opt) => {
                  const countryCode = opt.value!;
                  const isSelected = countryCode === value;
                  const dialCode = `+${getCountryCallingCode(countryCode)}`;
                  return (
                    <button
                      key={countryCode}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={(e) => {
                        e.stopPropagation();
                        onChange(countryCode);
                        setIsOpen(false);
                        setSearch("");
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-xs text-left flex items-center justify-between gap-2.5 transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? "bg-gradient-to-r from-[#173324] to-[#2d6a4f] text-white font-semibold shadow-xs"
                          : "text-[#173324] font-medium hover:bg-[#eef7f2] hover:text-[#1b7a43]"
                      }`}
                    >
                      <span className="flex items-center gap-2.5 min-w-0 flex-1">
                        <span className="inline-flex items-center justify-center w-5 h-3.5 overflow-hidden rounded-[2px] shrink-0">
                          <Icon aria-hidden country={countryCode} label={opt.label} />
                        </span>
                        <span className="truncate">{opt.label}</span>
                        <span
                          className={`text-[11px] font-mono shrink-0 ${
                            isSelected ? "text-[#95d5b2]" : "text-[#52796f]"
                          }`}
                        >
                          {dialCode}
                        </span>
                      </span>
                      {isSelected && (
                        <span className="text-[#95d5b2] font-bold text-xs shrink-0 leading-none">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

interface PhoneInputProps {
  id?: string;
  value: string;
  onChange: (fullPhone: string) => void;
  required?: boolean;
  size?: "sm" | "md";
  placeholder?: string;
}

export function PhoneInput({
  id = "input-phone",
  value,
  onChange,
  required = false,
  size = "md",
  placeholder = "Enter phone number",
}: PhoneInputProps) {
  const trimmed = (value || "").trim();
  const hasDigits = Boolean(trimmed && !BARE_DIAL_CODES.has(trimmed));
  const validation = validatePhoneNumber(value, required);
  const showError = hasDigits && !validation.isValid;
  const sizeClass = size === "sm" ? "py-2 text-sm" : "py-3 text-sm";

  return (
    <div>
      <div
        className={`poa-phone-input flex items-center w-full px-3.5 ${sizeClass} rounded-xl border transition-all bg-white text-[#173324] ${
          showError
            ? "border-rose-400 bg-rose-50/30 focus-within:border-rose-500"
            : "border-[#d2ded7] focus-within:border-[#1b7a43] focus-within:ring-2 focus-within:ring-[#52b788]/20"
        }`}
      >
        <PhoneInputLib
          id={id}
          international
          defaultCountry="IN"
          countryCallingCodeEditable={false}
          limitMaxLength
          flags={flags}
          countrySelectComponent={ThemedCountrySelect}
          value={value || undefined}
          onChange={(val) =>
            onChange(val && !BARE_DIAL_CODES.has(val) ? val : "")
          }
          placeholder={placeholder}
          className="w-full"
        />
      </div>

      {showError && validation.error && (
        <p className="mt-1 text-[11px] font-medium text-rose-600 flex items-center gap-1">
          <span>⚠️</span>
          <span>{validation.error}</span>
        </p>
      )}
    </div>
  );
}
