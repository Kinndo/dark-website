// Meta Pixel tracking helper
// Wraps fbq calls with safety checks

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
  }
}

type FbqStandardEvent =
  | 'AddToCart'
  | 'InitiateCheckout'
  | 'Purchase'
  | 'Lead'
  | 'CompleteRegistration'
  | 'ViewContent'
  | 'Search'
  | 'AddPaymentInfo'
  | 'AddToWishlist'
  | 'Contact'
  | 'Subscribe';

interface TrackParams {
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  content_type?: string;
  value?: number;
  currency?: string;
  num_items?: number;
  [key: string]: unknown;
}

function fbq(action: string, event: string, params?: TrackParams) {
  if (typeof window !== 'undefined' && window.fbq) {
    if (params) {
      window.fbq(action, event, params);
    } else {
      window.fbq(action, event);
    }
  }
}

// ─── Standard Events ───

export function trackAddToCart(name: string, price: number, currency = 'USD') {
  fbq('track', 'AddToCart', {
    content_name: name,
    content_type: 'product',
    value: price,
    currency,
  });
}

export function trackInitiateCheckout(value: number, numItems = 1, currency = 'USD') {
  fbq('track', 'InitiateCheckout', {
    value,
    currency,
    num_items: numItems,
  });
}

export function trackPurchase(value: number, currency = 'USD') {
  fbq('track', 'Purchase', {
    value,
    currency,
  });
}

export function trackLead(contentName?: string) {
  fbq('track', 'Lead', contentName ? { content_name: contentName } : undefined);
}

export function trackSubscribe(contentName?: string) {
  fbq('track', 'Subscribe' as FbqStandardEvent, contentName ? { content_name: contentName } : undefined);
}

export function trackViewContent(name: string, category?: string) {
  fbq('track', 'ViewContent', {
    content_name: name,
    content_category: category,
  });
}

export function trackCompleteRegistration(contentName?: string) {
  fbq('track', 'CompleteRegistration', contentName ? { content_name: contentName } : undefined);
}

// ─── Custom Events ───

export function trackCustom(event: string, params?: TrackParams) {
  fbq('trackCustom', event, params);
}

export function trackQuizStart() {
  trackCustom('QuizStart');
}

export function trackQuizComplete(segment?: string) {
  trackCustom('QuizComplete', segment ? { content_name: segment } : undefined);
}

export function trackQuizAnswer(questionId: string, answer: string) {
  trackCustom('QuizAnswer', { content_name: questionId, content_category: answer });
}

export function trackEmailSignup(source: string) {
  trackLead(source);
  trackCustom('EmailSignup', { content_name: source });
}

export function trackCTAClick(ctaName: string, page: string) {
  trackCustom('CTAClick', { content_name: ctaName, content_category: page });
}

export function trackShareClick(platform: string) {
  trackCustom('ShareClick', { content_name: platform });
}

export function trackArticleRead(articleTitle: string) {
  trackCustom('ArticleRead', { content_name: articleTitle });
}
