const truncateRegex = /^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{3})$/;

export const truncateAddress = (address: string) => {
  const match = address.match(truncateRegex);
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};

export const getInitials = (username: string): string => {
  const words = username.split(" ");

  const initials = words.map((word) => word.charAt(0)).join("");

  return initials.toUpperCase();
};
