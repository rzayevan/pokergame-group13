<template>
  <div id="reports-page">
    <AdminNavbar :userData=userData class="navbar-section"/>
    <div class="wrapper">
      <ReportModal
        :reportData=reportData
      />
      <form id="search">
        Search <input class="form-control" name="query" v-model="searchQuery">
      </form>
      <div id="reports-grid">
        <div class="table-header-wrapper">
          <table class="table-header">
            <thead>
              <th v-for="column in columns" :key="column.id"
                @click="sortBy(column)"
                :class="{ active: sortKey == column.id }"
              >
                {{ column }}
                <span class="arrow" :class="sortOrders[column.id] > 0 ? 'asc' : 'dsc'"></span>
              </th>
            </thead>
          </table>
        </div>
        <div class="table-body-wrapper">
          <table class="table-body">
            <tbody>
              <tr v-for="entry in filteredData" :key="entry.id" v-on:click="onClick(entry)" v-bind:class="getEntryClass(entry)">
                <td v-for="key in columns" :key="key"> {{entry[key]}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ReportModal from './ReportModal.vue';
  import AdminNavbar from "./navbars/AdminNavbar";

  export default {
  name: "report-grid",
  props: ['authenticated', 'socket', 'userData'],
  components: {
      ReportModal,
      AdminNavbar
  },
  data(){
    // Empty report data to pass to ReportModal. Updated when a row is clicked  
    return {
      data: Array,
      columns: Array,
      searchQuery: '',
      sortKey: '',
      sortOrders: {},
      reportData: {
        id: 0,
        offendingUser: "",
        dateSubmitted: "",
        offense: "", 
        reportedBy: "",
        description: "",
        chatLogs: [],
        isReviewed: false
      }
    }
  },
  computed: {
    // Sorts and filters report data, based on search terms or ordering direction
    filteredData: function () {
      let sortKey = this.sortKey;
      let filterKey = this.searchQuery && this.searchQuery.toLowerCase();
      let order = this.sortOrders[sortKey] || 1;
      let data = this.data;
      let columns = this.columns;

      // Filter data if filterKey exists
      if (filterKey) {
        data = data.filter(function (row) {  
          return columns.some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1;
          })
        })
      }

      // Sort data if sortKey exists 
      if (sortKey) {
        data = data.slice().sort(function (row1, row2) {
          row1 = row1[sortKey];
          row2 = row2[sortKey];
          return (row1 === row2 ? 0 : row1 > row2 ? 1 : -1) * order;
        })
      }

      return data;
    },
  },
  methods: {
    // Sorts the grid entries by a particular key
    sortBy: function (key) {
      this.sortKey = key;
      this.sortOrders[key] = this.sortOrders[key] * -1;
    },
    // Opens the reports modal
    showModal: function() {
        this.$bvModal.show("report-modal");
    },
    // Fired when a row of the grid is clicked
    onClick: function (entry) {
      // Sets the data attributes of the passed data model to reflect the data entry at the clicked row
      this.reportData.id = entry["id"];
      this.reportData.offendingUser = entry["Offending User"];
      this.reportData.dateSubmitted = entry["Submitted"]
      this.reportData.offense = entry["Offense"];
      this.reportData.reportedBy = entry["Reported By"];
      this.reportData.description = entry["Description"];
      this.reportData.chatLogs = entry["chatLogs"];
      this.reportData.isReviewed = entry["isReviewed"];

      // Opens the modal
      this.showModal();
    },
    // Determines the class of a table row, depending on whether or not the corresponding report has been reviewed
    getEntryClass: function(entry) {
      return {
        isReviewed: entry.isReviewed
      }
    }
  },
  mounted() { // switched to mounted, props are not yet set in beforeCreate(), 
    if(!this.authenticated){
        this.$router.replace({ name: "Login" });
    } else { // because the socket will for some reason emit 'request reports' before checking athentication, this else statement is needed
      // Request reports from the server
      this.socket.emit('request reports');

      // Receive the reports and update the data and column arrays
      this.socket.on('receive reports', data => {
        this.data = data.reports;
        this.columns = data.gridColumns;
      });

      if (this.columns) {
        let sortOrders = {};
        this.columns.forEach(function (key) {
          sortOrders[key] = 1;
        })
        this.sortOrders = sortOrders;
      }
    }
  }
}
</script>

<style scoped>
  form {
    padding-bottom: 15px;
  }

  body {
    font-family: Helvetica Neue, Arial, sans-serif;
    font-size: 14px;
    color: #555;
  }

  #search {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .form-control {
    width: 80%;
    margin-left: 5%;
  }

  table {
    border-spacing: 0;
    width: 100%;
  }

  th {
    background-color: #01B0D9;
    color: white;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  td {
    border-bottom: 1px #0097b8 solid;
  }

  th, td {
    width: 25%;
    padding: 10px 20px;
  }

  th.active {
    color: #fff;
  }

  th.active .arrow {
    opacity: 1;
  }

  tr:hover {
      background-color: rgb(233, 233, 233);
  }

  .isReviewed {
    background-color: rgb(190, 190, 190);
  }

  .arrow {
    display: inline-block;
    vertical-align: middle;
    width: 0;
    height: 0;
    margin-left: 5px;
    opacity: 0.66;
  }

  .arrow.asc {
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 4px solid white;
  }

  .arrow.dsc {
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid white;
  }

  #reports-grid {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    -webkit-flex-direction: column;
    width: 80%;
    margin: auto;
    height: 100%;
  }
</style>