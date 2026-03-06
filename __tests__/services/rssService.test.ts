import { fetchRssFeed } from '@/services/rssService';
import { RssFeed } from '@/types/news';

const makeFeed = (overrides: Partial<RssFeed> = {}): RssFeed => ({
  id: 'test-feed',
  name: 'Test Feed',
  url: 'https://example.com/feed',
  enabled: true,
  ...overrides,
});

const makeResponse = (body: string, status = 200): Response =>
  ({
    ok: status >= 200 && status < 300,
    status,
    text: async () => body,
  } as Response);

const rssXml = (items: string) => `
<rss version="2.0">
  <channel>
    <title>Test Channel</title>
    ${items}
  </channel>
</rss>`;

const rssItem = ({
  title = 'Test Article',
  link = 'https://example.com/article',
  description = 'Test description',
  pubDate = 'Mon, 01 Jan 2024 00:00:00 GMT',
  extra = '',
} = {}) => `
<item>
  <title>${title}</title>
  <link>${link}</link>
  <description>${description}</description>
  ${pubDate ? `<pubDate>${pubDate}</pubDate>` : ''}
  ${extra}
</item>`;

describe('fetchRssFeed', () => {
  let fetchSpy: jest.SpyInstance;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, 'fetch');
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    fetchSpy.mockRestore();
    consoleSpy.mockRestore();
    jest.useRealTimers();
  });

  describe('successful parse', () => {
    it('returns articles with correct fields', async () => {
      fetchSpy.mockResolvedValue(
        makeResponse(rssXml(rssItem({ title: 'Hello', link: 'https://example.com/1', description: 'Desc' })))
      );
      const results = await fetchRssFeed(makeFeed());
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Hello');
      expect(results[0].url).toBe('https://example.com/1');
      expect(results[0].source).toBe('Test Feed');
      expect(results[0].category).toBe('Test Feed');
    });

    it('uses current date when pubDate is absent', async () => {
      const before = new Date().toISOString().slice(0, 10);
      fetchSpy.mockResolvedValue(
        makeResponse(rssXml(rssItem({ pubDate: '' })))
      );
      const results = await fetchRssFeed(makeFeed());
      expect(results[0].publishedAt.slice(0, 10)).toBe(before);
    });
  });

  describe('HTML entity decoding', () => {
    const entityCases: Array<[string, string, string]> = [
      ['&amp;', '&', 'ampersand'],
      ['&lt;', '<', 'less-than'],
      ['&gt;', '>', 'greater-than'],
      ['&quot;', '"', 'quote'],
      ['&#039;', "'", 'single-quote'],
      ['&nbsp;', ' ', 'nbsp'],
      ['&ndash;', '–', 'ndash'],
      ['&mdash;', '—', 'mdash'],
    ];

    it.each(entityCases)('decodes %s in titles', async (entity, decoded) => {
      fetchSpy.mockResolvedValue(
        makeResponse(rssXml(rssItem({ title: `Before ${entity} After` })))
      );
      const results = await fetchRssFeed(makeFeed());
      expect(results[0].title).toBe(`Before ${decoded} After`);
    });
  });

  describe('image extraction', () => {
    it('extracts imageUrl from a single enclosure', async () => {
      fetchSpy.mockResolvedValue(
        makeResponse(
          rssXml(
            rssItem({
              extra: '<enclosure url="https://example.com/img.jpg" type="image/jpeg" length="12345" />',
            })
          )
        )
      );
      const results = await fetchRssFeed(makeFeed());
      expect(results[0].imageUrl).toBe('https://example.com/img.jpg');
    });

    it('extracts imageUrl from haarlemupdates.nl via content:encoded img tag', async () => {
      const xml = rssXml(`
        <item>
          <title>Haarlem Article</title>
          <link>https://www.haarlemupdates.nl/article</link>
          <description>Desc</description>
          <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
          <content:encoded><![CDATA[<img src="https://www.haarlemupdates.nl/wp-content/uploads/photo.jpg" />]]></content:encoded>
        </item>`);
      fetchSpy.mockResolvedValue(makeResponse(xml));
      const results = await fetchRssFeed(makeFeed({ url: 'https://www.haarlemupdates.nl/feed/' }));
      expect(results[0].imageUrl).toBe('https://www.haarlemupdates.nl/wp-content/uploads/photo.jpg');
    });
  });

  describe('error cases', () => {
    it('returns [] on non-OK HTTP status (404)', async () => {
      fetchSpy.mockResolvedValue(makeResponse('Not Found', 404));
      const results = await fetchRssFeed(makeFeed());
      expect(results).toEqual([]);
    });

    it('returns [] on invalid XML', async () => {
      fetchSpy.mockResolvedValue(makeResponse('not xml at all {{{{'));
      const results = await fetchRssFeed(makeFeed());
      expect(results).toEqual([]);
    });

    it('returns [] on empty XML (no items)', async () => {
      fetchSpy.mockResolvedValue(makeResponse('<rss><channel><title>Empty</title></channel></rss>'));
      const results = await fetchRssFeed(makeFeed());
      expect(results).toEqual([]);
    });

    it('retries on TypeError and returns [] after exhausting retries', async () => {
      jest.useFakeTimers();
      fetchSpy.mockRejectedValue(new TypeError('Network failed'));

      const promise = fetchRssFeed(makeFeed());
      await jest.runAllTimersAsync();
      const results = await promise;

      expect(results).toEqual([]);
      // 1 original + 3 retries = 4 calls
      expect(fetchSpy).toHaveBeenCalledTimes(4);
    });
  });
});
