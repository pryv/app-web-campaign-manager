<template>
    <div id="SignIn">
        <h2>Patient Sign in</h2>
        <br>

        <v-form v-model="valid">
            <v-text-field
              v-model="user.pryvUsername"
              :rules="usernameRules"
              label="Pryv Username"
              required
              @keyup.enter="signIn"
            ></v-text-field>
            <v-text-field
              v-model="user.pryvPassword"
              :rules="passwordRules"
              label="Pryv Password"
              required
              type="password"
              @keyup.enter="signIn"
            ></v-text-field>
        </v-form>

        <v-btn depressed small color="primary" v-on:click="signIn">Sign in</v-btn>

        <v-snackbar
          v-model="snackbar.display"
          :color="snackbar.color"
          :timeout=6000
          :top="true"
        >
            {{ snackbar.text }}
            <v-btn
              dark
              flat
              @click="snackbar.display = false"
            >
                Close
            </v-btn>
        </v-snackbar>

    </div>
</template>

<script>
  import Pryv from '@/models/pryv';
  import config from '@/utils/config';

  export default {
    name: 'SignIn',
    data () {
      return {
        pryvModel: new Pryv(),
        user: {
          pryvUsername: null,
          pryvPassword: null,
        },
        pryvDomain: config.pryv.domain,
        valid: false,
        usernameRules: [
          v => !!v || 'Username is required',
        ],
        passwordRules: [
          v => !!v || 'Password is required',
        ],
        snackbar: {
          display: false,
            color: 'info',
            text: ''
        }
      }
    },
    async created() {
      await this.pryvModel.fetchServiceInfo();
    },
    methods: {
      async signIn() {
        try {
          const userExists = await this.pryvModel.userExists({
            username: this.user.pryvUsername,
          });
          if (! userExists) {
            return this.showSnackbar({
              color: 'error',
              text: 'Username does not exist.',
            });
          }

          const signInResponse = await this.pryvModel.signIn({
            username: this.user.pryvUsername,
            password: this.user.pryvPassword,
          });
          if (signInResponse.body.error) {
            return console.error('got error signin in to pryv' + signInResponse.error);
          }

          this.$router.push({
            path: '/patientAccount',
            query: {
              pryvUsername: this.user.pryvUsername,
              pryvToken: signInResponse.body.token
            }
          })
        } catch (e) {
          let msg = e;
          if ((e.response != null) && (e.response.body != null)) {
            msg = e.response.body;
          }
          this.showSnackbar({
            color: 'error',
            text: msg.message,
          });
          console.error('error while linking to Pryv', msg);
        }
      },
      showSnackbar(params: {
        color: string,
        text: string
      }): void {
        this.snackbar.text = params.text;
        this.snackbar.color = params.color;
        this.snackbar.display = true;
      }
    }
  };
</script>

<!-- styling for the component -->
<style>
    #SignIn {
    }
</style>