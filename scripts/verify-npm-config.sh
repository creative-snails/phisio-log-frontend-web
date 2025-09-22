#!/bin/bash

# Script to verify npm registry configuration and package-lock.json integrity
# Run this script after installing new packages to ensure everything is correct

echo "🔍 Checking npm registry configuration..."

# Check current registry
CURRENT_REGISTRY=$(npm config get registry)
echo "Current registry: $CURRENT_REGISTRY"

if [[ "$CURRENT_REGISTRY" == "https://registry.npmjs.org/" ]]; then
    echo "✅ Registry is correctly set to public npm registry"
else
    echo "⚠️  Warning: Registry is not set to public npm registry"
    echo "   Expected: https://registry.npmjs.org/"
    echo "   Current:  $CURRENT_REGISTRY"
fi

echo ""
echo "🔍 Checking package-lock.json for private registry references..."

if [ -f "package-lock.json" ]; then
    NEXUS_COUNT=$(grep -c "nexus\.use1\.infra-pure\.cloud" package-lock.json 2>/dev/null || echo "0")
    PUBLIC_COUNT=$(grep -c "registry\.npmjs\.org" package-lock.json 2>/dev/null || echo "0")

    echo "Private registry references: $NEXUS_COUNT"
    echo "Public registry references: $PUBLIC_COUNT"

    if [ "$NEXUS_COUNT" -gt 0 ]; then
        echo "❌ Warning: Found private registry references in package-lock.json"
        echo "   Consider regenerating package-lock.json:"
        echo "   rm package-lock.json && npm install"
    else
        echo "✅ No private registry references found"
    fi
else
    echo "⚠️  package-lock.json not found"
fi

echo ""
echo "🔍 Checking .npmrc file..."

if [ -f ".npmrc" ]; then
    echo "✅ .npmrc file exists"
    echo "Contents:"
    cat .npmrc
else
    echo "❌ .npmrc file missing - this could cause registry issues"
    echo "   Consider creating .npmrc with: registry=https://registry.npmjs.org/"
fi

echo ""
echo "✅ Verification complete!"
