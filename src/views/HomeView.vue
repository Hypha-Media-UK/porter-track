<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="mx-auto my-4" max-width="600">
          <v-card-title class="text-h5">
            Welcome to Porter Track
          </v-card-title>
          <v-card-text>
            <p>This application helps hospital porters track tasks throughout their shift.</p>
            <p class="mt-4">Use the navigation menu to:</p>
            <v-list>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-office-building</v-icon>
                </template>
                <v-list-item-title>
                  Manage buildings and departments
                </v-list-item-title>
              </v-list-item>
              
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-clipboard-list</v-icon>
                </template>
                <v-list-item-title>
                  Manage tasks and task items
                </v-list-item-title>
              </v-list-item>
              
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-cog</v-icon>
                </template>
                <v-list-item-title>
                  Configure application settings
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// Home view component
</script>
