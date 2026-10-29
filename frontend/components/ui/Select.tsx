"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { createPortal } from "react-dom";

export interface SelectOption {
  value: string;
  label: React.ReactNode;
  textLabel: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children?: React.ReactNode;
}

function extractOptions(children: React.ReactNode): SelectOption[] {
  const options: SelectOption[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;

    if (child.type === React.Fragment) {
      const fragProps = child.props as { children?: React.ReactNode };
      options.push(...extractOptions(fragProps.children));
      return;
    }

    const props = child.props as {
      value?: string | number;
      children?: React.ReactNode;
      disabled?: boolean;
    };

    const rawText = React.Children.toArray(props.children)
      .map((c) => (typeof c === "string" || typeof c === "number" ? String(c) : ""))
      .join("")
      .trim();

    const val =
      props.value !== undefined ? String(props.value) : rawText;

    options.push({
      value: val,
      label: props.children,
      textLabel: rawText || val,
      disabled: props.disabled,
    });
  });

  return options;
}

export function Select({
  id,
  name,
  value,
  defaultValue,
  onChange,
  disabled = false,
  required = false,
  className = "",
  children,
  ...rest
}: SelectProps) {
  const options = useMemo(() => extractOptions(children), [children]);

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string>(() => {
    if (value !== undefined) return String(value);
    if (defaultValue !== undefined) return String(defaultValue);
    return options[0]?.value ?? "";
  });

  // Keep internalValue synced if options load dynamically and uncontrolled
  useEffect(() => {
    if (!isControlled && defaultValue === undefined && !internalValue && options.length > 0) {
      setInternalValue(options[0].value);
    }
  }, [isControlled, defaultValue, internalValue, options]);

  const currentValue = isControlled ? String(value) : internalValue;

  const selectedOption = useMemo(
    () =>
      options.find((opt) => opt.value === currentValue) ||
      options[0] || { value: "", label: "", textLabel: "" },
    [options, currentValue]
  );

  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [menuStyle, setMenuStyle] = useState<{
    top?: number;
    bottom?: number;
    left: number;
    width: number;
    maxHeight: number;
    openUpward: boolean;
  }>({
    top: 0,
    left: 0,
    width: 180,
    maxHeight: 260,
    openUpward: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || typeof window === "undefined") return;
    const rect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const spaceBelow = viewportHeight - rect.bottom - 12;
    const spaceAbove = rect.top - 12;
    const desiredMaxHeight = 260;

    const openUpward = spaceBelow < 180 && spaceAbove > spaceBelow;
    const maxHeight = Math.max(
      120,
      Math.min(desiredMaxHeight, openUpward ? spaceAbove - 8 : spaceBelow - 8)
    );

    const width = Math.max(rect.width, 96);
    const left = Math.min(Math.max(8, rect.left), viewportWidth - width - 8);

    if (openUpward) {
      setMenuStyle({
        bottom: viewportHeight - rect.top + 6,
        left,
        width,
        maxHeight,
        openUpward: true,
      });
    } else {
      setMenuStyle({
        top: rect.bottom + 6,
        left,
        width,
        maxHeight,
        openUpward: false,
      });
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const enabledOptions = options.filter((o) => !o.disabled);
        if (enabledOptions.length === 0) return;
        const currentIdx = enabledOptions.findIndex((o) => o.value === currentValue);
        const nextIdx =
          e.key === "ArrowDown"
            ? (currentIdx + 1) % enabledOptions.length
            : (currentIdx - 1 + enabledOptions.length) % enabledOptions.length;
        handleSelectOption(enabledOptions[nextIdx].value, false);
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
  }, [isOpen, updatePosition, options, currentValue]);

  const handleSelectOption = (newValue: string, closeMenu = true) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    if (onChange) {
      const syntheticTarget = {
        name: name || "",
        id: id || "",
        value: newValue,
        type: "select-one",
      };
      const syntheticEvent = {
        target: syntheticTarget,
        currentTarget: syntheticTarget,
        preventDefault: () => {},
        stopPropagation: () => {},
      } as unknown as React.ChangeEvent<HTMLSelectElement>;
      onChange(syntheticEvent);
    }
    if (closeMenu) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {name && (
        <input
          type="hidden"
          name={name}
          value={currentValue}
          required={required}
        />
      )}
      <button
        ref={triggerRef}
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => {
          if (!disabled) {
            if (!isOpen) updatePosition();
            setIsOpen((prev) => !prev);
          }
        }}
        className={`group relative inline-flex items-center justify-between gap-2 text-left transition-all duration-150 select-none ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        } ${
          isOpen
            ? "ring-2 ring-[#52b788]/30 border-[#2d6a4f]!"
            : "hover:border-[#52b788]"
        } ${className}`}
        {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        <span className="truncate flex-1">{selectedOption?.label}</span>
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

      {mounted &&
        isOpen &&
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
            className="z-[110] overflow-y-auto rounded-2xl bg-[#fcfdfb] border border-[#cfe1d7] p-1.5 space-y-0.5 animate-fadeIn"
          >
            {options.map((opt) => {
              const isSelected = opt.value === currentValue;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={opt.disabled}
                  onClick={() => handleSelectOption(opt.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs text-left flex items-center justify-between gap-2 transition-all duration-150 ${
                    opt.disabled
                      ? "opacity-40 cursor-not-allowed"
                      : "cursor-pointer"
                  } ${
                    isSelected
                      ? "bg-gradient-to-r from-[#173324] to-[#2d6a4f] text-white font-semibold shadow-xs"
                      : "text-[#173324] font-medium hover:bg-[#eef7f2] hover:text-[#1b7a43]"
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && (
                    <span className="text-[#95d5b2] font-bold text-xs shrink-0 leading-none">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </>
  );
}

