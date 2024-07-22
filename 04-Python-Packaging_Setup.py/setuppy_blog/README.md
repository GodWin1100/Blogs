# Setup.py Python Packaging

Follow my blog on Medium about [Python Packaging: Setup.py](https://medium.com/@godwin1100/python-packaging-setup-py-ae04b3d41653) to understand what is setup.py and how you can set it up and publish your own python package. It is the follow along blog to setup, build and publish this very own package.

## Installation

### Base Version

`pip install -i https://test.pypi.org/simple/ setuppy-blog==1.0.0`

> Will be installing from Test-PyPi and not PyPi org

### Extra requirement

- For installing package with extra version for `feeds`, `quotes`, and `all`

- feeds
  - `pip install -i https://test.pypi.org/simple/ --extra-index-url https://pypi.org/simple/ "setuppy-blog[feeds]==1.0.0"`
- quotes
  - `pip install -i https://test.pypi.org/simple/ --extra-index-url https://pypi.org/simple/ "setuppy-blog[quotes]==1.0.0"`
- feeds & quotes
  - `pip install -i https://test.pypi.org/simple/ --extra-index-url https://pypi.org/simple/ "setuppy-blog[all]==1.0.0"`
- dev
  - `pip install -i https://test.pypi.org/simple/ --extra-index-url https://pypi.org/simple/ "setuppy-blog[build]==1.0.0"`

> Need to add extra index url of actual PyPi org as this dependency version are not available on Test-PyPi

## CLI Reference

### `blog-math`, `blog-math -h/--help`

Print help for `blog-math`

### `blog-math OPERATION num1 num2`

Performs Math operation on `num1` and `num2` based on `OPERATION`

- OPERATION: `add`, `subtract`, `multiple`, `divide`
- num1: Any float Number
- num2: Any float Number

---

### `blog-say`, `blog-say -h/--help`

Print help for `blog-say`

### `blog-say feeds`

Get feeds of the Author from Medium

- `-h, --help`: print help

> requires `feedparser`, can be install with `setuppy_blog[feeds]`

### `blog-say quotes`

Get random quotes

- `-h, --help`: print help

> requires `requires`, can be install with `setuppy_blog[quotes]`

### `blog-say say TEXT`

Echo `TEXT` with `char_name`. To list char name try [`list-say-chars`](#blog-say-list-say-chars)

- `--char_name`: Character to say. For list try [`list-say-chars`](#blog-say-list-say-chars)
- `-h, --help`: print help

### `blog-say list-say-chars`

List all valid char name for [`say`](#blog-say-say-text)

- `-h, --help`: print help

### `blog-say reach`

Echo Author's social media links from JSON file. Eg. of Namespace packages with data files

- `-h, --help`: print help

### `blog-say version`

Get current setuppy-blog version

- `-h, --help`: print help

## API Reference

### setuppy_blog.func.basic_math

#### `add(num1: float, num2: float)`:

Add two numbers `num1` and `num2`

    Args:
        num1 (float): First Number
        num2 (float): Second Number

#### `subtract(num1: float, num2: float)`:

Subtract two numbers `num1` and `num2`

    Args:
        num1 (float): First Number
        num2 (float): Second Number

#### `multiply(num1: float, num2: float)`:

Multiply two numbers `num1` and `num2`

    Args:
        num1 (float): First Number
        num2 (float): Second Number

#### `divide(num1: float, num2: float)`:

Divide two numbers `num1` and `num2`

    Args:
        num1 (float): First Number
        num2 (float): Second Number

---

### setuppy_blog.func.say

#### `random_quotes()`:

Echo random quotes fetched through AJAX call

#### `feeds()`:

Echo latest Blog feed of GodWin1100

#### `reach()`:

Echo social media link of GodWin1100, data is fetched from JSON template

#### `say(text: str, char_name: str = "cow")`:

Echo `text` with cowsay package

    Args:
        text (str): Text to echo
        char_name (str, optional): Character to use for echoing. For list check `list_say_chars`. Defaults to "cow".

#### `list_say_chars()`:

List all character of cowsay, can be passed to [`say`](#saytext-str-char_name-str--cow)

## Testing

- To run the test

> python -m unittest
>
> python -m unittest ./path/to/test/file.py
