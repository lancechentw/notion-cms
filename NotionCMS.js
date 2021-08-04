const cheerio = require("cheerio");
const NotionAPI = require("./NotionAPI.js");
const { RichTextList } = require("./RichText.js");
const { DatabaseProperties, PageProperties } = require("./Property");
const mentionResolver = require("./MentionResolver");

class NotionCMS {
  constructor(token, mentionResolverCallback) {
    this.notionApi = new NotionAPI(token);
    mentionResolver.setResolver(mentionResolverCallback);
  }

  async getContentOfDatabase(databaseId, filter, sorts) {
    const databaseObj = await this.notionApi.getDatabase(databaseId);
    // TODO handle has_more
    const pageListObj = await this.notionApi.queryDatabase(
      databaseId,
      filter,
      sorts
    );

    const pages = await Promise.all(
      pageListObj.results.map(async (pageObj) => {
        return {
          id: pageObj.id,
          object: "page",
          created_time: new Date(pageObj.created_time),
          last_edited_time: new Date(pageObj.last_edited_time),
          archived: pageObj.archived,
          url: pageObj.url,
          properties: new PageProperties(pageObj.properties).get(),
          body: await this._convertPageToHTML(pageObj.id),
        };
      })
    );

    return {
      id: databaseObj.id,
      object: "database",
      title: new RichTextList(databaseObj.title).toPlainText(),
      created_time: new Date(databaseObj.created_time),
      last_edited_time: new Date(databaseObj.last_edited_time),
      pages: pages,
    };
  }

  async getContentOfPage(pageId) {
    const pageObj = await this.notionApi.getPage(pageId);

    return {
      id: pageObj.id,
      object: "page",
      created_time: new Date(pageObj.created_time),
      last_edited_time: new Date(pageObj.last_edited_time),
      archived: pageObj.archived,
      url: pageObj.url,
      properties: new PageProperties(pageObj.properties).get(),
      body: await this._convertPageToHTML(pageObj.id),
    };
  }

  async _convertPageToHTML(id) {
    const dom = cheerio.load("<div></div>", null, false);
    await this._convertBlockToHTML(id, dom("div"));
    return dom("div").html();
  }

  async _convertBlockToHTML(id, node) {
    // TODO handle has_more
    const blockChildren = await this.notionApi.getBlockChildren(id, {});
    for (const [i, block] of blockChildren.results.entries()) {
      let childNode = node;
      switch (block.type) {
        case "paragraph":
          if (block.has_children) {
            childNode.append('<div class="pl-8"></div>');
            childNode = childNode.children().last();
          }

          childNode.append("<p></p>");
          childNode = childNode.children().last();
          childNode.append(new RichTextList(block.paragraph.text).toHTML());

          if (block.has_children) {
            childNode = childNode.parent();
            childNode.append('<div class="pl-8"></div>');
            childNode = childNode.children().last();
          }
          break;
        case "heading_1":
          childNode.append("<h1></h1>");
          childNode = childNode.children().last();
          childNode.append(new RichTextList(block.heading_1.text).toHTML());
          break;
        case "heading_2":
          childNode.append("<h2></h2>");
          childNode = childNode.children().last();
          childNode.append(new RichTextList(block.heading_2.text).toHTML());
          break;
        case "heading_3":
          childNode.append("<h3></h3>");
          childNode = childNode.children().last();
          childNode.append(new RichTextList(block.heading_3.text).toHTML());
          break;
        case "bulleted_list_item":
          if (
            i == 0 ||
            blockChildren.results[i - 1].type != "bulleted_list_item"
          ) {
            childNode.append("<ul></ul>");
            childNode = childNode.children().last();
          } else {
            childNode = childNode.children().last();
          }

          childNode.append("<li></li>");
          childNode = childNode.children().last();
          childNode.append(
            new RichTextList(block.bulleted_list_item.text).toHTML()
          );
          break;
        case "numbered_list_item":
          if (
            i == 0 ||
            blockChildren.results[i - 1].type != "numbered_list_item"
          ) {
            childNode.append("<ol></ol>");
            childNode = childNode.children().last();
          } else {
            childNode = childNode.children().last();
          }

          childNode.append("<li></li>");
          childNode = childNode.children().last();
          childNode.append(
            new RichTextList(block.numbered_list_item.text).toHTML()
          );
          break;
        case "to_do":
          if (block.has_children) {
            childNode.append('<div class="pl-8"></div>');
            childNode = childNode.children().last();
          }
          // TODO: create random id to bind label to input
          childNode.append(
            `<div><input type="checkbox" disabled ${
              block.to_do.checked ? "checked" : ""
            }><label></label></div>`
          );
          childNode = childNode.children().last();
          childNode = childNode.children().last();
          childNode.append(new RichTextList(block.to_do.text).toHTML());

          if (block.has_children) {
            childNode = childNode.parent();
            childNode.append('<div class="pl-8"></div>');
            childNode = childNode.children().last();
          }
          break;
        case "toggle":
          childNode.append("<details><summary></summary></details>");
          childNode = childNode.children().last();
          childNode = childNode.children().last();
          childNode.append(new RichTextList(block.toggle.text).toHTML());

          if (block.has_children) {
            childNode = childNode.parent();
          }
          break;
        case "child_page":
          break;
        case "unsupported":
          break;
        default:
          break;
      }
      if (block.has_children) {
        await this._convertBlockToHTML(block.id, childNode);
      }
    }
  }
}

module.exports = NotionCMS;
