const COMMENT_FONTS = ['NanumDoongeunInyeon', 'NanumHyeogi'];

// 방명록 글마다 폰트를 다르게 보여주되, 새로고침이나 다른 기기에서도
// 같은 글은 같은 폰트가 나오도록 id를 해시해서 고릅니다.
export const getCommentFont = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return `'${COMMENT_FONTS[hash % COMMENT_FONTS.length]}', 'SeochoBatang-Regular', serif`;
};
