-- 关联.j2后缀为jinja文件类型
vim.api.nvim_create_autocmd(
	{ "BufNewFile", "BufRead" }, -- 触发事件：新建/读取文件
	{
		pattern = {"*.j2", "*.jinja"}, -- 匹配.j2后缀
    callback = function (ev)
      vim.bo.ft = "htmldjango"
    end
	}
)
