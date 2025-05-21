#!/bin/bash

# This script converts old Sass @import style to modern @use/@forward in Vue components
# Usage: Run from the root directory: ./convert-scss-imports.sh

# Create a backup directory
BACKUP_DIR="scss-backup-$(date +%Y%m%d%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Function to process a Vue file
process_vue_file() {
  local file="$1"
  echo "Processing $file..."
  
  # Create backup
  cp "$file" "$BACKUP_DIR/$(basename "$file")"
  
  # Check if the file has a scoped style section with @import statements
  if grep -q "<style lang=\"scss\" scoped>" "$file" && grep -q "@import" "$file"; then
    # Replace @import statements with @use statement at the top of the style section
    sed -i.bak '/<style lang="scss" scoped>/a\
/* Import the stylesheet at the top */\
@use '"'\.\.\/\.\.\/scss\/index'"' as s;' "$file"
    
    # Replace variable references
    sed -i.bak 's/\$spacing-/s\.\$spacing-/g' "$file"
    sed -i.bak 's/\$color-/s\.\$color-/g' "$file"
    sed -i.bak 's/\$font-size-/s\.\$font-size-/g' "$file"
    sed -i.bak 's/\$font-weight-/s\.\$font-weight-/g' "$file"
    sed -i.bak 's/\$border-radius/s\.\$border-radius/g' "$file"
    sed -i.bak 's/\$transition-/s\.\$transition-/g' "$file"
    sed -i.bak 's/\$shadow-/s\.\$shadow-/g' "$file"
    
    # Remove old import statements
    sed -i.bak '/^@import/d' "$file"
    
    # Clean up backup files
    rm "${file}.bak"
  fi
}

# Convert main SCSS files
update_scss_main() {
  echo "Updating main.scss..."
  cp "src/scss/main.scss" "$BACKUP_DIR/main.scss"
  
  # Create a new main.scss file with @use at the top
  cat > src/scss/main.scss << EOL
/* Main SCSS Entry File */

// Use the modern module system - must be at the top
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
// This section removes any remaining Vuetify-specific styles
// that might be affecting the layout after the redesign
[class*="v-"], .v-application {
  all: unset !important;
}
EOL
}

# Process App.vue separately since it has a different path structure
process_app_vue() {
  echo "Processing src/App.vue..."
  cp "src/App.vue" "$BACKUP_DIR/App.vue"
  
  if grep -q "<style lang=\"scss\"" "src/App.vue"; then
    # Add @use statement at the top of the style section
    sed -i.bak '/<style lang="scss"/a\
/* Import the stylesheet at the top */\
@use '"'\.\/scss\/index'"' as s;' "src/App.vue"
    
    # Replace variable references
    sed -i.bak 's/\$spacing-/s\.\$spacing-/g' "src/App.vue"
    sed -i.bak 's/\$color-/s\.\$color-/g' "src/App.vue"
    sed -i.bak 's/\$font-size-/s\.\$font-size-/g' "src/App.vue"
    sed -i.bak 's/\$font-weight-/s\.\$font-weight-/g' "src/App.vue"
    sed -i.bak 's/\$border-radius/s\.\$border-radius/g' "src/App.vue"
    sed -i.bak 's/\$transition-/s\.\$transition-/g' "src/App.vue"
    sed -i.bak 's/\$shadow-/s\.\$shadow-/g' "src/App.vue"
    
    # Remove old import statements
    sed -i.bak '/^@import/d' "src/App.vue"
    
    # Clean up backup files
    rm "src/App.vue.bak"
  fi
}

# Update SCSS files structure
update_scss_main

# Process App.vue
process_app_vue

# Find all Vue files except App.vue and process them
find src -name "*.vue" ! -name "App.vue" | while read -r file; do
  process_vue_file "$file"
done

echo "Conversion complete. Backups saved to $BACKUP_DIR"
