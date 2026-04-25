interface ExamThumbnailProps {
  src: string
  alt: string
}

export function ExamThumbnail({ src, alt }: ExamThumbnailProps) {
  return (
    <div className="bg-primary-100 flex h-12 w-12 shrink-0 items-center justify-center p-2.5">
      <img
        src={src}
        alt={alt}
        width={28}
        height={28}
        loading="lazy"
        className="h-full w-full object-contain"
      />
    </div>
  )
}
