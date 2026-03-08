import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
    const posts = (await getCollection('blog'))
        .filter((post) => post.slug !== 'index')
        .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

    return rss({
        // `<title>` field in output xml
        title: 'iHealthy 生機實驗室',
        // `<description>` field in output xml
        description: '實證健康文章：飲食、保養、疾病照護，每篇附參考文獻與實用提醒。',
        // Pull in your project "site" from the endpoint context
        // https://docs.astro.build/en/reference/api-reference/#contextsite
        site: context.site || 'https://ihealthy.com.tw',
        // Array of `<item>`s in output xml
        // See "Generating items" section for examples using content collections and glob imports
        items: posts.map((post) => ({
            title: post.data.title,
            pubDate: post.data.pubDate,
            description: post.data.description,
            // Compute RSS link from post `slug`
            // This example assumes all posts are rendered as `/blog/[slug]` routes
            link: `/${post.slug}/`,
        })),
        // (optional) inject custom xml
        customData: `<language>zh-tw</language>`,
    });
}
