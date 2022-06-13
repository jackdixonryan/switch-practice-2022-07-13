<template>
  <v-card>
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
            <tr v-for="account in accounts" :key="account.id">
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
      accounts: [],
      items: [],
    }
  },
  mounted() {
    // only mount this page if the store contains a user
    if (this.$store.state.user) {
      this.user = this.$store.state.user;

      this.parseAccountsRedirectData();
    } else {
      // if the user or Plaid meta doesn't exist, push us back to the mock login.
      this.$router.push('/mock-login')
    }
  },
  methods: {
    // on pushing the next button, redirect to the transaction feed page.
    goToSummary() {
      this.$router.push("/transactions");
    },
    // parse the accounts redirect data from the Link Money Gateway. Expect multiple items with accounts on each.
    parseAccountsRedirectData() { 
      const events = this.$route.query.events;
      const eventsJson = JSON.parse(decodeURIComponent(events));

      eventsJson.forEach((event) => {
        const { item_id, accounts } = event;
        this.items.push(item_id);
        this.accounts.push(...accounts);
      });

      this.$store.commit("setItemArray", this.items);
    }
  }
}
</script>