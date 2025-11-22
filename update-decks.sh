#!/bin/bash

# Script to automate the daily deck update process
# This script runs download, start, commits, and pushes changes

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ANALYSIS_DIR="$SCRIPT_DIR/analysis"

echo -e "${YELLOW}🚀 Starting deck update process...${NC}\n"

# Step 1: Export API_KEY environment variable
echo -e "${YELLOW}🔑 Exporting API_KEY...${NC}"
export API_KEY=9562e179dde91b8c4cd67d3a00b882b3
echo -e "${GREEN}✅ API_KEY exported${NC}"

# Step 2: Navigate to analysis directory
echo -e "${YELLOW}📁 Changing to analysis directory...${NC}"
cd "$ANALYSIS_DIR"

# Step 3: Run yarn download
echo -e "\n${YELLOW}⬇️  Running 'yarn download'...${NC}"
if yarn download; then
    echo -e "${GREEN}✅ 'yarn download' completed successfully${NC}"
else
    echo -e "${RED}❌ 'yarn download' failed. Aborting update.${NC}"
    exit 1
fi

# Step 4: Run yarn start
echo -e "\n${YELLOW}🔄 Running 'yarn start'...${NC}"
if yarn start; then
    echo -e "${GREEN}✅ 'yarn start' completed successfully${NC}"
else
    echo -e "${RED}❌ 'yarn start' failed. Aborting update.${NC}"
    exit 1
fi

# Step 5: Go back to root directory for git operations
cd "$SCRIPT_DIR"

# Step 6: Check if there are any changes to commit
if [ -z "$(git status --porcelain)" ]; then
    echo -e "\n${YELLOW}ℹ️  No changes to commit.${NC}"
    exit 0
fi

# Step 7: Commit changes
echo -e "\n${YELLOW}💾 Committing changes...${NC}"
if git add -A && git commit -m ":rocket: update best decks"; then
    echo -e "${GREEN}✅ Changes committed successfully${NC}"
else
    echo -e "${RED}❌ Failed to commit changes.${NC}"
    exit 1
fi

# Step 8: Push changes
echo -e "\n${YELLOW}📤 Pushing changes to remote...${NC}"
if git push; then
    echo -e "${GREEN}✅ Changes pushed successfully${NC}"
else
    echo -e "${RED}❌ Failed to push changes.${NC}"
    exit 1
fi

echo -e "\n${GREEN}🎉 Update process completed successfully!${NC}"


