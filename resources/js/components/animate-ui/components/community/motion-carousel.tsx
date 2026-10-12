import * as React from 'react';
import { motion, type Transition } from 'motion/react';
import { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@/components/animate-ui/primitives/buttons/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { PostsGroupedByUser, Work, WorkRecord } from '@/types/definitions';


type PropType = {
  slides: WorkRecord [];
  options?: EmblaOptionsType;
  changeWork: (work : WorkRecord) => void
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

  return (
    <div className="rounded-2xl w-full space-y-4 [--slide-height:12rem] sm:[--slide-height:13rem] md:[--slide-height:18rem] [--slide-spacing:1.5rem] [--slide-size:30%]  bg-mizume-primary p-4 ">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y touch-pinch-zoom ">
          {slides.map((p, i) => {
            const isActive = i === selectedIndex;
            
            return (
              <motion.div
                key={i}
                className="cursor-pointer h-[var(--slide-height)] mr-[var(--slide-spacing)] basis-[var(--slide-size)] flex-none flex min-w-0"
              >
                <motion.div
                  className=" bg-cover border-mizume-secondary p-3 size-full flex items-center justify-center text-3xl md:text-5xl font-semibold select-none border-4 rounded-xl"
                  initial={false}
                  style={{ backgroundImage: p.media[0].original_url ? `url(${p.media[0].original_url})` : "/IMG/Error-App.png" }}
                  animate={{
                    scale: isActive ? 1 : 0.9,
                  }}
                  transition={transition}
                >
                 
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between">
        <Button className='size-8 hover:bg-mizume-secondary rounded-2xl' onClick={onPrev} disabled={prevDisabled}>
          <ChevronLeft className="size-8 text-mizume-primary-foreground cursor-pointer  hover:text-mizume-secondary-foreground" />
        </Button>

        <div className="flex flex-wrap justify-end items-center gap-2 text-mizume-secondary-foreground rounded-2xl bg-mizume-secondary">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
               label={slides[index]?.abbreviation ?? `Obras ${index + 1}`}
              selected={index === selectedIndex}
              onClick={() => onDotClick(index)}
            
            />
          ))}
        </div>

        <Button className='size-8 hover:bg-mizume-secondary rounded-2xl' onClick={onNext} disabled={nextDisabled}>
          <ChevronRight className="size-8 text-mizume-primary-foreground cursor-pointer  hover:text-mizume-secondary-foreground" />
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
        }}
        transition={transition}
      >
        {label}
      </motion.span>
    </motion.button>
  );
}

export { MotionCarousel };
