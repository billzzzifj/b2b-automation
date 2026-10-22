/**
 * Lagos B2B Lead Funnel & Outreach Automation Factory
 * URL State Synchronization Utility (Sharable Configurations)
 * 
 * Synchronizes calculator parameters into Hash Routing query params:
 * Format: /#/demo/[company-slug]?param1=val1&param2=val2
 */

export function getHashParams() {
  if (typeof window === 'undefined') return {};
  
  const hash = window.location.hash || '';
  const queryIndex = hash.indexOf('?');
  
  let queryStr = '';
  if (queryIndex !== -1) {
    queryStr = hash.slice(queryIndex + 1);
  } else if (window.location.search) {
    queryStr = window.location.search.replace(/^\?/, '');
  }

  const params = {};
  if (!queryStr) return params;

  const searchParams = new URLSearchParams(queryStr);
  for (const [key, val] of searchParams.entries()) {
    params[key] = val;
  }
  return params;
}

export function updateHashParams(newParams, companySlug) {
  if (typeof window === 'undefined') return;

  const currentParams = getHashParams();
  const merged = { ...currentParams, ...newParams };

  // Remove empty or undefined keys
  Object.keys(merged).forEach(k => {
    if (merged[k] === undefined || merged[k] === null || merged[k] === '') {
      delete merged[k];
    }
  });

  const searchParams = new URLSearchParams();
  Object.entries(merged).forEach(([k, v]) => {
    searchParams.set(k, String(v));
  });

  const queryStr = searchParams.toString();
  const slug = companySlug || (window.location.hash.split('?')[0].replace('#/demo/', '').replace(/\/$/, '') || 'cargo-naija');
  const newHash = queryStr ? `#/demo/${slug}?${queryStr}` : `#/demo/${slug}`;

  // Replace state smoothly without creating infinite history entries
  window.history.replaceState(null, '', newHash);
}

export function buildShareUrl(companySlug, params) {
  if (typeof window === 'undefined') return '';
  const origin = window.location.origin;
  const searchParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        searchParams.set(k, String(v));
      }
    });
  }

  const queryStr = searchParams.toString();
  return queryStr 
    ? `${origin}/#/demo/${companySlug}?${queryStr}`
    : `${origin}/#/demo/${companySlug}`;
}
