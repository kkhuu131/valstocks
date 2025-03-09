"use client"

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import teamMappings from "@/data/teamMappings.json"
import teams from "@/data/teams.json"

interface SearchResult {
  type: 'user' | 'stock'
  label: string
  value: string
  image?: string
}
interface Profiles {
  username: string
  picture: string
}

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [profiles, setProfiles] = useState<Profiles[]>([]);
  const router = useRouter()

  const validSymbols = new Set(teams);

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, picture');

      if (error) {
        console.error('Error fetching profiles:', error);
        return;
      }

      setProfiles(data || []);
    };

    fetchProfiles();
  }, []);

  useEffect(() => {
    const searchData = async () => {
      if (query.length < 2) {
        setResults([])
        return
      }

      // Search users
      const users = profiles
      .filter(user => user.username.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5)
      .map(user => ({
        type: 'user' as const,
        label: user.username,
        value: `/profiles/${user.username}`,
        image: user.picture,
      }));

      // Search stocks
      const stocks = Object.entries(teamMappings.teamBySymbolMap)
        .filter(([symbol, team]) =>
          validSymbols.has(symbol) && // Ensure the symbol exists in teams.json
          (symbol.toLowerCase().includes(query.toLowerCase()) ||
            team.name.toLowerCase().includes(query.toLowerCase()))
        )
        .slice(0, 5)
        .map(([symbol, team]) => ({
          type: 'stock' as const,
          label: `${symbol} - ${team.name}`,
          value: `/stocks/${symbol}`,
          image: team.img,
        }));

      const searchResults: SearchResult[] = [...users, ...stocks];

      setResults(searchResults)
    }

    const timeoutId = setTimeout(searchData, 300)
    return () => clearTimeout(timeoutId)
  }, [query, profiles])

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search stocks or users..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
            focus:outline-none focus:border-green"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg 
          border border-gray-200 dark:border-gray-700 max-h-96 overflow-auto z-50">
          {results.map((result, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => {
                router.push(result.value)
                setIsOpen(false)
                setQuery('')
              }}
            >
              <img
                src={result.image || "https://owcdn.net/img/64168fe1322dd.png"}
                alt={result.label}
                className="w-6 h-6 rounded-full"
              />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{result.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{result.type}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 