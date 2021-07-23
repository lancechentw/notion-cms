const cheerio = require("cheerio");

class RichTextList {
  constructor(richTextList) {
    this.richTextList = richTextList;
    this.dom = cheerio.load("<div></div>", null, false);
  }

  toHTML() {
    for (const richText of this.richTextList) {
      let childNode = this.dom("div");

      if (richText.annotations.bold) {
        childNode.append("<strong></strong>");
        childNode = childNode.children().last();
      }

      if (richText.annotations.italic) {
        childNode.append("<em></em>");
        childNode = childNode.children().last();
      }

      if (richText.annotations.strikethrough) {
        childNode.append("<s></s>");
        childNode = childNode.children().last();
      }

      if (richText.annotations.underline) {
        childNode.append('<span class="notioncms-underline"></span>');
        childNode = childNode.children().last();
      }

      if (richText.annotations.code) {
        childNode.append("<code></code>");
        childNode = childNode.children().last();
      }

      if (richText.annotations.color !== "default") {
        childNode.append(
          `<span class="notioncms-color-${richText.annotations.color}"></span>`
        );
        childNode = childNode.children().last();
      }

      switch (richText.type) {
        case "text":
          if (richText.text.link !== null) {
            childNode.append(
              `<a href="${richText.text.link.url}">${richText.text.content}</a>`
            );
          } else {
            childNode.append(richText.text.content);
          }
          break;
        case "mention":
          // NOTE: `user`, `page`, and `database` mentions are internal to Notion,
          // thus are not supported here.
          if (richText.mention.type === "date") {
            if (richText.mention.date.end !== null) {
              childNode.append(
                `<time datetime="${richText.mention.date.start}">${new Date(
                  richText.mention.date.start
                ).toString()}</time>-><time datetime="${
                  richText.mention.date.end
                }">${new Date(richText.mention.date.end).toString()}</time>`
              );
            } else {
              childNode.append(
                `<time datetime="${richText.mention.date.start}">${new Date(
                  richText.mention.date.start
                ).toString()}</time>`
              );
            }
          }
          break;
        case "equation":
          // TODO
          break;
      }
    }

    return this.dom("div").html();
  }

  toPlainText() {
    return this.richTextList.map((richText) => richText.plain_text).join("");
  }
}

module.exports = {
  RichTextList,
};
