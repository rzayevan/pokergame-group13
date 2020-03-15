<template>
  <div class="wrapper">
  <form id="search">
    Search <input name="query" v-model="searchQuery">
  </form>
  <div id="grid-template">
    <div class="table-header-wrapper">
      <table class="table-header">
        <thead>
          <th v-for="key in columns" :key="key"
            @click="sortBy(key)"
            :class="{ active: sortKey == key }"
          >
            {{ key | capitalize }}
            <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'"></span>
          </th>
        </thead>
      </table>
    </div>
    <div class="table-body-wrapper">
      <table class="table-body">
        <tbody>
          <tr v-for="entry in filteredData" :key="entry" v-on:click="onClick(entry)">
            <td v-for="key in columns" :key="key"> {{entry[key]}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <ReportModal
      v-show="isModalVisible"
      @close="closeModal"
    />
</div>
</template>

<script>
import ReportModal from './ReportModal.vue';

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
      isModalVisible: false
    }
  },
  computed: {
    filteredData: function () {
      let sortKey = this.sortKey;
      let filterKey = this.searchQuery && this.searchQuery.toLowerCase();
      let order = this.sortOrders[sortKey] || 1;
      let data = this.data;

      if (filterKey) {
        data = data.filter(function (row) {
          return Object.keys(row).some(function (key) {
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
  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  },
  methods: {
    sortBy: function (key) {
      this.sortKey = key;
      this.sortOrders[key] = this.sortOrders[key] * -1
    },
    showModal: function() {
        this.isModalVisible = true;
    },
    closeModal: function() {
        this.isModalVisible = false;
    },
    onClick: function (key) {
        console.log("clicked! " + key)
        this.showModal();
    },
  },
  created(){
    let sortOrders = {};
    console.log(this);
    console.log(this.columns);
    this.columns.forEach(function (key) {
      sortOrders[key] = 1;
    })
    this.sortOrders = sortOrders;
  }
}
</script>

<style scoped>
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
  border-bottom: 1px #008f68 solid;
}

th, td {
  min-width: 150px;
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
  border-bottom: 4px solid #FAE042;
}

.arrow.dsc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #FAE042;
}

#grid-template {
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  -webkit-flex-direction: column;
  width: 600px;
}
</style>