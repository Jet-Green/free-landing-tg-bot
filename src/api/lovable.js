export const Lovable = {
  getLink: function (prompt, images) {
    // Кодируем prompt, заменяя пробелы на %20 (encodeURIComponent делает это и больше)
    const encodedPrompt = encodeURIComponent(prompt);

    // Начинаем строить URL
    let url = `https://lovable.dev/?autosubmit=true#prompt=${encodedPrompt}`;

    // Добавляем каждый URL из массива images как отдельный параметр images=
    if (images && images.length) {
      const imageParams = images
        .map((img) => encodeURIComponent(img))
        .map((encodedImg) => `&images=${encodedImg}`)
        .join("");
      url += imageParams;
    }

    return url;
  },
};
export default Lovable;
