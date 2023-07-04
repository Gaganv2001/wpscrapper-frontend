const corsProxyUrl = 'https://cors-anywhere.herokuapp.com';

export async function fetchHtmlContent(url) {
  const response = await fetch(`${corsProxyUrl}/${url}`);
  const htmlContent = await response.text();
  return htmlContent;
}
