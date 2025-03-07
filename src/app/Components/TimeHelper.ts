const getFullDateTime = (timeString: string) => {
  if (!timeString) return null;

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Construct full date-time string
  const fullDateTimeString = `${today}T${timeString.split('.').shift()}Z`;

  const date = new Date(fullDateTimeString);

  return date;
};

export const calculateTimeLeft = (start: string | Date, stop: string | Date) => {
  const startDate = getFullDateTime(typeof start === 'string' ? start : start.toISOString());
  const stopDate = getFullDateTime(typeof stop === 'string' ? stop : stop.toISOString());
  const now = new Date();

  console.log(startDate);
  console.log(stopDate);

  if (!startDate || !stopDate) return 0;

  // Check if the current time is within the start and stop range
  if (now < startDate || now > stopDate) {
    return 0;
  }

  const difference = stopDate.getTime() - now.getTime();

  return difference > 0 ? Math.floor(difference / 1000) : 0;
};

export const formatTime = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};
