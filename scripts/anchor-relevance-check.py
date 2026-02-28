#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
錨點與相關性抽檢：產出「來源文／錨點／目標文標題」對照表。
用法：python scripts/anchor-relevance-check.py
輸出：docs/錨點與相關性抽檢清單.md（可依此人工檢查錨點是否與目標主題一致、是否真的相關）
"""
import os
import re
from pathlib import Path

BLOG_DIR = Path(__file__).resolve().parent.parent / "src" / "content" / "blog"
OUT_PATH = Path(__file__).resolve().parent.parent / "docs" / "錨點與相關性抽檢清單.md"


def get_frontmatter_title(filepath: Path) -> str:
    """讀取 MDX 第一段 frontmatter 的 title。"""
    text = filepath.read_text(encoding="utf-8")
    if not text.startswith("---"):
        return ""
    end = text.index("---", 3) if "---" in text[3:] else 0
    if not end:
        return ""
    fm = text[3:end]
    m = re.search(r'^title:\s*["\']?(.+?)["\']?\s*$', fm, re.MULTILINE)
    return m.group(1).strip() if m else ""


def get_slug_to_title() -> dict[str, str]:
    """建立 slug -> title 對照。"""
    slug_to_title = {}
    for f in BLOG_DIR.glob("*.mdx"):
        if f.name == "index.mdx":
            continue
        slug = f.stem
        slug_to_title[slug] = get_frontmatter_title(f)
    return slug_to_title


def extract_related_links(filepath: Path) -> list[tuple[str, str]]:
    """從 MDX 中抽出「相關文章」區塊內的 (錨點文字, slug) 列表。"""
    text = filepath.read_text(encoding="utf-8")
    section = re.search(
        r"##\s*相關文章\s*\n(.*?)(?=\n---|\n##\s|\Z)",
        text,
        re.DOTALL,
    )
    if not section:
        return []
    block = section.group(1)
    pairs = re.findall(r"-\s*\[([^\]]+)\]\(/([^/)]+)/\)", block)
    return [(anchor.strip(), slug) for anchor, slug in pairs]


def main():
    slug_to_title = get_slug_to_title()
    rows = []
    for f in sorted(BLOG_DIR.glob("*.mdx")):
        if f.name == "index.mdx":
            continue
        source_slug = f.stem
        source_title = slug_to_title.get(source_slug, "")
        for anchor, target_slug in extract_related_links(f):
            target_title = slug_to_title.get(target_slug, "(無對應文章)")
            rows.append(
                {
                    "source_slug": source_slug,
                    "source_title": source_title,
                    "anchor": anchor,
                    "target_slug": target_slug,
                    "target_title": target_title,
                }
            )

    # 寫出 Markdown 表
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    lines = [
        "# 錨點與相關性抽檢清單",
        "",
        "由 `scripts/anchor-relevance-check.py` 自動產生。抽檢時請確認：",
        "1. **錨點與目標一致**：錨點文字是否與目標文章標題／主題相符。",
        "2. **相關性**：該則是否與「來源文章」主題確實相關。",
        "",
        "| # | 來源文章 (slug) | 來源標題 | 錨點文字 | 目標 (slug) | 目標標題 | 備註（抽檢填） |",
        "|---|----------------|----------|----------|-------------|----------|----------------|",
    ]
    for i, r in enumerate(rows, 1):
        src_title_esc = (r["source_title"] or "").replace("|", "\\|")
        anchor_esc = (r["anchor"] or "").replace("|", "\\|")
        tgt_title_esc = (r["target_title"] or "").replace("|", "\\|")
        lines.append(
            f"| {i} | {r['source_slug']} | {src_title_esc} | {anchor_esc} | {r['target_slug']} | {tgt_title_esc} | |"
        )
    lines.extend(["", f"共 **{len(rows)}** 則相關文章連結。", ""])
    OUT_PATH.write_text("\n".join(lines), encoding="utf-8")
    print(f"已寫入 {OUT_PATH}，共 {len(rows)} 則。")


if __name__ == "__main__":
    main()
