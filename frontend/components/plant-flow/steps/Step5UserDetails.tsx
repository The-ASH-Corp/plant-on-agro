"use client";

import { PhoneInput } from "@/components/ui";

interface Step5UserDetailsProps {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
}

export function Step5UserDetails({
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
}: Step5UserDetailsProps) {
  return (
    <div>
      <p className="text-[#4a6557] mb-5">
        Your digital adoption certificate will be issued in this name.
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
      </div>
    </div>
  );
}
