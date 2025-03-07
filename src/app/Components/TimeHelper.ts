export const calculateTimeLeft = (start: Date, stop: Date) => {
  const startDate = new Date(start);
  const stopDate = new Date(stop);
  const now = new Date().getTime();

   if (now < startDate.getTime()) return stopDate.getTime() - startDate.getTime() > 0 ? Math.floor((stopDate.getTime() - startDate.getTime()) / 1000) : 0;
  if (now >= stopDate.getTime()) return 0;

  return Math.floor((stopDate.getTime() - now) / 1000); 
};


export const formatTime = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};
