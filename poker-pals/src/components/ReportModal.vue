<template>
  <div class="modal-container">
    <b-modal centered size="xl" id="report-modal">
      <!-- Modal header template -->
      <template v-slot:modal-header>
        <div>
          <h5 reportData="reportData">Report: {{ reportData.offendingUser }} &ndash; {{ reportData.offense }} </h5>
          <p class="no-margin" reportData="reportData">{{ reportData.dateSubmitted }}</p>
        </div>
        <b-button class="close" @click="cancel()">
          &times;
        </b-button>
      </template>

      <!-- Modal body template -->
      <template v-slot:default class="modal-body">
        <p reportData="reportData">Submitted by {{ reportData.reportedBy }}</p>
        <p><strong>Description</strong></p>
        <p reportData="reportData">{{ reportData.description }}</p>
        <p><strong>Chat Logs</strong></p>
        <ul class="chat-display">
          <li reportData="reportData" class="row" v-for="chat in reportData.chatLogs" :key="chat.message">
            <p class="chat-username">{{ chat.username + ": "}}</p>
            <p>{{ chat.message }}</p>
          </li>
        </ul>
      </template>
      
      <!-- Modal footer template -->
      <template v-slot:modal-footer>
        <b-button class="control-btn" reportData="reportData" variant="primary" @click="dismiss()" :disabled="reportData.isReviewed">
          Dismiss
        </b-button>
        <b-button class="control-btn" reportData="reportData" variant="danger" @click="ban()" :disabled="reportData.isReviewed">
          Ban
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import io from "socket.io-client";
export default {
    name: 'ReportModal',
    props: ['reportData'],
    mounted() {
      this.socket = io("http://localhost:3000");
    },
    methods: {
      // Hide modal
      cancel: function() {
        this.$bvModal.hide("report-modal");
      },
      // Dismiss the report and close the modal
      dismiss: function() {
        this.$bvModal.hide("report-modal");
        this.socket.emit("review report", { id: this.reportData.id, newStatus: "dismissed" });
      },
      // Ban the offending user and close the modal
      ban: function() {
        this.$bvModal.hide("report-modal");
        this.socket.emit("review report", { id: this.reportData.id, newStatus: "banned" });
      }
    },
  };
</script>

<style scoped>
  @media (min-width: 300px) {
    p {
      font-size: 4vw;
    }

    .control-btn {
      font-size: 4.5vw !important;
    }
  }

  @media (min-width: 768px) {
    p {
      font-size: 1.25vw;
    }

    .control-btn {
      font-size: 1.25vw !important;
    }
  }

  body {
    height: 100%;
  }

  #report-modal {
    height: 100%; 
  }

  .modal-container {
    height: 100%;
  }

  .modal-body {
    height: 100%;
  }

  .modal-content {
    height: 100%;
  }

  .modal-dialog.modal-xl.modal-dialog-centered {
    height: 100%;
  }

  .close:hover {
    background: white;
  }

  .chat-username {
    margin-right: 0.3em;
  }

  .chat-display {
    border-width: 1px;
    border-color: grey;
    border-style: solid;
    border-radius: 5px;
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

  .btn-close {
    border: none;
    font-size: 20px;
    padding: 20px;
    cursor: pointer;
    font-weight: bold;
    color: #4AAE9B;
    background: transparent;
  }
</style>