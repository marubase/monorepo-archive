import { asc, desc } from "@marubase/collator";

export type TransactionOrder = {
  asc: typeof asc;
  desc: typeof desc;
};
