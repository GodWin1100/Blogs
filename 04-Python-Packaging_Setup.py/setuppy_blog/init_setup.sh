#!/bin/bash -e
echo "Setting up for development..."
version=$(python -V)

if [[ "$version" == *"3.10"* ]];
then
    echo "Python Version is Compatible"
else
    echo "Python Version is Not Compatible"
    echo "Current Version: $version, Required Version: Python 3.10.x"
    exit -1
fi

echo "Creating virtual environment..."
python -m venv ./venv
echo "Virtual environment created"

echo "Activating Virtual Environment"
source ./venv/Scripts/activate

echo "Installing libraries..."
pip install -r requirements-dev.txt
echo "Libraries installed"

echo "Setup Completed"