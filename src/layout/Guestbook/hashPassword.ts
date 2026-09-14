// 방명록 비밀번호는 평문으로 저장하지 않고 SHA-256 해시로만 저장/비교합니다.
export const hashPassword = async (password: string): Promise<string> => {
  const encoded = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};
