// app/page.tsx
"use client";
import CountryCodeDropdown from "@/components/CountryCodeDropdown";
import useCountriesInfo from "@/hooks/useCountriesInfo";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
      <section className="z-10 text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          ConverzAI
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          A futuristic conversational AI experience. 
        </p>

        {/* CTA buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
          >
            Login
          </button>
          <button
            onClick={() => router.push("/sign-up")}
            className="px-6 py-3 rounded-xl bg-white/20 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
          >
            Sign Up
          </button>
          <CountryCodeDropdown />
        </div>
      </section>
  );
}
