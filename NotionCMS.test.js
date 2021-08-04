const NotionCMS = require("./NotionCMS.js");
const {
  DATABASE_OBJ_MOCK,
  PAGE_LIST_OBJ_MOCK,
  BLOCK_LIST_OBJ_MOCKS,
} = require("./mockdata.js");

jest.mock("./NotionAPI.js");
const NotionAPI = require("./NotionAPI.js");
NotionAPI.mockImplementation(() => {
  return {
    getDatabase: jest.fn().mockImplementation(() => {
      return DATABASE_OBJ_MOCK;
    }),
    queryDatabase: jest.fn().mockImplementation(() => {
      return PAGE_LIST_OBJ_MOCK;
    }),
    getBlockChildren: jest
      .fn()
      .mockImplementationOnce(() => {
        return BLOCK_LIST_OBJ_MOCKS[0];
      })
      .mockImplementationOnce(() => {
        return BLOCK_LIST_OBJ_MOCKS[1];
      })
      .mockImplementationOnce(() => {
        return BLOCK_LIST_OBJ_MOCKS[2];
      })
      .mockImplementationOnce(() => {
        return BLOCK_LIST_OBJ_MOCKS[3];
      })
      .mockImplementationOnce(() => {
        return BLOCK_LIST_OBJ_MOCKS[4];
      })
      .mockImplementationOnce(() => {
        return BLOCK_LIST_OBJ_MOCKS[5];
      })
      .mockImplementationOnce(() => {
        return BLOCK_LIST_OBJ_MOCKS[6];
      })
      .mockImplementationOnce(() => {
        return BLOCK_LIST_OBJ_MOCKS[7];
      })
      .mockImplementationOnce(() => {
        return BLOCK_LIST_OBJ_MOCKS[8];
      })
      .mockImplementationOnce(() => {
        return BLOCK_LIST_OBJ_MOCKS[9];
      })
      .mockImplementationOnce(() => {
        return BLOCK_LIST_OBJ_MOCKS[10];
      })
      .mockImplementationOnce(() => {
        return BLOCK_LIST_OBJ_MOCKS[11];
      })
      .mockImplementationOnce(() => {
        return BLOCK_LIST_OBJ_MOCKS[12];
      })
      .mockImplementationOnce(() => {
        return BLOCK_LIST_OBJ_MOCKS[13];
      })
      .mockImplementationOnce(() => {
        return BLOCK_LIST_OBJ_MOCKS[14];
      })
      .mockImplementationOnce(() => {
        return BLOCK_LIST_OBJ_MOCKS[15];
      })
      .mockImplementationOnce(() => {
        return BLOCK_LIST_OBJ_MOCKS[16];
      })
      .mockImplementationOnce(() => {
        return BLOCK_LIST_OBJ_MOCKS[17];
      })
      .mockImplementationOnce(() => {
        return BLOCK_LIST_OBJ_MOCKS[18];
      })
      .mockImplementationOnce(() => {
        return BLOCK_LIST_OBJ_MOCKS[19];
      })
      .mockImplementationOnce(() => {
        return BLOCK_LIST_OBJ_MOCKS[20];
      })
      .mockImplementationOnce(() => {
        return BLOCK_LIST_OBJ_MOCKS[21];
      })
      .mockImplementationOnce(() => {
        return BLOCK_LIST_OBJ_MOCKS[22];
      }),
  };
});

