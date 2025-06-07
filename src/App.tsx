import { useState, useEffect, useMemo } from "react"
import { Search, ArrowUp, ArrowDown, Shuffle, MapPin, Eye, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import Footer from "@/components/footer"
import OwnerDisplay from "@/components/owner-display"
import CopyWarpButton from "@/components/copy-warp-button"
import { WarpDialog } from "./components/warp-dialog"

interface WarpData {
  name: string
  safeName: string
  owner: string
  created: string
  visits: string
  imageUrl: string
  info: string
  note: string
}

type SortOption = "name" | "owner" | "created" | "visits" | "shuffle"
type SortOrder = "asc" | "desc"

export default function PlayerWarpGallery() {
  const [warps, setWarps] = useState<WarpData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [sortBy, setSortBy] = useState<SortOption>("name")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [displayMode, setDisplayMode] = useState<"immersive" | "details">(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("displayMode")
      return savedMode === "immersive" || savedMode === "details" ? savedMode : "immersive"
    }
    return "immersive"
  })
  const [openWarp, setOpenWarp] = useState<WarpData | null>(null)
  const [initialPath, setInitialPath] = useState<string>("")

  useEffect(() => {
    fetchWarps()
  }, [])

  useEffect(() => {
    localStorage.setItem("displayMode", displayMode)
  }, [displayMode])

  useEffect(() => {
    const onPopState = () => {
      setOpenWarp(null)
    }
		window.addEventListener("popstate", onPopState)
		return () => window.removeEventListener("popstate", onPopState)
  }, [])

  useEffect(() => {
		if (openWarp) {
			setInitialPath((prev) => prev || window.location.pathname)
			window.history.pushState({}, "", `/warp/${encodeURIComponent(openWarp.name)}`)
		} else if (!openWarp) {
			window.history.replaceState({}, "", "/")
		} else if (initialPath) {
			window.history.replaceState({}, "", initialPath)
			setInitialPath("")
		}
  }, [openWarp, initialPath])

  const fetchWarps = async (): Promise<void> => {
    try {
      const response = await fetch("/data.json")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: WarpData[] = await response.json()
      setWarps(data)
    } catch (error) {
      console.error("Failed to fetch warps:", error)
      toast.error("Failed to load player warps")
    } finally {
      setLoading(false)
    }
  }

  const filteredAndSortedWarps = useMemo((): WarpData[] => {
    const filtered = warps.filter(
      (warp: WarpData) =>
        warp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        warp.owner.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (sortBy === "shuffle") {
      const shuffled = [...filtered]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled
    }

    return filtered.sort((a: WarpData, b: WarpData) => {
      let aValue: string | number | Date = a[sortBy as keyof WarpData]
      let bValue: string | number | Date = b[sortBy as keyof WarpData]

      if (sortBy === "created") {
        aValue = new Date(a.created)
        bValue = new Date(b.created)
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()

        if (sortBy === "visits") {
          aValue = Number.parseInt(a.visits) || 0
          bValue = Number.parseInt(b.visits) || 0
        }
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })
  }, [warps, searchTerm, sortBy, sortOrder])

  const toggleSortOrder = (): void => {
    setSortOrder((prev: SortOrder) => (prev === "asc" ? "desc" : "asc"))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Perf-Test Warps<span className="text-xs text-purple-300">.info</span>
            </h1>
            <p className="text-purple-200 animate-pulse">Loading amazing warps...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative">
      <div className="relative z-10 pt-8 sm:pt-12 md:pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <MapPin className="h-8 w-8 text-purple-400" />
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Perf-Test Warps
              </h1>
            </div>
            <p className="text-lg text-purple-200 max-w-2xl mx-auto">
              Player Warps on Tubbo's Performance Testing Minecraft Server
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-purple-300">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>
                  {warps.reduce((sum, warp) => sum + (Number.parseInt(warp.visits) || 0), 0).toLocaleString()} total
                  visits on all player warps
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{new Set(warps.map((w) => w.owner)).size} people's player warps</span>
              </div>
            </div>
          </div>

          {/* Search and Sort Controls */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 mb-8 shadow-2xl">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 h-5 w-5" />
                <Input
                  placeholder="Search warps, owners, or categories..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl"
                />
              </div>

              <div className="flex gap-3">
                <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                  <SelectTrigger className="w-36 h-12 bg-white/10 border-white/20 text-white rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-white/20 text-white rounded-xl">
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="created">Created</SelectItem>
                    <SelectItem value="visits">Visits</SelectItem>
                    <SelectItem value="shuffle">
                      <div className="flex items-center gap-2">
                        <Shuffle className="h-4 w-4" />
                        Shuffle
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                {sortBy !== "shuffle" && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleSortOrder}
                    className="h-12 w-12 bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
                  >
                    {sortOrder === "asc" ? <ArrowUp className="h-5 w-5" /> : <ArrowDown className="h-5 w-5" />}
                  </Button>
                )}

                <Select value={displayMode} onValueChange={(value: "immersive" | "details") => setDisplayMode(value)}>
                  <SelectTrigger className="w-32 h-12 bg-white/10 border-white/20 text-white rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-white/20 text-white rounded-xl">
                    <SelectItem value="immersive">Immersive</SelectItem>
                    <SelectItem value="details">Details</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
              <div className="text-purple-200">
                Showing <span className="font-semibold text-white">{filteredAndSortedWarps.length}</span> of{" "}
                <span className="font-semibold text-white">{warps.length}</span> warps
              </div>
            </div>
          </div>

          {/* Warp Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedWarps.map((warp, index) =>
              displayMode === "immersive" ? (
                <div
                  key={warp.name}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer backdrop-blur-xl bg-white/10 border border-white/20 hover:border-purple-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
                  onClick={() => setOpenWarp(warp)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Open details for ${warp.name}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setOpenWarp(warp)
                  }}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <img
                    src={warp.imageUrl || "/placeholder.svg"}
                    alt={`Screenshot of the "${warp.safeName}" warp`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Content overlay */}
                  <div className="absolute inset-0 p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <Badge className="bg-purple-500/80 text-white border-0 backdrop-blur-sm">
                        {Number.parseInt(warp.visits) || 0} visits
                      </Badge>
                      {warp.note && (
                        <Badge variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm">
                          {warp.note}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                        {warp.name}
                      </h3>
                      <OwnerDisplay owner={warp.owner} />
                    </div>
                  </div>
                </div>
              ) : (
                <Card
                  key={warp.name}
                  className="group overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 hover:border-purple-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 rounded-2xl"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <CardHeader className="p-0">
                    <div
                      className="relative aspect-video overflow-hidden cursor-pointer"
                      onClick={() => setOpenWarp(warp)}
                      tabIndex={0}
                      role="button"
                      aria-label={`Open details for ${warp.name}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") setOpenWarp(warp)
                      }}
                    >
                      <img
                        src={warp.imageUrl}
                        alt={`Screenshot of the "${warp.name}" warp`}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <CopyWarpButton warpName={warp.name} />
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30">
                        {parseInt(warp.visits) || 0} visits
                      </Badge>
                    </div>
                    <OwnerDisplay owner={warp.owner} />
                    <p className="text-purple-100 text-sm leading-relaxed">{warp.info}</p>
                    {warp.note && (
                      <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                        {warp.note}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ),
            )}
          </div>

          {/* Enhanced Dialog */}
					<WarpDialog openWarp={openWarp} onOpenChange={setOpenWarp} />

          {filteredAndSortedWarps.length === 0 && (
            <div className="text-center py-20">
              <div className="space-y-4">
                <div className="w-24 h-24 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Search className="h-12 w-12 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">No warps found</h3>
                <p className="text-purple-200 max-w-md mx-auto">
                  Try adjusting your search terms or filters to discover more amazing destinations.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
