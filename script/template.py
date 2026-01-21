import json
from pathlib import Path
from typing import NotRequired, TypedDict

from jinja2 import BaseLoader, Environment


class ExchangeData(TypedDict):
    f: str
    v: str


class TagData(TypedDict):
    abbr: str
    v: str


class PosData(TypedDict):
    pos: str
    percent: int


class SenseData(TypedDict):
    v: str
    percent: int


class PercentData(TypedDict):
    pos: NotRequired[list[PosData]]
    sense: NotRequired[list[SenseData]]


class ExplainItemData(TypedDict):
    pos: str
    v: str


class EntryData(TypedDict):
    title: str
    phonetic: NotRequired[str]
    cls_star_rate: NotRequired[int]
    frq: NotRequired[int]
    bnc: NotRequired[int]
    exchanges: NotRequired[list[ExchangeData]]
    tags: NotRequired[list[TagData]]
    percent: NotRequired[PercentData]
    explain: NotRequired[list[ExplainItemData]]
    json_data: NotRequired[dict | str]


env = Environment(loader=BaseLoader())
template = env.from_string("")


class Template:
    def __init__(self, path: Path):
        with open(path, "r", encoding="utf-8") as f:
            s = f.read().strip()
            self.template = env.from_string(s)

    def render(self, data: EntryData) -> str:
        if "json_data" in data:
            data["json_data"] = json.dumps(data.get("json_data", {}))
        return self.template.render(data)
