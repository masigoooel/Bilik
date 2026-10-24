/** kata bertanda hubung (mis. "70-an", "kotak-kotak") tidak boleh terpotong di akhir baris */
export function NoBreak({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\S*-\S*)/).map((part, i) =>
        part.includes('-') ? (
          <span key={i} className="whitespace-nowrap">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  )
}
