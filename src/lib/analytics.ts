export function trackContactClick(type: 'call' | 'whatsapp') {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', type === 'call' ? 'call_click' : 'whatsapp_click', {
      event_category: 'contact',
      event_label: 'Budran Coffee Site',
    });
  }
}
