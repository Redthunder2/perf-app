#!/bin/bash

# Video Chat App Start Script
echo "Starting Video Chat App..."

# Check if .NET is installed
if ! command -v dotnet &> /dev/null
then
    echo "Error: .NET 6.0 SDK is not installed. Please install it first."
    exit 1
fi

# Navigate to the application directory
cd "$(dirname "$0")"

# Build the application
echo "Building application..."
dotnet build ChatApp.csproj

# Check if build succeeded
if [ $? -eq 0 ]; then
    echo "Build successful! Starting application..."
    echo "The application will be available at: http://localhost:5000"
    echo "Press Ctrl+C to stop the application"
    
    # Run the application
    dotnet run --project ChatApp.csproj --urls="http://0.0.0.0:5000"
else
    echo "Build failed! Please check the error messages above."
    exit 1
fi
