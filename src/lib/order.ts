import { ORDER_STORAGE_PREFIX } from "@/lib/cart";
import { calculateSubtotal, isConfirmedPrice } from "@/lib/utils";
import type { OrderDraft } from "@/types";

export function saveOrderDraft(storage: Storage, draft: OrderDraft) {
  try {
    storage.setItem(`${ORDER_STORAGE_PREFIX}${draft.reference}`, JSON.stringify(draft));
    return true;
  } catch {
    return false;
  }
}

function isPriceOrPending(value: unknown) {
  return value === null || isConfirmedPrice(value);
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
      !isPriceOrPending(draft.subtotal) ||
      !isPriceOrPending(draft.total) ||
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
        isPriceOrPending(item.price) &&
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

    // Pending-price drafts must stay pending; older, fully priced drafts still work.
    const subtotal = calculateSubtotal(draft.items);
    if (draft.subtotal !== subtotal || draft.total !== subtotal) return null;
    return draft as OrderDraft;
  } catch {
    return null;
  }
}
