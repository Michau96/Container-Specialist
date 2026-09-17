#!/bin/bash
find src -type f -name "*.tsx" -exec sed -i 's/stone-850/stone-800/g' {} +
find src -type f -name "*.tsx" -exec sed -i 's/stone-750/stone-700/g' {} +
