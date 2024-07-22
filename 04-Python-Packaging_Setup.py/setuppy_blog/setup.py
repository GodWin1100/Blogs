import os
from codecs import open

from setuptools import find_namespace_packages, find_packages, setup

repo_path = os.path.abspath(os.path.dirname(__file__))

packages = [*find_packages(where="src"), "setuppy_blog.templates"]
# or can use find_namespace_package directly

# If packaging is not required, and only purpose is for internal development can follow this for install_requires
# with open(os.path.join(repo_path, "requirements.txt"), "r", "utf-8") as f:
#     requires = [
#         i.replace("\n", "").replace("\r", "")
#         for i in f.readlines()
#         if "-e ." not in i
#     ]

main_requires = [
    "click==8.1.7",
    "cowsay==6.1",
]

feed_requires = ["feedparser==6.0.11"]

quote_requires = ["requests==2.31.0"]

dev_requires = [
    *feed_requires,
    *quote_requires,
    "build==1.2.1",
    "twine==5.0.0",
]

about = {}
with open(
    os.path.join(repo_path, "src", "setuppy_blog", "__about__.py"), "r", "utf-8"
) as f:
    exec(f.read(), about)

with open("README.md", "r", "utf-8") as f:
    readme = f.read()

setup(
    name=about["__title__"],
    version=about["__version__"],
    description=about["__description__"],
    long_description=readme,
    long_description_content_type="text/markdown",
    author=about["__author__"],
    url=about["__url__"],
    entry_points={
        "console_scripts": [
            "blog-math = setuppy_blog.cli:main",
            "blog-say = setuppy_blog.cli.say:cli",
        ]
    },
    author_email=about["__author_email__"],
    license=about["__license__"],
    classifiers=[
        "Development Status :: 6 - Mature",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Natural Language :: English",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.10",
        "Topic :: Software Development :: Build Tools",
        "Topic :: Software Development :: Libraries :: Python Modules",
        "Topic :: Documentation",
        "Environment :: Console",
        "Typing :: Typed",
        "Operating System :: OS Independent",
    ],
    package_dir={"": "src"},
    package_data={"setuppy_blog.templates": ["*.json"]},
    packages=packages,
    python_requires=">=3.10",
    install_requires=main_requires,
    extras_require={
        "feeds": feed_requires,
        "quotes": quote_requires,
        "dev": dev_requires,
        "all": [*feed_requires, *quote_requires],
    },
)
