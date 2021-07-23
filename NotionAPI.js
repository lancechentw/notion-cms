const https = require("https");

const NOTION_VERSION = "2021-05-13";

class NotionAPI {
  constructor(token) {
    this.token = token;
  }

  async getDatabase(databaseId) {
    const options = {
      host: "api.notion.com",
      path: `/v1/databases/${databaseId}`,
      method: "GET",
      port: 443,
      headers: {
        "Notion-Version": NOTION_VERSION,
        Authorization: `Bearer ${this.token}`,
      },
    };

    return await this.#_request(options, {});
  }

  async queryDatabase(databaseId, filter) {
    const options = {
      host: "api.notion.com",
      path: `/v1/databases/${databaseId}/query`,
      method: "POST",
      port: 443,
      headers: {
        "Notion-Version": NOTION_VERSION,
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
    };

    let body = {
      filter,
    };

    return await this.#_request(options, body);
  }

  async getBlockChildren(blockId) {
    let options = {
      host: "api.notion.com",
      path: `/v1/blocks/${blockId}/children`,
      method: "GET",
      headers: {
        "Notion-Version": NOTION_VERSION,
        Authorization: `Bearer ${this.token}`,
      },
    };

    return this.#_request(options, {});
  }

  #_request(options, body) {
    return new Promise((resolve, reject) => {
      let req = https.request(options, (res) => {
        let raw = "";
        res.on("data", (chunk) => {
          raw += chunk;
        });

        res.on("error", (err) => {
          reject(err);
        });

        res.on("end", () => {
          resolve(JSON.parse(raw));
        });
      });

      req.write(JSON.stringify(body));

      req.end();
    });
  }
}

module.exports = NotionAPI;
