/**
 * Medium HTML to Astro Markdown Converter
 * Run with: node scripts/convert-medium.cjs
 */

const fs = require('fs');
const path = require('path');

// Paths
const POSTS_DIR = path.join(__dirname, '..', 'medium-data', 'posts');
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'content', 'articles');

// Words that indicate this is a comment, not an article
const COMMENT_STARTERS = [
    'exactly', 'but i', 'i think', 'i feel', 'i agree', 'agreed', 'yes', 'no',
    'thanks', 'thank you', 'great', 'nice', 'cool', 'awesome', 'perfect',
    'beautiful', 'love it', 'wow', 'lol', 'haha', 'hey', 'hi ', 'hello',
    'from the very first', 'this is', 'that is', 'and that', 'i was',
    'so true', 'true', 'right', 'correct', 'interesting', 'good point',
    'hope you', 'you can', 'you should', 'just', 'only', 'really',
    'absolutely', 'definitely', 'totally', '💛', '🖤', '❤', '👍', '🙏'
];

// Minimum word count for an article (comments are usually short)
const MIN_ARTICLE_WORDS = 300;

// Category mapping based on keywords
function getCategory(title, content) {
    const text = (title + ' ' + content).toLowerCase();
    if (text.includes('blazor') || text.includes('.net') || text.includes('dotnet') || text.includes('c#') || text.includes('asp.net') || text.includes('entity framework') || text.includes('linq') || text.includes('csharp')) {
        return '.NET';
    }
    if (text.includes('ai') || text.includes('artificial intelligence') || text.includes('machine learning') || text.includes('llm') || text.includes('chatgpt') || text.includes('openai') || text.includes('deepseek') || text.includes('cursor') || text.includes('claude') || text.includes('gpt') || text.includes('agentic')) {
        return 'AI';
    }
    if (text.includes('performance') || text.includes('optimization') || text.includes('faster') || text.includes('memory') || text.includes('benchmark') || text.includes('speed')) {
        return 'Performance';
    }
    if (text.includes('architecture') || text.includes('microservice') || text.includes('design pattern') || text.includes('cqrs') || text.includes('clean code') || text.includes('structure')) {
        return 'Architecture';
    }
    return 'Software Industry';
}

// Check if this looks like a comment rather than an article
function isComment(title, content) {
    const lowerTitle = title.toLowerCase().trim();
    const lowerContent = content.toLowerCase().trim();
    const wordCount = content.split(/\s+/).length;

    // Too short = comment
    if (wordCount < MIN_ARTICLE_WORDS) {
        return true;
    }

    // Title starts with comment-like phrase
    for (const starter of COMMENT_STARTERS) {
        if (lowerTitle.startsWith(starter)) {
            return true;
        }
    }

    // Content starts with comment-like phrase (first sentence)
    for (const starter of COMMENT_STARTERS) {
        if (lowerContent.startsWith(starter)) {
            return true;
        }
    }

    // Title looks like a sentence fragment (contains "...")
    if (title.includes('...') && title.length < 100) {
        return true;
    }

    // Title is all lowercase (proper titles have capitalization)
    if (title === title.toLowerCase() && !title.includes(':')) {
        return true;
    }

    // Very short title that looks conversational
    if (title.length < 30 && !title.includes(':') && !title.includes('|')) {
        return true;
    }

    return false;
}

// Calculate read time
function getReadTime(content) {
    const words = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
}

// Extract featured image from HTML
function extractFeaturedImage(html) {
    // Try featured image first
    const featuredMatch = html.match(/data-is-featured="true"[^>]*src="([^"]+)"/i);
    if (featuredMatch) return featuredMatch[1];

    // Otherwise first image from content
    const imgMatch = html.match(/src="(https:\/\/cdn-images-1\.medium\.com\/[^"]+)"/i);
    if (imgMatch) return imgMatch[1];

    return null;
}

