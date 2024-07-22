import sys

import click
from setuppy_blog.__about__ import __version__, ascii_header
from setuppy_blog.func.say import (
    feeds,
    list_say_chars,
    random_quotes,
    reach,
    say,
)

CONTEXT_SETTINGS = dict(help_option_names=["-h", "--help"])


class CatchAllExceptions(click.Group):
    """A click group that catches all exceptions and displays them as a message.
    This class extends the functionality of the `click.Group` class by adding
    a try-except block around the call to `main()`. Any exceptions that are
    raised during the call to `main()` are caught and displayed as a message
    to the user.
    """

    def __call__(self, *args, **kwargs):
        try:
            return self.main(*args, **kwargs)
        except Exception as e:
            click.echo(f"Oops! An unknown error has occurred: {e}")
            sys.exit(1)


@click.group(context_settings=CONTEXT_SETTINGS, cls=CatchAllExceptions)
@click.pass_context
def cli(ctx: click.core.Context):
    ctx.ensure_object(dict)
    pass


@cli.command("version")
@click.pass_context
def version_cmd(ctx: click.core.Context):
    """Get current setuppy-blog version."""
    click.echo(ascii_header)
    click.echo(__version__)
    pass


@cli.command("feeds")
def feeds_cmd():
    """Get feeds from Medium"""
    feeds()


@cli.command("quotes")
def quotes_cmd():
    """Get random quotes"""
    random_quotes()


@cli.command("say")
@click.option(
    "--char_name",
    type=str,
    default="cow",
    help="Character to say. For list try `list-say-char`",
)
@click.argument(
    "text",
    type=str,
    required=True,
)
def say_cmd(char_name, text):
    """Echo `text` with `char_name`. To list char name try `list-say-chars`"""
    say(text, char_name)


@cli.command("list-say-chars")
def list_say_chars_cmd():
    """List all char name"""
    list_say_chars()


@cli.command("reach")
def reach_cmd():
    """Echo social media link from JSON file"""
    reach()


if __name__ == "__main__":
    cli()
