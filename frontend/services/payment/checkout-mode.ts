/**
 * TEMPORARY CHECKOUT MODE TOGGLE
 * -------------------------------------------------------------------------
 * When `true`:
 *   - All "Plant a Tree" purchase flows (`PlantFlowModal`) and the
 *     "2M Trees Vision Donation" modal (`VisionDonationModal`) skip the
 *     Razorpay payment gateway completely.
 *   - Submitting saves the user's details and tree/plan selections directly
 *     to the Waitlist (`POST /api/v1/waitlist`) and shows a waitlist
 *     confirmation popup.
 *
 * How to re-enable live Razorpay payments once credentials are ready:
 *   - Change `TEMPORARY_WAITLIST_CHECKOUT` below from `true` to `false`.
 *   - All existing Razorpay checkout & order verification logic is preserved.
 */
export const TEMPORARY_WAITLIST_CHECKOUT = true;
