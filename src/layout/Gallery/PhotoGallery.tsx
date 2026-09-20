import { useEffect, useLayoutEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/style.css';
import ExpandMore from '@/assets/icons/expand_more.svg?react';
import images from '@/layout/Gallery/Images.ts';

// 스와이프 중 손을 뗐을 때 살짝 움직인 것까지 클릭(확대)으로 오인하지 않도록 하는 허용 오차입니다.
const DRAG_THRESHOLD = 8;
const GAP = 16;
// 스크롤이 멈춘 뒤 이 시간(ms)이 지나면 "정착했다"고 보고 복제본 위 여부를 확인합니다.
const SETTLE_DELAY = 120;

// 맨 앞엔 마지막 사진 복제본을, 맨 뒤엔 첫 사진 복제본을 붙여 무한 회전처럼 보이게 합니다.
// 복제본에 스크롤이 정착하면 화면 변화 없이 실제 사진 위치로 순간 이동시켜, 계속 이어서 돌 수 있게 합니다.
const loopSlides = [
  { ...images[images.length - 1], isClone: true, realIndex: images.length - 1 },
  ...images.map((image, index) => ({ ...image, isClone: false, realIndex: index })),
  { ...images[0], isClone: true, realIndex: 0 },
];

const PhotoGallery = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const realSlideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const centerOn = (track: HTMLDivElement, slide: HTMLElement) => {
    track.scrollLeft = slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2;
  };

  useLayoutEffect(() => {
    const track = trackRef.current;
    const first = realSlideRefs.current[0];
    if (!track || !first) return;
    centerOn(track, first);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const slides = Array.from(track.children) as HTMLElement[];
    let settleTimer: ReturnType<typeof setTimeout>;

    const nearestToCenter = () => {
      const trackCenter = track.scrollLeft + track.clientWidth / 2;
      return slides.reduce((closest, slide) => {
        const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
        const closestCenter = closest.offsetLeft + closest.offsetWidth / 2;
        const distance = Math.abs(trackCenter - slideCenter);
        const closestDistance = Math.abs(trackCenter - closestCenter);
        return distance < closestDistance ? slide : closest;
      }, slides[0]);
    };

    const updateScale = () => {
      const trackCenter = track.scrollLeft + track.clientWidth / 2;
      slides.forEach((slide) => {
        const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
        const distance = Math.abs(trackCenter - slideCenter);
        const ratio = Math.max(0, 1 - distance / (track.clientWidth * 0.6));
        const scale = 0.72 + ratio * 0.28;
        slide.style.transform = `scale(${scale})`;
        slide.style.opacity = `${0.55 + ratio * 0.45}`;
        slide.style.zIndex = `${Math.round(ratio * 10)}`;
      });
    };

    const jumpIfOnClone = () => {
      const nearest = nearestToCenter();
      const cloneOf = nearest.dataset.cloneOf;
      if (cloneOf === undefined) return;
      const real = realSlideRefs.current[Number(cloneOf)];
      if (!real) return;
      centerOn(track, real);
      updateScale();
    };

    const handleScroll = () => {
      updateScale();
      clearTimeout(settleTimer);
      settleTimer = setTimeout(jumpIfOnClone, SETTLE_DELAY);
    };

    updateScale();
    track.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateScale);
    return () => {
      clearTimeout(settleTimer);
      track.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  const scrollByOne = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const firstSlide = track.children[0] as HTMLElement | undefined;
    const amount = (firstSlide?.offsetWidth ?? track.clientWidth * 0.6) + GAP;
    track.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };

  return (
    <Gallery>
      <Frame>
        <ArrowButton aria-label="이전 사진" onClick={() => scrollByOne(-1)} side="left">
          <ExpandMore />
        </ArrowButton>
        <Track ref={trackRef}>
          {loopSlides.map((image, i) => {
            const dragStart = { x: 0, y: 0 };

            if (image.isClone) {
              return (
                <Slide key={`clone-${i}`} data-clone-of={image.realIndex}>
                  <SlideImg src={image.source} alt="" />
                </Slide>
              );
            }

            return (
              <Item
                key={image.alt}
                cropped
                original={image.source}
                thumbnail={image.source}
                width={image.width}
                height={image.height}>
                {({ ref, open }) => (
                  <Slide
                    ref={(node) => {
                      (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
                      realSlideRefs.current[image.realIndex] = node;
                    }}
                    onPointerDown={(e) => {
                      dragStart.x = e.clientX;
                      dragStart.y = e.clientY;
                    }}
                    onClick={(e) => {
                      const dx = Math.abs(e.clientX - dragStart.x);
                      const dy = Math.abs(e.clientY - dragStart.y);
                      if (dx < DRAG_THRESHOLD && dy < DRAG_THRESHOLD) {
                        open(e);
                      }
                    }}>
                    <SlideImg src={image.source} alt={image.alt} />
                  </Slide>
                )}
              </Item>
            );
          })}
        </Track>
        <ArrowButton aria-label="다음 사진" onClick={() => scrollByOne(1)} side="right">
          <ExpandMore />
        </ArrowButton>
      </Frame>
    </Gallery>
  );
};

export default PhotoGallery;

const Frame = styled.div`
  position: relative;
`;

const Track = styled.div`
  display: flex;
  align-items: center;
  gap: ${GAP}px;
  padding: 0 20%;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Slide = styled.div`
  flex: 0 0 60%;
  aspect-ratio: 2 / 3;
  scroll-snap-align: center;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.15s ease-out, opacity 0.15s ease-out;
`;

const SlideImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
`;

const ArrowButton = styled.button<{ side: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${({ side }) => (side === 'left' ? 'left: 4px;' : 'right: 4px;')}
  transform: translateY(-50%);
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background-color: rgba(255, 255, 255, 0.85);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  padding: 0;

  svg {
    width: 18px;
    height: 18px;
    fill: #44484d;
    transform: ${({ side }) => (side === 'left' ? 'rotate(90deg)' : 'rotate(-90deg)')};
  }
`;
