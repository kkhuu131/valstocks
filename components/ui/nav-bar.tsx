/**
 * v0 by Vercel.
 * @see https://v0.dev/t/xYHqD5MkVkT
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {NavUser} from "@/components/ui/nav-user";
import AuthButton from "../auth-button";
import { TrendingUpIcon } from "lucide-react";
import { SearchBar } from "@/components/ui/search-bar";

export default function NavBar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm dark:bg-gray-950/90">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center" prefetch={false}>
            <TrendingUpIcon className="hidden sm:block w-7 h-7 text-green mr-2"/>
            <h1 className="hidden sm:block text-lg">ValStocks</h1>
            <span className="sr-only">ValStocks</span>
          </Link>

          <div className="hidden sm:block flex-1 max-w-sm mx-6">
            <SearchBar />
          </div>

          <nav className="flex gap-6">
            <Link
              href="/"
              className="font-medium flex items-center text-base transition-colors hover:underline"
              prefetch={false}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="font-medium flex items-center text-base transition-colors hover:underline"
              prefetch={false}
            >
              About
            </Link>
            <Link
              href="/rankings"
              className="font-medium flex items-center text-base transition-colors hover:underline"
              prefetch={false}
            >
              Rankings
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <AuthButton/>
          </div>
        </div>
      </div>
    </nav>
  )
}
