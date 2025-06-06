#!/bin/bash

# Exit on error
set -e

echo "Starting zipping process..."

# Clean up previous zip
echo "Cleaning up previous zip..."
rm -f extension.zip

# Create zip file
echo "Creating extension package..."
cd dist
zip -r ../extension.zip . -x "*.DS_Store" "*.git*"
cd ..

# Verify the zip file
if [ ! -f "extension.zip" ]; then
    echo "Error: extension.zip was not created"
    exit 1
fi

if [ ! -s "extension.zip" ]; then
    echo "Error: extension.zip is empty"
    exit 1
fi

echo "Zipping complete! Extension package created as extension.zip"
echo "Size of extension.zip: $(du -h extension.zip | cut -f1)"