function getCookie(cname) {
  const name = cname + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');

  const values = ca.filter(cookie => {
    return cookie.trim().slice(0, name.length) === name;
  });

  if (!values[0]) return;

  return values[0].trim().slice(name.length);
}