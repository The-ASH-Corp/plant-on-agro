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
  waitlistMode?: boolean;
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
  waitlistMode = false,
}: Step5UserDetailsProps) {
  return (
    <div>
      {waitlistMode ? (
        <div
          className="mb-5 p-3.5 rounded-2xl flex items-start gap-3 text-xs leading-relaxed"
          style={{ background: "#f0faf4", border: "1px solid #cce7d8" }}
        >
          <span className="text-base shrink-0 mt-0.5">✨</span>
          <div className="text-[#234d36]">
            <span className="font-bold text-[#173324]">
              Priority Waitlist Reservation — No Payment Needed Today.
            </span>{" "}
            Enter your contact details below to reserve your tree selection on our priority waitlist. We will notify you as soon as online payments open.
          </div>
        </div>
      ) : (
        <p className="text-[#4a6557] mb-5 text-sm">
          Your digital adoption certificate and lifetime digital deed will be issued with these details.
        </p>
      )}
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
