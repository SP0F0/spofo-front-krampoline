class JwtDecoder {
  authServer = import.meta.env.VITE_AUTH_SERVER;

  decode(token: string) {
    const base64Url: string = token.split('.')[1];
    const base64: string = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload: string = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  }
}

const jwtDecoder = new JwtDecoder();

export default jwtDecoder;
