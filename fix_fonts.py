with open('index.html', 'r') as f:
    text = f.read()

text = text.replace('family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,400;1,700', 'family=Nunito:wght@400;500;600;700;800;900')

with open('index.html', 'w') as f:
    f.write(text)

with open('src/index.css', 'r') as f:
    css = f.read()

css = css.replace('font-family: \'Roboto\', -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif;', 'font-family: \'Nunito\', -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif;')

with open('src/index.css', 'w') as f:
    f.write(css)

