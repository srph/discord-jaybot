module.exports = function ellipsis(text, limit) {
  return text.limit > limit
    ? `${text}...`
    : text
}