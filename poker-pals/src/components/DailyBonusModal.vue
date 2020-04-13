<template>
  <div class="modal-container">
    <b-modal centered id="daily-bonus-modal">
      <!-- Modal header template -->
      <template v-slot:modal-header>
        <div>
          <h5>Welcome Back Poker Pal!</h5>
        </div>
        <b-button class="close" @click="hide()">
          &times;
        </b-button>
      </template>

      <!-- Modal body template -->
      <template v-slot:default class="modal-body">
        <b-row class="bonus-title">
          <p>Here's your daily bonus</p>
        </b-row>
     
        <b-row class="bonus-content"> 
            <div class="chip-icon">
              <img alt="chip icon" :src="require('../images/ImageFiles').getImage('chip').src">
            </div> 
            <p class="bonus-amount" dailyBonusAmount="dailyBonusAmount">{{ dailyBonusAmount }}</p>
        </b-row>
        
      </template>
      
      <template v-slot:modal-footer>
        <b-button variant="primary" @click="hide()">Accept</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
export default {
    name: 'DailyBonusModal',
    props: ['dailyBonusAmount'],
    methods: {
      // Hide modal
      hide: function() {
        this.$bvModal.hide("daily-bonus-modal");
        this.$parent.addDailyBonus();
      }
    },
  };
</script>

<style scoped>
  body {
    height: 100%;
  }

  h5 {
    margin: 0;
  }

  .bonus-title {
    display: flex;
    justify-content: center;
    align-content: center;
  }

  .chip-icon{
    width: 8%;
    height: 8%;
    margin-right: 2%;
  }

  .chip-icon img {
    max-width:100%;
    max-height:100%;
    float: left; 
    object-fit: cover;
    color: white; 
  }

  .bonus-content {
    display: flex;
    justify-content: center;
    align-content: center;
  }

  .bonus-amount {
    font-size: 1.75vw;
    margin-top: auto;
    margin-bottom: auto;
  }

  .modal-container {
    height: 100%;
  }

  .modal-body {
    height: 100%;
  }

  .close:hover {
    background: white;
  }
</style>