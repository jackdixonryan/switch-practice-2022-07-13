// This basic state manager keeps track of a username string, and some Plaid Metadata. This allows us to more easily swap between pages or refresh this application
// without having to run the Link Account process manually again.

export const state = () => ({
  user: null,
  plaidMeta: null
});

export const mutations = {

  // sets the user state, and sets the item in local storage.
  setUser(state, user) {
    state.user = user;

    if (window) {
      console.log(window.localStorage);
      localStorage.setItem("fin-switch-user", JSON.stringify(user));
    } else {
      console.log("NO window")
    }
  },

  // sets the Plaid metadata, and sets it in local storage. 
  setPlaidMeta(state, data) {
    state.plaidMeta = data;
    if (window) {
      console.log(window.localStorage);
      localStorage.setItem("fin-plaid-meta", JSON.stringify(data));
    } else {
      console.log("NO window")
    }
  },

  // Checks local storage for a user variable, and sets user to that. 
  setUserFromStorage(state) {
    if (window) {
      const user = window.localStorage.getItem("fin-switch-user");
      if (user) {
        state.user = JSON.parse(user);
      }
    } else {
      throw new Error("Window not found.");
    }
  },

  // Checks local storage for a plaidMeta variable, and sets the user to that. 
  setPlaidMetaFromStorage(state) {
    if (window) {
      const meta = window.localStorage.getItem("fin-plaid-meta");
      if (meta) {
        state.plaidMeta = JSON.parse(meta);
      }
    } else {
      throw new Error("Window not found.");
    }
  }
}