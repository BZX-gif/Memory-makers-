import { ORDER_STORAGE_PREFIX } from "@/lib/cart";
import { calculateOrderTotals } from "@/lib/pricing";
import { isConfirmedPrice } from "@/lib/utils";
import type { OrderDraft } from "@/types";

export function saveOrderDraft(storage: Storage, draft: OrderDraft) {
  try {
    storage.setItem(`${ORDER_STORAGE_PREFIX}${draft.reference}`, JSON.stringify(draft));
    return true;
  } catch {
    return false;
  }
}

export function readOrderDraft(storage: Storage, reference: string): OrderDraft | null {
  try {
    if (!/^MM-[A-Z2-9]{6}$/.test(reference)) return null;
    const raw = storage.getItem(`${ORDER_STORAGE_PREFIX}${reference}`);
    if (!raw) return null;
    const draft = JSON.parse(raw) as Partial<OrderDraft>;
    if (
      draft.reference !== reference ||
      typeof draft.createdAt !== "string" ||
      typeof draft.message !== "string" ||
      !draft.customer ||
      typeof draft.customer !== "object" ||
      !Array.isArray(draft.items) ||
      draft.items.length === 0 ||
      !isConfirmedPrice(draft.subtotal) ||
      !isConfirmedPrice(draft.bundleDiscount) ||
      !isConfirmedPrice(draft.shipping) ||
      !isConfirmedPrice(draft.total) ||
      (draft.source !== "cart" && draft.source !== "buy-now") ||
      !["fullName", "mobile", "address", "city", "state", "pinCode", "instructions"].every(
        (field) => typeof (draft.customer as unknown as Record<string, unknown>)[field] === "string",
      ) ||
      !draft.items.every((item) =>
        item &&
        typeof item.key === "string" &&
        typeof item.productId === "string" &&
        typeof item.slug === "string" &&
        typeof item.name === "string" &&
        typeof item.image === "string" &&
        item.image.startsWith("/images/") &&
        isConfirmedPrice(item.price) &&
        isConfirmedPrice(item.compareAtPrice) &&
        typeof item.maxQuantity === "number" &&
        Number.isInteger(item.maxQuantity) &&
        item.maxQuantity >= 1 &&
        typeof item.quantity === "number" &&
        Number.isInteger(item.quantity) &&
        item.quantity >= 1 && item.quantity <= 10 &&
        typeof item.size === "string" &&
        typeof item.color?.name === "string" &&
        typeof item.color?.hex === "string"
      )
    ) {
      return null;
    }

    // Recompute from the shared pricing module; reject drafts with edited money.
    const totals = calculateOrderTotals(draft.items);
    if (
      draft.subtotal !== totals.subtotal ||
      draft.bundleDiscount !== totals.bundleDiscount ||
      draft.shipping !== totals.shipping ||
      draft.total !== totals.total
    ) {
      return null;
    }

    return draft as OrderDraft;
  } catch {
    return null;
  }
}
