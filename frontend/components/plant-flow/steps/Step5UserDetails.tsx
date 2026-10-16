"use client";

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
  const fields = [
    {
      label: "Full Name",
      id: "input-full-name",
      val: name,
      set: setName,
      type: "text",
      placeholder: "e.g. Priya Sharma",
      required: true,
    },
    {
      label: "Email Address",
      id: "input-email",
      val: email,
      set: setEmail,
      type: "email",
      placeholder: "your@email.com",
      required: true,
    },
    {
      label: "Phone Number",
      id: "input-phone",
      val: phone,
      set: setPhone,
      type: "tel",
      placeholder: "+91 98765 43210",
      required: false,
    },
  ];

  return (
    <div>
      <p className="text-[#4a6557] mb-5">
        Your digital adoption certificate will be issued in this name.
      </p>
      <div className="space-y-4">
        {fields.map(({ label, id, val, set, type, placeholder }) => (
          <div key={label}>
            <label
              htmlFor={id}
              className="text-xs font-semibold text-[#4a6557] uppercase tracking-wider mb-1.5 block"
            >
              {label}
            </label>
            <input
              id={id}
              type={type}
              value={val}
              onChange={(e) => set(e.target.value)}
              placeholder={placeholder}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{ border: "2px solid #eaf2ec", color: "#173324" }}
              onFocus={(e) => (e.target.style.border = "2px solid #52b788")}
              onBlur={(e) => (e.target.style.border = "2px solid #eaf2ec")}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
