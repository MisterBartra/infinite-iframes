export const parseUrlParams = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const urlRowIframes = searchParams.get('urlRowIframes');
  
  return {
    urlRowIframes: urlRowIframes ? JSON.parse(decodeURIComponent(urlRowIframes)) : null,
    title: searchParams.get('title'),
  };
};

