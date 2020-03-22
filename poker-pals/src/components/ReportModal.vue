<template>
  <div>
    <b-modal centered size="xl" id="modal-1">
      <template v-slot:modal-header>
        <div>
          <h5 reportData="reportData">Report: {{ reportData.offendingUser }} &ndash; {{ reportData.offense }} </h5>
          <p class="no-margin" reportData="reportData">{{ reportData.dateSubmitted }}</p>
        </div>
        <b-button class="close" @click="cancel()">
          &times;
        </b-button>

      </template>

      <template v-slot:default>
        <!-- <p>Modal Body</p> -->
        <!-- <p hello='hello'>{{ hello }}</p> -->

        <p reportData="reportData">Submitted by {{ reportData.reportedBy }}</p>

        <p>Description</p>
        <p reportData="reportData">{{ reportData.description }}</p>
        <p>Chat Logs</p>
        <ul class="chat-display">
          <!-- <li>Chat 1</li>
          <li>Chat 2</li> -->
          <li reportData="reportData" class="row" v-for="chat in reportData.chatLogs" :key="chat.message">
            <p>{{ chat.username + ": "}}</p>
            <p class="space"></p>
            <p>{{ chat.message }}</p>
          </li>
        </ul>
      </template>
      


      <template v-slot:modal-footer>

        <b-button variant="primary" @click="dismiss()">
          Dismiss
        </b-button>
        <b-button variant="danger" @click="ban()">
          Ban
        </b-button>
      </template>
    
      <!-- <p hello= 'hello'>{{ hello }}</p>
      <p>Submitted by </p>
      <p>Description</p>
      <p>Chat Logs</p> -->
    </b-modal>
  </div>
</template>

<script>
export default {
    name: 'ReportModal',
    props: ['hello', 'reportData'],
    methods: {
      cancel: function() {
        this.$bvModal.hide('modal-1');
      },
      dismiss: function() {
        console.log("dismiss");
        console.log(this.reportData);
        this.$bvModal.hide('modal-1');
      },
      ban: function() {
        console.log("ban");
        this.$bvModal.hide('modal-1');
      }
    },
  };
</script>

<style scoped>

.close:hover {
  background: white;
}

.space {
  width: 0.3em;
}

.chat-display {
  border-width: 1px;
  border-color: grey;
  border-style: solid;

  padding: 10px;
}


li {
  list-style-type: none;
  margin: 0;
}

.no-margin {
  margin: 0
}
.modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column; 
  }

  div.modal.modal .modal-dialog {
    width: 80% !important;
  }

  .modal-header,
  .modal-footer {
    padding: 15px;
    display: flex;
  }

  .modal-header {
    border-bottom: 1px solid #eeeeee;
    color: #4AAE9B;
    justify-content: space-between;
  }

  .modal-footer {
    border-top: 1px solid #eeeeee;
    justify-content: flex-end;
  }

  .modal-body {
    position: relative;
    padding: 20px 10px;
  }

  .btn-close {
    border: none;
    font-size: 20px;
    padding: 20px;
    cursor: pointer;
    font-weight: bold;
    color: #4AAE9B;
    background: transparent;
  }

  .btn-green {
    color: white;
    background: #4AAE9B;
    border: 1px solid #4AAE9B;
    border-radius: 2px;
  }

  .modal-fade-enter,
  .modal-fade-leave-active {
    opacity: 0;
  }

  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity .5s ease
  }
</style>