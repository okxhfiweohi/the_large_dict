import re
import sys

from bs4 import BeautifulSoup
from render_test import test_html,test_data

eruda = """
<script async>
  (function () {
    if (!window.eruda) {
      var script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/eruda/3.4.3/eruda.min.js";
      document.body.append(script);
      script.onload = function () {
        eruda.init();
      };
    }
  })();
</script>
"""

def get_test_entry():
    content = f"""
    {eruda}
    <link rel="stylesheet" href="the_large_dict_test.css">
    {test_html}
    <script type="module" src="the_large_dict_test.js"></script>
    """
    word = test_data["title"]
    print(f"entry: {word}")
    return {
        "test": f"test content {eruda}",
        "te-st": f"other-test-content {eruda}",
        word: re.sub(r"\s+", " ", content),
    }


with open(sys.argv[2], "w") as f:
    for k, v in get_test_entry().items():
        f.write(f"{k}\n{v.strip()}\n</>\n")
