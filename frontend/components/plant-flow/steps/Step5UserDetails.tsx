"use client";

import { PhoneInput } from "@/components/ui";

interface Step5UserDetailsProps {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  dedicationMessage?: string;
  setDedicationMessage?: (val: string) => void;
}

export function Step5UserDetails({
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  dedicationMessage = "",
  setDedicationMessage,
}: Step5UserDetailsProps) {
  return (
    <div>
      <p className="text-[#4a6557] mb-5 text-sm">
        Your digital adoption certificate and lifetime geotagged deed will be issued with these details.
      </p>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="input-full-name"
            className="text-xs font-semibold text-[#4a6557] uppercase tracking-wider mb-1.5 block"
          >
            Full Name
          </label>
          <input
            id="input-full-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Priya Sharma"
            required
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all border-2 border-[#eaf2ec] focus:border-[#52b788] text-[#173324]"
          />
        </div>

        <div>
          <label
            htmlFor="input-email"
            className="text-xs font-semibold text-[#4a6557] uppercase tracking-wider mb-1.5 block"
          >
            Email Address
          </label>
          <input
            id="input-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all border-2 border-[#eaf2ec] focus:border-[#52b788] text-[#173324]"
          />
        </div>

        <div>
          <label
            htmlFor="input-phone"
            className="text-xs font-semibold text-[#4a6557] uppercase tracking-wider mb-1.5 block"
          >
            Phone Number
          </label>
          <PhoneInput
            id="input-phone"
            value={phone}
            onChange={setPhone}
            size="md"
          />
        </div>

        {setDedicationMessage && (
          <div>
            <label
              htmlFor="input-dedication"
              className="text-xs font-semibold text-[#4a6557] uppercase tracking-wider mb-1.5 flex items-center justify-between"
            >
              <span>Dedication Note / Message</span>
              <span className="text-[#8a9b90] font-normal lowercase text-[11px]">
                optional
              </span>
            </label>
            <textarea
              id="input-dedication"
              rows={2}
              value={dedicationMessage}
              onChange={(e) => setDedicationMessage(e.target.value)}
              placeholder="e.g. Wishing you a lifetime of joy and happiness! Planted with love."
              maxLength={250}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all border-2 border-[#eaf2ec] focus:border-[#52b788] text-[#173324] resize-none placeholder:text-[#8a9b90]"
            />
          </div>
        )}
      </div>
    </div>
  );
}
