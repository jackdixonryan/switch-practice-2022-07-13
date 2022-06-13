<template>
  <v-card v-if="plaidMeta">
    <v-card-title>Plaid Link</v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">ID</th>
              <th class="text-left">Mask</th>
              <th class="text-left">Name</th>
              <th class="text-left">Subtype</th>
              <th class="text-left">Type</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="account in plaidMeta.accounts" :key="account.id">
              <td>{{ account.id }}</td>
              <td>{{ account.mask }}</td>
              <td>{{ account.name }}</td>
              <td>{{ account.subtype }}</td>
              <td>{{ account.type }}</td>
            </tr>
          </tbody>
        </template> 
      </v-simple-table>
      <v-simple-table>
        <template v-slot:default>
        </template> 
      </v-simple-table>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="goToSummary">See Transactions</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      user: null, 
      plaidMeta: null,
    }
  },
  mounted() {
    // only mount this page if the store contains both a user, and Plaid metadata.
    if (this.$store.state.user && this.$store.state.plaidMeta) {
      this.user = this.$store.state.user;
      this.plaidMeta = this.$store.state.plaidMeta;
    } else {
      // if the user or Plaid meta doesn't exist, push us back to the mock login.
      this.$router.push('/mock-login')
    }
  },
  methods: {
    // on pushing the next button, redirect to the transaction feed page.
    goToSummary() {
      this.$router.push("/transactions");
    }
  }
}
</script>