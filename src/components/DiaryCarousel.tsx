"use client"

import { useEffect, useState } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import type { Image } from "@/types/image"

type Props = {
  images: Image[]
  apiUrl: string
}

export function DiaryCarousel({ images, apiUrl }: Props) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) return
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())
    api.on("select", () => setCurrent(api.selectedScrollSnap()))
  }, [api])

  const slides = images.length === 0 ? null : images

  return (
    <div>
      <Carousel setApi={setApi}>
        <CarouselContent>
          {slides === null ? (
            <CarouselItem>
              <img src="/placeholder.png" alt="ダミー画像" />
            </CarouselItem>
          ) : (
            slides.map((image) => (
              <CarouselItem key={image.id}>
                <img src={`${apiUrl}/storage/${image.path}`} />
              </CarouselItem>
            ))
          )}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
      {count > 1 && (
        <div className="flex justify-center gap-1.5 mt-2">
          {Array.from({ length: count }).map((_, i) => (
            <span
              key={i}
              className={`block size-1.5 rounded-full transition-colors ${
                i === current ? "bg-foreground" : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
