import en from "@/messages/en.json";

type Messages = typeof en;

declare global {
  // Use type safe messages with next-intl
  interface IntlMessages extends Messages {}
}
