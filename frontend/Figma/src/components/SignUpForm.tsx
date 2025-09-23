import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { BookOpen } from "lucide-react";

interface SignUpFormProps {
  onToggleMode: () => void;
}

export function SignUpForm({ onToggleMode }: SignUpFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    console.log("SignUp attempt:", { name, email, password });
  };

  return (
    <div className="w-full max-w-sm mx-auto px-4">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-amber-600 rounded-full">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl text-gray-900 dark:text-gray-100 mb-8">
          Create Your Account!
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-4 rounded-lg border border-gray-300 bg-white"
          required
        />

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 rounded-lg border border-gray-300 bg-white"
          required
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 rounded-lg border border-gray-300 bg-white"
          required
        />

        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-4 rounded-lg border border-gray-300 bg-white"
          required
        />

        <Button
          type="submit"
          className="w-full p-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg mt-6"
        >
          Sign Up
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Already have an account?{" "}
          <button
            onClick={onToggleMode}
            className="text-blue-600 hover:text-blue-700"
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
}