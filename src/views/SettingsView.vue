<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h5">
            Application Settings
          </v-card-title>
          <v-card-text>
            <p class="text-subtitle-1 mb-4">Configure Porter Track settings</p>
            
            <v-list>
              <v-list-subheader>Data Management</v-list-subheader>
              
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-office-building</v-icon>
                </template>
                <v-list-item-title>
                  <router-link to="/buildings" class="text-decoration-none">
                    Manage Buildings and Departments
                  </router-link>
                </v-list-item-title>
                <v-list-item-subtitle>
                  Add, edit, or remove buildings and departments
                </v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-clipboard-list</v-icon>
                </template>
                <v-list-item-title>
                  <router-link to="/tasks" class="text-decoration-none">
                    Manage Tasks and Task Items
                  </router-link>
                </v-list-item-title>
                <v-list-item-subtitle>
                  Add, edit, or remove tasks and their sub-items
                </v-list-item-subtitle>
              </v-list-item>
              
              <v-divider class="my-3"></v-divider>
              <v-list-subheader>About</v-list-subheader>
              
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-information</v-icon>
                </template>
                <v-list-item-title>
                  Porter Track
                </v-list-item-title>
                <v-list-item-subtitle>
                  Version 1.0.0
                </v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-help-circle</v-icon>
                </template>
                <v-list-item-title>
                  Support
                </v-list-item-title>
                <v-list-item-subtitle>
                  Contact IT helpdesk for assistance
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// Settings view component
</script>
