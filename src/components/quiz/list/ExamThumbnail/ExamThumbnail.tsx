import defaultThumbnail from '@/assets/exam_thumbnail_img.svg'

interface ExamThumbnailProps {
  src: string | null
  alt: string
}

const isValidUrl = (url: string | null): boolean =>
  !!url && url !== 'default_img_url'

export function ExamThumbnail({ src, alt }: ExamThumbnailProps) {
  return (
    <div className="bg-primary-100 flex h-12 w-12 shrink-0 items-center justify-center p-2.5">
      <img
        src={isValidUrl(src) ? (src as string) : defaultThumbnail}
        alt={alt}
        width={28}
        height={28}
        loading="lazy"
        className="h-full w-full object-contain"
      />
    </div>
  )
}
