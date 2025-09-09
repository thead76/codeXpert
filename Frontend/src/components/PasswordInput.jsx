import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="flex items-center gap-2 bg-[#2a1f52] px-4 py-3 rounded-lg relative">
      <Lock className="text-pink-400" size={20} />
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        className="bg-transparent outline-none flex-1"
        value={value}
        onChange={onChange}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 text-gray-400 hover:text-white"
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};

export default PasswordInput;
