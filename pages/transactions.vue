<template>
  <div class="plaid-transactions-wrapper container fluid" style="margin-top:1rem;" v-if="user">
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Amount</th>
            <th class="text-left">Name</th>
            <th class="text-left">Date</th>
            <th class="text-left">Category</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in transactions" :key="transaction.id">
            <td>${{ transaction.amount.toFixed(2) }}</td>
            <td>{{ transaction.name }}</td>
            <td>{{ transaction.date }}</td>
            <td>{{ transaction.category.join(", ") }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      error: null,
      itemIds: null,
      accessToken: null,
      accounts: [],
      transactions: [],
      user: null,
    }
  },
  async mounted() {
    if (!this.$store.state.user || !this.$store.state.itemArray) {
      this.$router.push("mock-login");
    } else {  
      this.user = this.$store.state.user;
      this.itemIds = this.$store.state.itemArray;
      await this.getTransactions();
    }
  },
  methods: {
    // Transactions, unlike accounts, must be manually retrieved from the PlaidApi client. They do not appear in the Plaid callback data, because they are not always immediately available after account linking.
    async generateAccessToken(itemId) {
      try {   
        const response = await axios.post("/api/item-token", { itemId });
        const { data } = response;
        const { access_token } = data;
        return access_token;
      } catch(error) {
        console.log(error);
      }
    },
    async getTransactions() {
      try {
        for (let i = 0; i < this.itemIds.length; i++) {
          const itemId = this.itemIds[i];
          const token = await this.generateAccessToken(itemId);
          const transactionsResponse = await axios.post("/api/transactions", { accessToken: token });
          const { data } = transactionsResponse;
          this.transactions.push(...data.transactions); 
          this.accounts.push(...data.accounts); 
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
}
</script>
