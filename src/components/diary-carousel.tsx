"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import type { Image as ImageType } from "@/types/image"

type Props = {
  images: ImageType[]
}

export function DiaryCarousel({ images }: Props) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(images.length)

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
              <div className="relative aspect-square w-full">
                <Image
                  src="/placeholder.png"
                  alt="ダミー画像"
                  fill
                  sizes="288px"
                  priority
                  className="object-contain"
                />
              </div>
            </CarouselItem>
          ) : (
            slides.map((image, index) => (
              <CarouselItem key={image.id}>
                <div className="relative aspect-square w-full">
                  <Image
                    src={`/storage/${image.path}`}
                    alt="日記の写真"
                    fill
                    sizes="288px"
                    priority={index === 0}
                    className="object-contain"
                  />
                </div>
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
