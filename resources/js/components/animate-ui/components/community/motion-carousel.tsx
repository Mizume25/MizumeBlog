import * as React from 'react';
import { motion, type Transition } from 'motion/react';
import { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@/components/animate-ui/primitives/buttons/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { PostsGroupedByUser, Work, WorkRecord } from '@/types/definitions';


type PropType = {
  slides: WorkRecord[];
  options?: EmblaOptionsType;
  changeWork: (work: WorkRecord) => void
};




type EmblaControls = {
  selectedIndex: number;
  scrollSnaps: number[];
  prevDisabled: boolean;
  nextDisabled: boolean;
  onDotClick: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
};

type DotButtonProps = {
  selected?: boolean;
  label: string;
  onClick: () => void;
};

const transition: Transition = {
  type: 'spring',
  stiffness: 240,
  damping: 24,
  mass: 1,
};

const useEmblaControls = (
  emblaApi: EmblaCarouselType | undefined,
): EmblaControls => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);
  const [prevDisabled, setPrevDisabled] = React.useState(true);
  const [nextDisabled, setNextDisabled] = React.useState(true);

  const onDotClick = React.useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  const onPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const onNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const updateSelectionState = (api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap());
    setPrevDisabled(!api.canScrollPrev());
    setNextDisabled(!api.canScrollNext());
  };

  const onInit = React.useCallback((api: EmblaCarouselType) => {
    setScrollSnaps(api.scrollSnapList());
    updateSelectionState(api);
  }, []);

  const onSelect = React.useCallback((api: EmblaCarouselType) => {
    updateSelectionState(api);
  }, []);

  React.useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    emblaApi.on('reInit', onInit).on('select', onSelect);

    return () => {
      emblaApi.off('reInit', onInit).off('select', onSelect);
    };
  }, [emblaApi, onInit, onSelect]);

  return {
    selectedIndex,
    scrollSnaps,
    prevDisabled,
    nextDisabled,
    onDotClick,
    onPrev,
    onNext,
  };
};

function MotionCarousel(props: PropType) {
  const { slides, options, changeWork } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const {
    selectedIndex,
    scrollSnaps,
    prevDisabled,
    nextDisabled,
    onDotClick,
    onPrev,
    onNext,
  } = useEmblaControls(emblaApi);

  React.useEffect(() => {
    const work = slides[selectedIndex];
    if (work) changeWork(work);
  }, [selectedIndex, slides, changeWork]);

  const FALLBACK_COVER = '/IMG/Error-App.png';

  return (
    <div
  className="flex h-full w-full flex-col justify-center gap-3 rounded-2xl bg-mizume-fourthary p-3 md:p-4
  [--slide-height:16rem] sm:[--slide-height:20rem] md:[--slide-height:18rem]
  [--slide-spacing:0.75rem] md:[--slide-spacing:1.5rem]
  [--slide-size:100%] max-md:[--slide-size:80%] lg:[--slide-size:30%]"
>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y touch-pinch-zoom">
          {slides.map((p, i) => {
            const isActive = i === selectedIndex;
            const cover = p.media?.[0]?.original_url ?? FALLBACK_COVER;

            return (
              <div
                key={i}
                className="mr-[var(--slide-spacing)] flex h-[var(--slide-height)] min-w-0 flex-none basis-[var(--slide-size)] cursor-pointer"
              >
                <motion.div
                  className="flex size-full items-center justify-center rounded-xl border-4 bg-mizume-primary border-mizume-secondary p-2 overflow-hidden"
                  initial={false}
                  animate={{ scale: isActive ? 1 : 0.9 }}
                  transition={transition}
                >
                  <img
                    src={cover}
                    alt={p.abbreviation ?? `Portada ${i + 1}`}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    draggable={false}
                    className="max-h-full max-w-full select-none rounded-2xl object-cover transition-transform duration-300 ease-in-out hover:scale-120"
                  />
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 md:justify-between">
        <Button
          className="size-10 rounded-2xl hover:bg-mizume-secondary max-md:hidden"
          onClick={onPrev}
          disabled={prevDisabled}
        >
          <ChevronLeft className="size-9 text-mizume-fourthary-foreground cursor-pointer" />
        </Button>

        <div className="flex min-w-0 flex-wrap items-center justify-center gap-2 rounded-2xl bg-mizume-secondary p-1 text-mizume-secondary-foreground">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              label={slides[index]?.abbreviation ?? `Obra ${index + 1}`}
              selected={index === selectedIndex}
              onClick={() => onDotClick(index)}
            />
          ))}
        </div>

        <Button
          className="size-10 rounded-2xl hover:bg-mizume-secondary max-md:hidden"
          onClick={onNext}
          disabled={nextDisabled}
        >
          <ChevronRight className="size-9 text-mizume-fourthary-foreground cursor-pointer" />
        </Button>
      </div>
    </div>
  );
}

function DotButton({ selected = false, label, onClick }: DotButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      layout
      initial={false}
      className=" flex cursor-pointer select-none items-center justify-center rounded-full border-none text-sm"
      animate={{
        width: selected ? 68 : 12,
        height: selected ? 28 : 12,
      }}
      transition={transition}
    >
      <motion.span
        layout
        initial={false}
        className="block whitespace-nowrap px-3 py-1"
        animate={{
          opacity: selected ? 1 : 0,
          scale: selected ? 1 : 0,
          filter: selected ? 'blur(0)' : 'blur(4px)',
          width: selected ? 'auto' : 12,
          height: selected ? 28 : 12,
        }}
        transition={transition}
      >
        {label}
      </motion.span>
    </motion.button>
  );
}

export { MotionCarousel };
