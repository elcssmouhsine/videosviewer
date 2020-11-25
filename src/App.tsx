import React, { useRef, useEffect, useState } from 'react';
import videos from './output.json';
import "./tailwind.output.css"

function timeToSeconds(time: string): number {
  const a = time.split(':'); // split it at the colons
  // minutes are worth 60 seconds. Hours are worth 60 minutes.
  return (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
}

const intervalClickedEvent = new CustomEvent('elintervalclicked');

const activityColor = (activity: string):string => {
  switch(activity) {
    case 'MULTIPLE_PEOPLE':
      return 'blue'
    case 'USAGE_LAPTOP':
      return 'indigo'
    case 'USAGE_CELL_PHONE':
      return 'yellow'
    case 'USAGE_BOOK':
      return 'lime'
    case 'NO_FACE':
      return 'green'
    case 'PEOPLE_TALKING':
      return 'red'
    default:
      return 'red'
  }
}

const activityArabic = (activity: string):string => {
  return activity
  switch(activity) {
    case 'MULTIPLE_PEOPLE':
      return 'أكثر من شخص'
    case 'USAGE_LAPTOP':
      return 'استخدام حاسوب'
    case 'USAGE_CELL_PHONE':
      return 'استخدام قلم او هاتف'
    case 'USAGE_BOOK':
      return 'استخدام كتاب او اوراق'
    case 'NO_FACE':
      return 'لا يوجد وجه'
    case 'PEOPLE_TALKING':
      return 'اشخاص يتكلمون'
    case 'NOT_FACING_CAMERA':
      return 'لا ينظر للكاميرا'
    case 'USAGE_PAPER':
      return 'استخدام اوراق'
    case 'NO_PEOPLE':
      return 'لا يوجد اشخاص'
    default:
      return activity
  }
}

interface TimeInterval {
  start: string;
  end: string;
}

interface Violation {
  activity: string;
  time_intervals: TimeInterval[];
}

interface Video {
  video: string,
  violations: Violation[];
}

interface IViolationProps extends Violation {
  onClick: Function;
  videoDuration: number;
}

interface IIntervalItem extends TimeInterval {
  videoDuration: number;
  onClick: Function;
  color: string;
}

function IntervalItem ({start, end, videoDuration, onClick, color}: IIntervalItem) {
  const intervalDuration = (timeToSeconds(end)-timeToSeconds(start))
  const width = (intervalDuration/videoDuration) * 100 - 1 + '%'
  const left  = ((timeToSeconds(start)/videoDuration) * 100) + 1 + '%'
  return <button 
  onClick={() => onClick(start)}
  className={`bg-${color}-500 outline-none hover:z-10 focus:outline-none hover:bg-opacity-100 bg-opacity-75 py-1 absolute bottom-0`}
  style={{ 
    width,
    left,
    minWidth: 20
  }}>
    {intervalDuration}s
  </button>
}
function ViolationRow({ videoDuration, activity, time_intervals, onClick}: IViolationProps) {
  const color = activityColor(activity)
  return <div className={`border-${color}-900 bg-${color}-800 bg-opacity-25 border-b overflow-hidden text-white relative text-sm text-right p-2 h-12`}>
  <span className={`absolute right-2 top-0 text-${color}-700`}>{activityArabic(activity)}</span>
  <div className="grid w-full top-2">
  {time_intervals.map((interval, index): JSX.Element => <IntervalItem 
  onClick={onClick}
  videoDuration={videoDuration}
  color={color}
  start={interval.start} 
  key={index}
  end={interval.end} />)}
  </div>
</div>
}

interface IVideoItemProps {
  video: Video
}
function VideoItem({ video }: IVideoItemProps): JSX.Element {
  const videoReference = useRef() as React.MutableRefObject<HTMLVideoElement>;
  const [duration, setDuration] = useState<number>(0)
  const handleViolationClick = (time: string) => {
    videoReference.current.currentTime = timeToSeconds(time)
    document.dispatchEvent(intervalClickedEvent)
    videoReference.current.play()
  }

  const handleVideoPlaying = () => {
    videoReference.current.pause()
  }
  const handleVideoLoaded = () => {
    setDuration(videoReference.current?.duration)
  }
  useEffect(() => {
    const videoCopy = videoReference.current
    document.addEventListener('elintervalclicked', handleVideoPlaying)
    videoCopy.addEventListener('canplay', handleVideoLoaded)
    return () => {
      document.removeEventListener('elintervalclicked', handleVideoPlaying)
      videoCopy.removeEventListener('canplay', handleVideoLoaded)
    }
  }, [])

  return (<div key={video.video} className="">
  <div className="bg-gray-900 rounded h-full pb-6 shadow">
    <video controls className="focus:outline-none" ref={videoReference} src={`http://localhost/mp4s/${video.video}`} />
    <div className="items-stretch grid-cols-1 grid">
    {video.violations.map((violation: Violation, index: number): JSX.Element => 
      <ViolationRow 
      videoDuration={duration}
      onClick={handleViolationClick}
      key={index}
      activity={violation.activity}
      time_intervals={violation.time_intervals} />)}
    </div>
    </div>
</div>)
}

function App() {
  return (
    <div className="shadow overflow-scroll h-screen bg-black text-white text-center">
     <div className="grid auto-cols-max justify-items-stretch gap-8 px-4 grid-cols-3 container text-black mx-auto min-h-screen pt-4">
      {videos.map((video: Video): JSX.Element => <VideoItem 
      key={video.video}
      video={video} />)}
     </div>
    </div>
  );
}

export default App;
