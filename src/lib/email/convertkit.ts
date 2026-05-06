// ConvertKit removed — internal newsletter system now handles all subscriptions.
// This file is kept as a no-op to avoid breaking any lingering imports.

export const CK_FORMS = { newsletter: '', tpiLeads: '' }

export async function subscribeToForm(_opts: unknown) {
  return { subscribed: false, reason: 'convertkit_removed' }
}
