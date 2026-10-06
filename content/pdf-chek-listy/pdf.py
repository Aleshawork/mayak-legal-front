from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(); pg.goto('file:///tmp/claude-0/cl/cl.html'); pg.wait_for_timeout(500)
    pg.pdf(path='/mnt/user-data/outputs/chek-listy-pered-pokupkoj.pdf',format='A4',print_background=True,prefer_css_page_size=True); b.close()
