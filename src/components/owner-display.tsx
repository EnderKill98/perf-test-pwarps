interface OwnerDisplayProps {
  owner: string
}

export default function OwnerDisplay({ owner }: OwnerDisplayProps) {
  return (
    <div className="flex items-center gap-2 backdrop-blur-sm bg-white/10 border border-white/20 px-3 py-2 rounded-xl">
      <img
        src={`https://minotar.net/helm/${owner}/100.png`}
        width={20}
        height={20}
        alt={`${owner}'s avatar`}
        className="rounded border border-white/20"
        loading="lazy"
      />
      <span className="text-sm font-medium text-purple-200">{owner}</span>
    </div>
  )
}
