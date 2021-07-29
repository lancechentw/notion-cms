const { RichTextList } = require("./RichText.js");

// TODO
class DatabaseProperties {
  constructor(propertiesObj) {}

  get() {}
}

class PageProperties {
  constructor(propertiesObj) {
    this.srcProperties = propertiesObj;
    this.properties = {};
    this._convertProperties();
  }

  _convertProperties() {
    for (let name in this.srcProperties) {
      let srcProperty = this.srcProperties[name];
      switch (srcProperty.type) {
        case "rich_text":
          this.properties[name] = new RichTextList(srcProperty.rich_text);
          break;
        case "number":
          // TODO
          break;
        case "select":
          // TODO
          this.properties[name] = srcProperty.select.name;
          break;
        case "multi_select":
          this.properties[name] = srcProperty.multi_select.map((x) => x.name);
          break;
        case "date":
          // TODO
          break;
        case "formula":
          // TODO
          break;
        case "relation":
          // TODO
          break;
        case "rollup":
          // TODO
          break;
        case "title":
          this.properties[name] = new RichTextList(
            srcProperty.title
          ).toPlainText();
          break;
        case "people":
          // TODO
          break;
        case "files":
          // TODO
          break;
        case "checkbox":
          // TODO
          break;
        case "url":
          this.properties[name] = srcProperty.url;
          break;
        case "email":
          // TODO
          break;
        case "phone_number":
          // TODO
          break;
        case "created_time":
          // TODO
          break;
        case "created_by":
          // TODO
          break;
        case "last_edited_time":
          // TODO
          break;
        case "last_edited_by":
          // TODO
          break;
      }
    }
  }

  get() {
    return this.properties;
  }
}

module.exports = {
  DatabaseProperties,
  PageProperties,
};
