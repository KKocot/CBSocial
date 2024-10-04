import gb from "./messages/gb.json";

type Messages = typeof gb;

declare global {
  interface IntlMessages extends Messages {}
}
