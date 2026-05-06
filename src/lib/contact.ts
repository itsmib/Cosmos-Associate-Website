// Shared contact details. Single source of truth so the homepage Contact
// section, the floating WhatsApp button, the Hero CTA and the project detail
// page all interpolate the same number and message template.

export const PHONE = "+919944348827";
export const PHONE_DISPLAY = "+91 99443 48827";
export const OFFICE_MAPS_URL = "https://maps.app.goo.gl/FsfYS14fNTbWTHDp7";
// Google Business Profile listing — the reviews tab is reachable from here.
// Defaults to the same shortlink as OFFICE_MAPS_URL so all "see all reviews"
// CTAs land on the verified Cosmos GBP page. Replace with a deep-link to the
// reviews surface (e.g. https://search.google.com/local/reviews?placeid=...)
// once the GBP placeId is on hand.
export const GOOGLE_REVIEWS_URL = "https://search.google.com/local/writereview?placeid=ChIJ2RDmyiYRVToRRwlANvieaaA";

const WHATSAPP_BASE = "https://wa.me/919944348827?text=";
const DEFAULT_MESSAGE =
  "Hello, I am interested in your properties. Please share more details.";

export const WHATSAPP = WHATSAPP_BASE + encodeURIComponent(DEFAULT_MESSAGE);

/** Build a WhatsApp link with a property-specific prefilled message. */
export function whatsappFor(propertyName: string) {
  const msg = `Hello, I'm interested in the ${propertyName} property. Please share more details.`;
  return WHATSAPP_BASE + encodeURIComponent(msg);
}
