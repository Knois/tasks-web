export const getEmailFromStore = () => {
  const email = localStorage.getItem("email");
  return email;
};

export const setEmailToStore = (email: string) => {
  localStorage.setItem("email", email);
};

export const deleteEmailFromStore = () => {
  localStorage.removeItem("email");
};

export const getPasswordFromStore = () => {
  const password = localStorage.getItem("password");
  return password;
};

export const setPasswordToStore = (password: string) => {
  localStorage.setItem("password", password);
};

export const deletePasswordFromStore = () => {
  localStorage.removeItem("password");
};

export const getTokenFromStore = () => {
  const token = localStorage.getItem("token");
  return token;
};

export const setTokenToStore = (token: string) => {
  localStorage.setItem("token", token);
};

export const deleteTokenFromStore = () => {
  localStorage.removeItem("token");
};

//получить начало диапазона годов для календаря
export const getRangeStartYear = (year: number) => year - (year % 12) + 2;

//получить конец диапазона годов для календаря
export const getRangeEndYear = (year: number) => getRangeStartYear(year) + 11;

export const getFormattedDate = (date: Date) => {
  return `${date.getDate()} ${date.toLocaleString("en-US", { month: "long" })} ${date.getFullYear()} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
};
