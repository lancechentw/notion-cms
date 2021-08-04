const { RichTextList } = require("./RichText");

const MOCK_MENTION_RICH_TEXT_LIST = [
  {
    type: "mention",
    mention: {
      type: "page",
      page: {
        id: "68cec333-ac2a-4044-b720-9cd742f8fbd0",
      },
    },
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: "default",
    },
    plain_text: "How notioncms.dev is built with Eleventy and Notion CMS",
    href: "https://www.notion.so/68cec333ac2a4044b7209cd742f8fbd0",
  },
  {
    type: "mention",
    mention: {
      type: "database",
      database: {
        id: "10b45c7b-7eac-44bb-8d7f-d8bb12deb998",
      },
    },
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: "default",
    },
    plain_text: "Guides",
    href: "https://www.notion.so/10b45c7b7eac44bb8d7fd8bb12deb998",
  },
  {
    type: "mention",
    mention: {
      type: "user",
      user: {
        object: "user",
        id: "309c630b-2c5a-48fa-9a2f-9540f32499a2",
        name: "Lance Chen",
        avatar_url:
          "https://lh6.googleusercontent.com/-KRqNUOaK6vk/AAAAAAAAAAI/AAAAAAAAAPM/Lv5TcqwJY3o/photo.jpg?sz=50",
        type: "person",
        person: {
          email: "user@example.com",
        },
      },
    },
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: "default",
    },
    plain_text: "@Lance Chen",
    href: null,
  },
];

test("should trigger mentionResolver callback", async () => {
  const mentionResolverCallback = jest.fn();

  const mentionResolver = require("./MentionResolver.js");
  mentionResolver.setResolver(mentionResolverCallback);

  const result = new RichTextList(MOCK_MENTION_RICH_TEXT_LIST).toHTML();

  expect(mentionResolverCallback).toHaveBeenCalledTimes(3);
  expect(result).toEqual(
    "How notioncms.dev is built with Eleventy and Notion CMSGuides@Lance Chen"
  );
});

test("should resolve to <a> tag", async () => {
  const mentionResolverCallback = jest.fn((richText) => {
    if (
      richText.type === "mention" &&
      richText.mention.type === "page" &&
      richText.mention.page.id === "68cec333-ac2a-4044-b720-9cd742f8fbd0"
    ) {
      return {
        type: "url",
        url: "https://notioncms.dev/guides/how-notioncms.dev-is-built-with-eleventy-and-notion-cms/",
      };
    }
  });

  const mentionResolver = require("./MentionResolver.js");
  mentionResolver.setResolver(mentionResolverCallback);

  const result = new RichTextList(MOCK_MENTION_RICH_TEXT_LIST).toHTML();

  expect(mentionResolverCallback).toHaveBeenCalledTimes(3);
  expect(result).toEqual(
    '<a href="https://notioncms.dev/guides/how-notioncms.dev-is-built-with-eleventy-and-notion-cms/">How notioncms.dev is built with Eleventy and Notion CMS</a>Guides@Lance Chen'
  );
});

test("should resolve to raw HTML", async () => {
  // NOTE: Twitter actually generates the script tag with the async attribute set as just `async`, it is changed to `async=""` since cheerio makes it so.
  const TWITTER_FOLLOW_BUTTON =
    '<a href="https://twitter.com/lancechentw?ref_src=twsrc%5Etfw" class="twitter-follow-button" data-show-count="false">Follow @lancechentw</a><script async="" src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>';
  const mentionResolverCallback = jest.fn((richText) => {
    if (
      richText.type === "mention" &&
      richText.mention.type === "user" &&
      richText.mention.user.id === "309c630b-2c5a-48fa-9a2f-9540f32499a2"
    ) {
      return {
        type: "html",
        html: TWITTER_FOLLOW_BUTTON,
      };
    }
  });

  const mentionResolver = require("./MentionResolver.js");
  mentionResolver.setResolver(mentionResolverCallback);

  const result = new RichTextList(MOCK_MENTION_RICH_TEXT_LIST).toHTML();

  expect(mentionResolverCallback).toHaveBeenCalledTimes(3);
  expect(result).toEqual(
    `How notioncms.dev is built with Eleventy and Notion CMSGuides${TWITTER_FOLLOW_BUTTON}`
  );
});
