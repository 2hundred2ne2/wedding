import { useRef, useState } from 'react';
import styled from '@emotion/styled';
import guestbookVideo from '@/assets/video/guestbook_video.mp4';

// 자동재생은 무음일 때만 허용되므로 무음으로 시작하고, 버튼을 눌러야 소리가 나옵니다.
const GuestbookVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !isMuted;
    video.muted = nextMuted;
    if (!nextMuted) void video.play();
    setIsMuted(nextMuted);
  };

  return (
    <VideoWrapper>
      <Video ref={videoRef} src={guestbookVideo} autoPlay muted loop playsInline />
      <SoundButton type="button" aria-label={isMuted ? '소리 켜기' : '소리 끄기'} onClick={toggleSound}>
        {isMuted ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 9v6h4l5 5V4L7 9H3z" />
            <path d="M16 9l5 6M21 9l-5 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 9v6h4l5 5V4L7 9H3z" />
            <path
              d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </SoundButton>
    </VideoWrapper>
  );
};

export default GuestbookVideo;

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 12px;
`;

const Video = styled.video`
  display: block;
  width: 100%;
`;

const SoundButton = styled.button`
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 36px;
  height: 36px;
  padding: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.45);
  color: #fff;
  cursor: pointer;

  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }
`;
