<template>
  <div>
    <!-- <div class="plaid-link-wrapper">
    </div> -->
    <v-btn class="link-opener" @click="openLink">Link An Account</v-btn>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  // data() {
  //   return {
  //     handler: null,
  //   }
  // },
  async mounted() {
    // const token = await this.generateToken();
    // this.handler = this.createPlaidInstance(token);
  },
  methods: {
    // Checks if there is a valid username, and generates a Link token if so.
    async generateToken() {
      try {
        const user = this.$store.state.user;
        if (!user) {
          this.$router.push("/mock-login");
        } else {
          const { username } = user;

          // PLAID LINK code removed 
          // const response = await axios.post('/api/create-link-token', {}, { headers: { "userId": username }});
          // const { data } = response;
          // const { link_token } = data;
          // return link_token;

          // Link Money API Token Call
          const response = await axios.post("/api/user-token", { userId: username });
          const { data } = response;
          const { access_token } = data;
          return access_token;
        }
      } catch (error) {
        console.log(error);
      }
    },
    // PLAID LINK code removed.
    // Creates an instance of Plaid Link, using a valid link token.
    // createPlaidInstance(link_token) {
      
    //   const vm = this; // need to bind this to a variable, otherwise it rebinds to Plaid.create

    //   const handler = Plaid.create({
    //     token: link_token,
    //     onLoad() {
    //       console.log("Plaid link loaded.");
    //     },
    //     onSuccess(public_token, metadata) {
    //       console.log("Plaid link succeeded.");
    //       vm.$store.commit("setPlaidMeta", metadata);
    //       vm.$router.push("/success");
    //     },
    //     onExit(err, metadata) {
    //       console.log("Plaid link exited.");
    //       if (err) {
    //         console.log(err);
    //       }
    //       vm.$store.commit("setPlaidMeta", metadata);
    //     },
    //     onEvent(eventName, metadata) {
    //       vm.$store.commit("setPlaidMeta", metadata);
    //     }
    //   });

    //   return handler;
    // },
    async openLink() {
      const access_token = await this.generateToken();
      const redirectUri = `http://localhost:3000/success`; // this is our current PORT
      const linkMoneyGatewayBaseUrl = `https://linkmoney-gateway.fingoal.com`; // This is the Link Money Gateway in Production. 
      window.open(`${linkMoneyGatewayBaseUrl}/api/authenticate?token=${access_token}&redirectUri=${redirectUri}`); // Open the window with the Link Money Gateway, instead of opening the Plaid Link.
    }
  }
}
</script>

<style scoped>
  .link-opener {
    position: absolute;
    top: 50%;
    left: 40%;
  }
</style>
