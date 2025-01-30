"use client"
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Posted LPOs", href: "/postedLpos" },
  { name: "First Approved LPOs", href: "/products" },
  { name: "Second Approved LPOs", href: "/secondapproved" },
  { name: "Final Approved LPOs", href: "/settings" }
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex">
      {/* Mobile Menu Button */}
      <button
        className="p-2 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-gray-900 text-white w-64 p-5 transform transition-transform duration-300 md:relative md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:flex md:flex-col`}
      >
        <h2 className="text-xl font-bold mb-8">LPO System</h2>
        <nav>
          <ul>
            {navItems.map((item) => (
              <li key={item.href} className="mb-4">
                <Link
                  href={item.href}
                  className="block px-4 py-2 rounded hover:bg-gray-700"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
