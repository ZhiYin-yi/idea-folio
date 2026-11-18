#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
把用户图片按「槽位」裁进工程，并写下首屏亮度。

用法：
  python scripts/images.py --project .                       # 无图：用 skill 自带默认图
  python scripts/images.py --project . --in a.jpg            # 单图：自动裁 6 个槽位
  python scripts/images.py --project . --in a.jpg b.jpg c.jpg  # 多图：按顺序分配

规则：
  · 只裁切、不拉伸（先等比放大到刚好覆盖目标框，再居中裁）
  · 槽位比例固定：welcome/hero 3:2，detail 4:5，work-* 4:3
  · 输出写到 <project>/public/img/<slot>.jpg，质量 82 progressive
  · 首屏平均亮度 < 0.55 写出 tone=dark，页面自动切白字
"""

import argparse
import json
import os
import shutil
import sys

from PIL import Image, ImageStat

SLOTS = {
    "welcome": (3, 2, 1800),
    "hero": (3, 2, 1800),
    "detail": (4, 5, 900),
    "work-1": (4, 3, 1200),
    "work-2": (4, 3, 1200),
    "work-3": (4, 3, 1200),
}

# 单图模式下每个槽位取图的相对位置：内部裁切稳定，看起来不会像同一张图重复
SINGLE_OFFSETS = {
    "welcome": (0.50, 0.42),
    "hero": (0.50, 0.30),
    "detail": (0.55, 0.40),
    "work-1": (0.25, 0.45),
    "work-2": (0.50, 0.60),
    "work-3": (0.75, 0.35),
}


def target_size(ratio_w, ratio_h, long_edge):
    if ratio_w >= ratio_h:
        return long_edge, round(long_edge * ratio_h / ratio_w)
    return round(long_edge * ratio_w / ratio_h), long_edge


def cover_crop(img, size, fx=0.5, fy=0.42):
    """等比放大到覆盖 size，再按 fx/fy 位置裁切。不拉伸。"""
    tw, th = size
    w, h = img.size
    scale = max(tw / w, th / h)
    nw, nh = max(tw, round(w * scale)), max(th, round(h * scale))
    img = img.resize((nw, nh), Image.LANCZOS)
    left = round((nw - tw) * fx)
    top = round((nh - th) * fy)
    return img.crop((left, top, left + tw, top + th))


def average_luma(img):
    small = img.convert("RGB").resize((200, max(1, round(200 * img.size[1] / img.size[0]))))
    m = ImageStat.Stat(small).mean
    return (0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) / 255


def save(img, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, quality=82, optimize=True, progressive=True)
    return os.path.getsize(path) / 1024


def from_single(src, out_dir):
    base = Image.open(src).convert("RGB")
    made = []
    for slot, (rw, rh, edge) in SLOTS.items():
        fx, fy = SINGLE_OFFSETS[slot]
        crop = cover_crop(base, target_size(rw, rh, edge), fx, fy)
        made.append((slot, save(crop, os.path.join(out_dir, f"{slot}.jpg")), crop))
    return base, made


def from_many(files, out_dir):
    base = Image.open(files[0]).convert("RGB")
    made = []
    order = list(SLOTS.keys())
    for index, slot in enumerate(order):
        rw, rh, edge = SLOTS[slot]
        size = target_size(rw, rh, edge)
        if slot in ("welcome", "hero"):
            src_img = base
            fy = 0.42 if slot == "welcome" else 0.30
            crop = cover_crop(src_img, size, 0.5, fy)
        else:
            pick = min(index, len(files) - 1)
            crop = cover_crop(Image.open(files[pick]).convert("RGB"), size, 0.5, 0.42)
        made.append((slot, save(crop, os.path.join(out_dir, f"{slot}.jpg")), crop))
    return base, made


def from_defaults(defaults_dir, out_dir):
    if not os.path.isdir(defaults_dir):
        sys.exit(f"找不到默认图目录：{defaults_dir}")
    made = []
    hero_img = None
    for slot in SLOTS:
        src = os.path.join(defaults_dir, f"{slot}.jpg")
        if not os.path.isfile(src):
            sys.exit(f"默认图缺失：{src}")
        dst = os.path.join(out_dir, f"{slot}.jpg")
        os.makedirs(out_dir, exist_ok=True)
        shutil.copyfile(src, dst)
        img = Image.open(dst).convert("RGB")
        if slot == "hero":
            hero_img = img
        made.append((slot, os.path.getsize(dst) / 1024, img))
    return hero_img or Image.open(os.path.join(out_dir, "hero.jpg")).convert("RGB"), made


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", default=".", help="工程根目录")
    ap.add_argument("--in", dest="inputs", nargs="*", default=[], help="用户图片（0~5 张）")
    ap.add_argument("--defaults", default=None, help="skill 自带默认图目录")
    args = ap.parse_args()

    project = os.path.abspath(args.project)
    out_dir = os.path.join(project, "public", "img")
    defaults = args.defaults or os.path.join(os.path.dirname(__file__), "..", "assets", "defaults")

    files = [os.path.abspath(p) for p in args.inputs if os.path.isfile(p)]
    missing = [p for p in args.inputs if not os.path.isfile(p)]
    if missing:
        print(f"  跳过不存在的文件：{missing}")

    if not files:
        mode = "defaults"
        hero_img, made = from_defaults(os.path.abspath(defaults), out_dir)
    elif len(files) == 1:
        mode = "single"
        hero_img, made = from_single(files[0], out_dir)
    else:
        mode = "multi"
        hero_img, made = from_many(files, out_dir)

    luma = average_luma(hero_img)
    tone = "light" if luma >= 0.55 else "dark"
    meta = {"tone": tone, "luminance": round(luma, 3), "mode": mode,
            "sources": [os.path.basename(f) for f in files] or ["defaults"]}
    with open(os.path.join(project, "src", "image-tone.json"), "w", encoding="utf-8") as fh:
        json.dump(meta, fh, indent=2, ensure_ascii=False)

    print(f"  模式：{mode}   首屏亮度 {luma:.3f} → tone={tone}")
    total = 0
    for slot, kb, _ in made:
        total += kb
        print(f"    {slot:8} {kb:7.0f} KB")
    print(f"  合计 {total / 1024:.2f} MB → {out_dir}")


if __name__ == "__main__":
    main()