test("should return correct object", async () => {
  const fakeDatabaseId = "aadd47489df44937a85b7f09d483f372";
  const fakeFilter = {
    property: "published",
    checkbox: {
      equals: true,
    },
  };
  const fakeToken = "fake-token";

  const cms = new NotionCMS(fakeToken);
  const content = await cms.getContentOfDatabase(fakeDatabaseId, fakeFilter);

  expect(content).toEqual({
    id: "aadd4748-9df4-4937-a85b-7f09d483f372",
    object: "database",
    title: "Commonplace Book",
    created_time: new Date("2021-07-10T07:55:00.000Z"),
    last_edited_time: new Date("2021-07-21T01:13:00.000Z"),
    pages: [
      {
        id: "5360f42c-12e9-4cfd-a792-a59c0bce5645",
        object: "page",
        created_time: new Date("2021-07-19T15:08:00.000Z"),
        last_edited_time: new Date("2021-07-22T16:26:00.000Z"),
        archived: false,
        url:
          "https://www.notion.so/Copy-of-A-decade-long-retrospective-with-Ben-Orenstein-1a975176359a45808f6969c0af917f9a",
        properties: {
          Name: "Copy of A decade long retrospective with Ben Orenstein",
          Tags: ["podcast"],
          refUrl:
            "https://www.softwaresessions.com/episodes/a-decade-long-retrospective-with-ben-orenstein/",
        },
        body:
          '<h1>heading1 <strong><em><s><span class="underline"><code><span class="text-green-900">heading1</span></code></span></s></em></strong></h1><h2>heading2 <span class="underline"><span class="bg-blue-300">heading2</span></span></h2><h3>heading3 <s>heading3</s></h3><div class="pl-8"><p>paragraph <time datetime="2021-07-19">Mon Jul 19 2021 08:00:00 GMT+0800 (Taipei Standard Time)</time>  <a href="http://localhost">paragraph</a> <time datetime="2021-07-20T00:00:00.000+08:00">Tue Jul 20 2021 00:00:00 GMT+0800 (Taipei Standard Time)</time>-&gt;<time datetime="2021-07-23T00:00:00.000+08:00">Fri Jul 23 2021 00:00:00 GMT+0800 (Taipei Standard Time)</time> </p><div class="pl-8"><p>test</p></div></div><div class="pl-8"><p>paragraph <a href="/31a97fae71224827b6948d4ad1d3944e">link</a></p><div class="pl-8"><p>test</p><p>test</p></div></div><div class="pl-8"><p></p><div class="pl-8"><p>test</p></div></div><ul><li>ul1</li><li>ul2<ul><li>ul2-1</li><li>ul2-2<ul><li>ul2-2-1</li><li>ul2-2-2<div class="pl-8"><p>testparagraph</p><div class="pl-8"><p>testparagraph2</p></div></div><p>testparagraph3</p></li></ul></li></ul></li></ul><ol><li>ol1</li><li>ol2<ol><li>ol2-1</li><li>ol2-2<ol><li>ol2-2-1</li><li>ol2-2-2</li></ol></li></ol></li></ol><div class="pl-8"><div><input type="checkbox" disabled=""><label>todo1</label><div class="pl-8"><div><input type="checkbox" disabled=""><label>todo1-1</label></div><div class="pl-8"><p>test</p><div class="pl-8"><p>test</p></div></div><div class="pl-8"><div><input type="checkbox" disabled=""><label>todo1-2</label><div class="pl-8"><div class="pl-8"><div><input type="checkbox" disabled=""><label>todo1-2-1</label><div class="pl-8"><p>t</p></div></div></div><div><input type="checkbox" disabled=""><label>todo1-2-2</label></div></div></div></div></div></div></div><div><input type="checkbox" disabled="" checked=""><label>todo2</label></div><div><input type="checkbox" disabled=""><label>todo3</label></div><details><summary>toggle1</summary><p>toggle1 body1</p><div class="pl-8"><p>toggle1 body2</p><div class="pl-8"><p>toggle1 body2-1</p><p>toggle1 body2-2</p></div></div></details><details><summary>toggle2</summary><details><summary>toggle2-1</summary></details><details><summary>toggle2-2</summary><details><summary>toggle2-2-1</summary></details><details><summary>toggle2-2-2</summary><details><summary></summary></details></details></details></details><div class="pl-8"><p>test</p><div class="pl-8"><div class="pl-8"><p>test</p><div class="pl-8"><p>test</p></div></div></div></div>',
      },
    ],
  });
});

test("should register mentionResolver callback", async () => {
  const mentionResolverCallback = jest.fn();
  const cms = new NotionCMS("fake-token", mentionResolverCallback);
  const mentionResolver = require("./MentionResolver.js");
  expect(mentionResolver.callback).toEqual(mentionResolverCallback);
});
