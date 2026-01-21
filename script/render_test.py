import re
from pathlib import Path

from template import EntryData, Template

test_data: EntryData = {
    "title": "make",
    "phonetic": "meik",
    "cls_star_rate": 3,
    "frq": 45,
    "bnc": 43,
    "exchanges": [
        {"f": "d", "v": "made"},
        {"f": "p", "v": "made"},
        {"f": "i", "v": "making"},
        {"f": "3", "v": "makes"},
    ],
    "tags": [
        {"abbr": "ps", "v": "小学"},
        {"abbr": "ms", "v": "中学"},
        {"abbr": "hs", "v": "高中"},
        {"abbr": "t4", "v": "四级"},
        {"abbr": "t6", "v": "六级"},
        {"abbr": "t8", "v": "专八"},
        {"abbr": "pe", "v": "考研"},
        {"abbr": "gre", "v": "GRE"},
        {"abbr": "tf", "v": "托福"},
    ],
    "percent": {
        "pos": [
            {"pos": "V", "percent": 99},
            {"pos": "N", "percent": 1},
        ],
        "sense": [
            {"v": "做", "percent": 49},
            {"v": "制造", "percent": 37},
            {"v": "使得", "percent": 5},
            {"v": "成功", "percent": 3},
            {"v": "性格", "percent": 2},
            {"v": "达成", "percent": 2},
            {"v": "生产量", "percent": 1},
            {"v": "式样", "percent": 1},
        ],
    },
    "explain": [
        {
            "pos": "vt.",
            "v": "制造, 安排, 创造, 构成, 使得, 产生, 造成, 整理, 布置, 引起, 到达, 进行",
        },
        {"pos": "vi.", "v": "开始, 前进, 增大, 被制造, 被处理"},
        {"pos": "n.", "v": "制造, 构造, 性情"},
    ],
    "json_data": {
        "pos": {"V": {"rk": 45, "frq": 932443}, "N": {"rk": 9090, "frq": 1993}},
        "lgk_id": {"w": 112593, "p": [48605, 27059, 61054, 27692, 17897, 17839, 31839]},
    },
}

templ = Template(Path("templates/entry.j2"))
test_html = templ.render(test_data)
test_html = re.sub(r"\s*\n\s*", "\n", test_html)

if __name__ == "__main__":
    with open("index.html", "r", encoding="utf-8") as f:
        html = f.read()
    html = re.sub(
        r"\s*<!-- render test : start -->.*?<!-- render test : end -->\s*",
        f"""
    <!-- render test : start -->
    {test_html.replace("\n", "\n    ")}
    <!-- render test : end -->
    """,
        html,
        flags=re.DOTALL,
    )
    with open("index.html", "w", encoding="utf-8") as f:
        f.write(html)
