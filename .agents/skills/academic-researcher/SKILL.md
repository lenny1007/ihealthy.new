---
name: academic-researcher
description: |
  Runs evidence-based research before editing health or scientific content. Use when 潤稿 (editing)
  blog posts or articles in src/content/blog: first search for guidelines, meta-analyses, and
  key studies on the article topic, then use findings to inform edits (accuracy, citations,
  up-to-date stats). Use when user asks for research-backed editing or "先做 research 再潤稿".
allowed-tools: Read, Write, WebSearch, mcp_web_fetch, Grep, Glob
user-invocable: true
---

# Academic Researcher: Research Before 潤稿

When 潤稿 (editing) health or scientific content, **run research first**, then apply findings to the edit. This keeps claims accurate, citations current, and numbers aligned with guidelines and recent evidence.

## When to Apply

- Before or at the start of **潤稿** on any `src/content/blog/**/*.mdx` article.
- When the user asks for "先做 research 再潤稿" or "research-backed 潤稿".
- When editing articles that cite clinical guidelines, statistics, or study results.

## Workflow: Research → 潤稿

### Phase 1: Extract Topics and Claims

1. Read the full article (title, description, body).
2. List **key claims** that need evidence (e.g. "異維A酸 85–90% 顯著改善", "便秘 羅馬準則", "膠原蛋白 2.5–10g 8–12 週").
3. Note **existing citations** (footnotes, references) and any **numbers or dates** that may be outdated.

### Phase 2: Research

Use **WebSearch** (and optional **mcp_web_fetch** for specific guideline pages) to find:

- **Guidelines**: WHO, AAD, Cochrane, 台灣衛福部/醫學會、UpToDate 等對該主題的建議。
- **Meta-analyses / systematic reviews**: 近 5 年內的綜論或實證摘要。
- **Key studies**: 若內文提到某結論，搜尋是否有更新或相反證據。

**Search tips**:
- Use English + 中文關鍵字（e.g. "isotretinoin efficacy meta-analysis", "便秘 羅馬準則 2024"）。
- Prefer: guideline, meta-analysis, systematic review, Cochrane, 實證、指引、共識。
- For each major claim, aim for at least one high-quality source (guideline or review over single news article).

### Phase 3: Summarize Findings

Produce a short **research summary** (for the editor or the user):

- What do current guidelines / reviews say?
- Any important updates or conflicts with the article?
- Any numbers or dates that should be updated or corrected?
- Gaps: claims that have no strong evidence or that you could not verify.

Keep the summary under ~200 words per article so it can feed into 潤稿 without clutter.

### Phase 4: Apply to 潤稿

Use the research summary to **inform edits** (do not replace 寫作規範 or Humanizer):

- **Correct inaccuracies**: If the article contradicts guidelines or recent reviews, fix the claim or add a caveat.
- **Update numbers/dates**: e.g. "2024 年" → "近年" if appropriate; update statistics if a newer meta-analysis gives different numbers.
- **Citations**: Add, fix, or remove references based on research (e.g. replace vague "研究顯示" with "Cochrane 2023 指出" and a footnote).
- **Do not**: Change style, tone, or structure that belongs to 寫作規範 or Humanizer; only evidence-related content.

If research finds no issue, say so briefly and proceed with normal 潤稿 (導讀、結論、相關文章、Humanizer 等).

## Output Format

When running research before 潤稿, output:

```markdown
## Research Summary

- **Topic**: [article title or main topic]
- **Sources checked**: [guidelines / reviews / key studies found]
- **Findings**: [1–3 bullet points: alignment, updates, or corrections needed]
- **Edits to apply**: [list of evidence-based edits, or "No factual changes needed"]
```

Then run 潤稿 (寫作規範 + Humanizer) using the "Edits to apply" and the research summary.

## Integration with 潤稿

- **Order**: 1) Academic-researcher (research + summary + evidence-based edit list) → 2) 潤稿 (寫作規範 + Humanizer).
- **Scope**: Academic-researcher only handles **evidence and accuracy**; 寫作規範 handles structure/consistency, Humanizer handles tone and AI-pattern removal.
- **Docs**: 潤稿進度 or 寫作規範 can reference this skill as "潤稿前先做 research（academic-researcher）".
