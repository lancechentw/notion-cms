const cheerio = require("cheerio");
const mentionResolver = require("./MentionResolver");

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
        childNode.append('<span class="underline"></span>');
        childNode = childNode.children().last();
      }

      if (richText.annotations.code) {
        childNode.append("<code></code>");
        childNode = childNode.children().last();
      }

      if (richText.annotations.color !== "default") {
        let className = '';
        let [color, isBackground] = richText.annotations.color.split('_');
        if (isBackground) {
          className = `bg-${color}-300`;
        } else {
          className = `text-${color}-900`;
        }

        childNode.append(
          `<span class="${className}"></span>`
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
          } else if (
            richText.mention.type === "page" ||
            richText.mention.type === "database" ||
            richText.mention.type === "user"
          ) {
            const result = mentionResolver.resolve(richText);
            if (result?.type === "url") {
              childNode.append(
                `<a href="${result.url}">${richText.plain_text}</a>`
              );
            } else if (result?.type === "html") {
              childNode.append(result.html);
            } else {
              const id =
                richText.mention?.page?.id ||
                richText.mention?.database?.id ||
                richText.mention?.user?.id;
              console.log(
                `${richText.mention.type} ${id} is not resolved, configure a MentionResolver if you want it to be something other than plain text.`
              );
              childNode.append(richText.plain_text);
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
