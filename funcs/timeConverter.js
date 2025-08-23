export const timeConverter = (dateStr) => {
  const date = new Date(dateStr);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayName = days[date.getUTCDay()];
  const day = String(date.getUTCDate()).padStart(2, "0");
  const monthName = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  const formatted = `${dayName}, ${day} ${monthName} ${year}, ${hours}:${minutes}:${seconds}`;

  return formatted;
};
