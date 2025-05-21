#!/bin/bash

# This script fixes the SASS import issues by ensuring @use rules are at the top

# Create a backup directory
BACKUP_DIR="scss-fix-$(date +%Y%m%d%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "Creating clean versions of SCSS files..."

# Clean main.scss
echo "Fixing main.scss..."
cp "src/scss/main.scss" "$BACKUP_DIR/main.scss"

cat > src/scss/main.scss << EOL
@use 'sass:color';
@use 'index' as *;

/* Material Design Icons support */
.mdi {
  display: inline-block;
  font: normal normal normal 24px/1 "Material Design Icons";
  font-size: inherit;
  text-rendering: auto;
  line-height: inherit;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Custom icons */
.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  stroke-width: 0;
  stroke: currentColor;
  fill: currentColor;
  line-height: 0;
  vertical-align: middle;
}

/* Framework cleanup */
[class*="v-"], .v-application {
  all: unset !important;
}
EOL

# Function to fix Vue component SCSS imports
fix_vue_component() {
  local file="$1"
  local path_to_scss="$2"
  
  echo "Fixing $file..."
  cp "$file" "$BACKUP_DIR/$(basename "$file")"
  
  # Get the content of the file
  content=$(cat "$file")
  
  # Create a temporary file
  tmp_file=$(mktemp)
  
  # Extract the parts before and after <style>
  awk 'BEGIN {p=1} /<style lang="scss" scoped>/ {print; p=0; exit} p' "$file" > "$tmp_file"
  echo "@use '$path_to_scss/index' as s;" >> "$tmp_file"
  awk 'BEGIN {p=0} /<style lang="scss" scoped>/ {p=1; next} p' "$file" | grep -v "@use" >> "$tmp_file"
  
  # Replace the original file
  mv "$tmp_file" "$file"
  
  echo "Fixed $file"
}

# Fix App.vue
echo "Fixing App.vue..."
cp "src/App.vue" "$BACKUP_DIR/App.vue"

# Create a temp file
tmp_file=$(mktemp)

# Get the content before the style tag
awk 'BEGIN {p=1} /<style lang="scss" scoped>/ {p=0; exit} p' "src/App.vue" > "$tmp_file"
# Add the style tag and @use statement
echo "<style lang=\"scss\" scoped>" >> "$tmp_file"
echo "@use './scss/index' as s;" >> "$tmp_file"
# Get the rest of the file, skipping the original @use line
awk 'BEGIN {p=0} /<style lang="scss" scoped>/ {p=1; next} p' "src/App.vue" | grep -v "@use" >> "$tmp_file"

# Replace the original file
mv "$tmp_file" "src/App.vue"

# Fix Icon.vue
echo "Fixing Icon.vue..."
cp "src/components/common/Icon.vue" "$BACKUP_DIR/Icon.vue"

# Create a temp file
tmp_file=$(mktemp)

# Get the content before the style tag
awk 'BEGIN {p=1} /<style lang="scss" scoped>/ {p=0; exit} p' "src/components/common/Icon.vue" > "$tmp_file"
# Add the style tag and @use statement
echo "<style lang=\"scss\" scoped>" >> "$tmp_file"
echo "@use '../../scss/index' as s;" >> "$tmp_file"
# Get the rest of the file, skipping the original @use line
awk 'BEGIN {p=0} /<style lang="scss" scoped>/ {p=1; next} p' "src/components/common/Icon.vue" | grep -v "@use" >> "$tmp_file"

# Replace the original file
mv "$tmp_file" "src/components/common/Icon.vue"

echo "SASS import fix complete. Files backed up to $BACKUP_DIR"
