<template>
  <div>
    <div class="container">
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              Mock Login
            </v-card-title>
            <v-card-text>
              <v-text-field
                label="Username"
                v-model="username"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="submitLogin">
                Sign In
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: null,
    }
  },
  methods: {
    // commits a username to the store, and redirects to the root page. 
    submitLogin() {
      this.$store.commit("setUser", { username: this.username });
      this.$router.push("/");
    }
  }
}
</script>

<style>

</style>