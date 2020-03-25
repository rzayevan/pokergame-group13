<template>
  <div class="wrapper">
      <ReportModal
      :reportData=reportData
    />
  <form id="search">
    Search <input name="query" v-model="searchQuery">
  </form>
  <div id="grid-template">
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
</template>

<script>
  import ReportModal from './ReportModal.vue';
  import io from "socket.io-client";

  export default {
  name: "grid",
  props: {
    data: Array,
    columns: Array,
  },
  components: {
      ReportModal,
  },
  data(){
    return {
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
        chatLogs: []
      }
    }
  },
  computed: {
    filteredData: function () {
      let sortKey = this.sortKey;
      let filterKey = this.searchQuery && this.searchQuery.toLowerCase();
      let order = this.sortOrders[sortKey] || 1;
      let data = this.data;
     // let data = this.temp;
      let columns = this.columns;

      if (filterKey) {
        data = data.filter(function (row) {  
          return columns.some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1;
          })
        })
      }
      if (sortKey) {
        data = data.slice().sort(function (a, b) {
          a = a[sortKey];
          b = b[sortKey];
          return (a === b ? 0 : a > b ? 1 : -1) * order;
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
    // Opens the modal
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

      // Opens the modal
      this.showModal();
    },
    getEntryClass: function(entry) {
     // console.log(entry);
      return {
        isReviewed: entry.isReviewed
      }
    }
  },
  created(){
    let sortOrders = {};
    this.columns.forEach(function (key) {
      sortOrders[key] = 1;
    })
    this.sortOrders = sortOrders;


    this.socket = io("http://localhost:3000");
    this.socket.on("connected", data => {
        console.log("client received a message: " + data);
    });
  }
}
</script>

<style scoped>
form {
  padding-bottom: 15px;
}

body{
  font-family: Helvetica Neue, Arial, sans-serif;
  font-size: 14px;
  color: #555;
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

#grid-template {
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  -webkit-flex-direction: column;
  width: 80%;
  margin: auto;
  height: 100%;
}
</style>