import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface CopyWarpButtonProps {
  warpName: string
}

export default function CopyWarpButton({ warpName }: CopyWarpButtonProps) {
  const [copied, setCopied] = useState(false)

  const copyWarpCommand = async () => {
    const command = `/pwarp ${warpName}`
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      toast.success("Player Warp command copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Failed to copy warp command")
    }
  }

  return (
    <Button
      onClick={copyWarpCommand}
      className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
      size="sm"
    >
      <div className="flex items-center gap-2 relative z-10">
        {copied ? (
          <Check className="h-4 w-4 text-green-300" />
        ) : (
          <Copy className="h-4 w-4 group-hover:scale-110 transition-transform" />
        )}
        <span className="font-mono text-sm">/pwarp {warpName}</span>
      </div>

      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Button>
  )
}
