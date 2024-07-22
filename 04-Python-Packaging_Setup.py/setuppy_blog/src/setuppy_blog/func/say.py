import json
import random

import click
import cowsay
import cowsay.characters
from setuppy_blog.utils import dir_path, rule


def random_quotes():
    """Echo random quotes fetched through AJAX call"""
    import requests

    res = requests.get("https://api.quotable.io/random")
    res_dict = res.json()
    click.echo(
        cowsay.char_funcs[random.choice(cowsay.char_names)](
            f"{res_dict['content']}\n\n- {res_dict['author']}"
        )
    )


def feeds():
    """Echo latest Blog feed of GodWin1100"""
    import feedparser

    res = feedparser.parse("https://godwin1100.medium.com/feed")
    for blog in res.entries:
        rule(120)
        click.echo(
            f"Title: {blog['title']}\nCategory: {', '.join([tag['term'] for tag in blog['tags']])}\nLink: {blog['link']}\nAuthor: {blog['author']}"
        )


def reach():
    """Echo social media link of GodWin1100, data is fetched from JSON template"""
    reach_data = json.load(open(f"{dir_path()}/templates/follow.json"))
    for platform, link in reach_data["links"].items():
        click.echo(f"Reach me on {platform} at {link}")
    rule()
    click.echo(reach_data["note"])


def say(text: str, char_name: str = "cow"):
    """Echo `text` with cowsay package

    Args:
        text (str): Text to echo
        char_name (str, optional): Character to use for echoing. For list check `list_say_chars`. Defaults to "cow".
    """
    click.echo(cowsay.char_funcs[char_name](text))


def list_say_chars():
    """List all character of cowsay, can be passed to `say`"""
    click.echo(cowsay.char_names)