// Convert HTML to Markdown - remove duplicate title
function htmlToMarkdown(html, titleToRemove) {
    let md = html
        // Handle code blocks first
        .replace(/<pre[^>]*data-code-block-lang="([^"]*)"[^>]*>(.*?)<\/pre>/gis, (match, lang, code) => {
            const cleanCode = code
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<[^>]+>/g, '')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;/g, '&')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&#x27;/g, "'");
            return `\n\`\`\`${lang}\n${cleanCode}\n\`\`\`\n`;
        })
        .replace(/<pre[^>]*>(.*?)<\/pre>/gis, (match, code) => {
            const cleanCode = code
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<[^>]+>/g, '')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;/g, '&');
            return `\n\`\`\`\n${cleanCode}\n\`\`\`\n`;
        })
        // Headings
        .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n## $1\n')
        .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n## $1\n')
        .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '\n### $1\n')
        // Paragraphs
        .replace(/<p[^>]*>(.*?)<\/p>/gis, '\n$1\n')
        // Lists
        .replace(/<li[^>]*>(.*?)<\/li>/gis, '- $1\n')
        .replace(/<ol[^>]*>/gi, '\n')
        .replace(/<\/ol>/gi, '\n')
        .replace(/<ul[^>]*>/gi, '\n')
        .replace(/<\/ul>/gi, '\n')
        // Inline formatting
        .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
        .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
        .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
        .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
        .replace(/<br\s*\/?>/gi, '\n')
        // Images
        .replace(/<img[^>]*src="(https:\/\/cdn-images-1\.medium\.com\/[^"]+)"[^>]*>/gi, '\n![]($1)\n')
        // Blockquotes
        .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, '\n> $1\n')
        // Remove elements
        .replace(/<figure[^>]*>.*?<\/figure>/gis, '')
        .replace(/<figcaption[^>]*>.*?<\/figcaption>/gis, '')
        .replace(/<div[^>]*>/gi, '')
        .replace(/<\/div>/gi, '')
        .replace(/<section[^>]*>/gi, '')
        .replace(/<\/section>/gi, '')
        .replace(/<span[^>]*>/gi, '')
        .replace(/<\/span>/gi, '')
        .replace(/<hr[^>]*>/gi, '\n---\n')
        .replace(/<[^>]+>/g, '')
        // HTML entities
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/&nbsp;/g, ' ')
        // Cleanup
        .replace(/\n{3,}/g, '\n\n')
        .trim();

    // Remove duplicate title from beginning of content
    if (titleToRemove) {
        // Normalize the title for matching - remove special chars and create word set
        const normalizedTitle = titleToRemove.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
        const titleWords = normalizedTitle.split(/\s+/).filter(w => w.length > 2);

        const lines = md.split('\n');
        const newLines = [];
        let foundDuplicateTitle = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Only check first 10 lines for title duplication
            if (i < 10 && line.startsWith('##')) {
                const cleanLine = line.replace(/^#{1,4}\s*/, '').toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
                const lineWords = cleanLine.split(/\s+/).filter(w => w.length > 2);

                // Check if line contains most of the title words
                const matchingWords = titleWords.filter(w => lineWords.includes(w));
                const matchRatio = matchingWords.length / titleWords.length;

                if (matchRatio > 0.7) {
                    foundDuplicateTitle = true;
                    continue; // Skip this line
                }
            }

            // Skip empty lines right after title removal
            if (foundDuplicateTitle && line.trim() === '') {
                foundDuplicateTitle = false;
                continue;
            }

            newLines.push(line);
        }

        md = newLines.join('\n');
    }

    // Remove any leading horizontal rules or empty lines
    md = md.replace(/^[\s\n]*---[\s\n]*/, '').replace(/^\n+/, '');

    return md;
}

// Create slug from title
function createSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 60);
}

// Main conversion
function convertPosts() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Clear existing articles
    const existingFiles = fs.readdirSync(OUTPUT_DIR);
    existingFiles.forEach(file => {
        fs.unlinkSync(path.join(OUTPUT_DIR, file));
    });

    const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.html') && !f.startsWith('draft_'));
    console.log(`Found ${files.length} posts to convert...`);

    let converted = 0;
    let skipped = 0;
    let skippedAsComments = 0;

    for (const file of files) {
        try {
            const filePath = path.join(POSTS_DIR, file);
            const html = fs.readFileSync(filePath, 'utf8');

            // Extract title
            let title = '';
            const h1Match = html.match(/<h1[^>]*class="p-name"[^>]*>(.*?)<\/h1>/is);
            if (h1Match) {
                title = h1Match[1].replace(/<[^>]+>/g, '').trim();
            } else {
                const h3Match = html.match(/<h3[^>]*class="[^"]*graf--title[^"]*"[^>]*>(.*?)<\/h3>/is);
                if (h3Match) {
                    title = h3Match[1].replace(/<[^>]+>/g, '').trim();
                }
            }

            if (!title || title.length < 10) {
                skipped++;
                continue;
            }

            // Extract date
            const dateMatch = file.match(/^(\d{4}-\d{2}-\d{2})/);
            const publishedDate = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];

            // Extract subtitle/excerpt
            const subtitleMatch = html.match(/<section[^>]*data-field="subtitle"[^>]*>(.*?)<\/section>/is);
            let excerpt = '';
            if (subtitleMatch) {
                excerpt = subtitleMatch[1].replace(/<[^>]+>/g, '').trim().substring(0, 200);
            }
            if (!excerpt || excerpt.length < 10) {
                excerpt = title.substring(0, 150);
            }

            // Extract featured image
            const image = extractFeaturedImage(html);

            // Extract ALL body sections
            const allSections = [];
            const sectionMatches = html.matchAll(/<section[^>]*class="section section--body[^"]*"[^>]*>(.*?)<\/section>/gis);
            for (const match of sectionMatches) {
                allSections.push(match[1]);
            }

            if (allSections.length === 0) {
                const bodyMatch = html.match(/<section[^>]*data-field="body"[^>]*>(.*?)<\/section>/is);
                if (bodyMatch) {
                    allSections.push(bodyMatch[1]);
                }
            }

            if (allSections.length === 0) {
                skipped++;
                continue;
            }

            const bodyHtml = allSections.join('\n');
            const content = htmlToMarkdown(bodyHtml, title);

            // Check if this is a comment
            if (isComment(title, content)) {
                skippedAsComments++;
                continue;
            }

            // Generate metadata
            const category = getCategory(title, content);
            const readTime = getReadTime(content);
            const slug = createSlug(title);

            // Create markdown with frontmatter
            let markdown = `---
title: "${title.replace(/"/g, '\\"')}"
excerpt: "${excerpt.replace(/"/g, '\\"').replace(/\n/g, ' ')}"
publishedDate: "${publishedDate}"
category: "${category}"
readTime: "${readTime}"`;

            if (image) {
                markdown += `\nimage: "${image}"`;
            }

            markdown += `
---

${content}
`;

            // Write file
            const outputPath = path.join(OUTPUT_DIR, `${slug}.md`);
            fs.writeFileSync(outputPath, markdown);
            converted++;

        } catch (e) {
            console.error(`Error processing ${file}:`, e.message);
            skipped++;
        }
    }

    console.log(`\n✅ Converted: ${converted} articles`);
    console.log(`⏭️ Skipped: ${skipped} (drafts, no title, no content)`);
    console.log(`💬 Filtered as comments: ${skippedAsComments}`);
    console.log(`📁 Output: ${OUTPUT_DIR}`);
}

convertPosts();
