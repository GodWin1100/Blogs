import os


def rule(width: int = 50):
    """Print horizontal ruler

    Args:
        width (int, optional): Width of the horizontal ruler. Defaults to 50.
    """
    print("".center(width, "-"))


def dir_path() -> str:
    """Return absolute root directory path

    Returns:
        str: Absolute root directory path
    """
    return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
