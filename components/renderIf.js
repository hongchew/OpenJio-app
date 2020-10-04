export default function renderIf(condition, content, empty) {
  if (condition) {
    return content;
  } else {
    return empty;
  }
}
