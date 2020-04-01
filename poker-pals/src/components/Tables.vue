<template>
    <div id="tables-page">
        <UserNavbar class="navbar-section"/>
        <div class="table">
            <div class="table-description">
                <div class = "table-stakes">
                    <p> 20,000 </p> 
                    <p> 1000/2000 </p>
                </div> 
                <div class = "chips-pic">
                <img alt="Vue logo" src="../assets/chip.png">
                </div> 
            </div> 
            <div class="table-details">
                <div class = "table-name">
                    <p> Table 1</p>
                </div>
                <div class = "seats">
                    <p> 6/6 </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import UserNavbar from "./navbars/UserNavbar";

export default {
  name: 'Tables',
  components: {
      UserNavbar
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.table {
    background: #348c44;
    border-radius: 25px 25px 5px 5px;
    border: 2px solid; 
    border-color: #595959;
    width: 15em;
    height: 10em;
    position: relative; 
    text-align: center;
    margin: 20px; 
}

.table-description {
    width: 100%;
    height: 50px;
    position: absolute; 
    bottom: 50%; 
}

.chips-pic{
    width: 50%;
    height: 50px;
    padding-left: 50px; 
}

.chips-pic img {
    max-width:100%;
    max-height:100%;
    float: left; 
    object-fit: cover;
    color: white; 
}
.table-stakes {
    width: 50%;
    height: 50px;
    float: right; 
}
.table-description p {
    padding: 0; 
    margin: auto; 
    text-align: left;
    font-weight: bolder;
    color: white; 
}

.table-details {
    background: white;
    border-radius: 0px 0px 5px 5px;
    border-top: 2px solid; 
    border-color: #595959;
    width: 100%;
    height: 50px;
    position: absolute; 
    bottom: 0; 
}

.table-details .table-name {
    position: relative; 
    height: 50px; 
    width: 50%;  
    text-align: center;
    float: left; 
    font-size: 1em; 
    font-weight: bold;
}

.table-details .table-name p {
    position: relative;
    top: 25%; 
}

.table-details .seats {
    position: relative; 
    height: 50px; 
    width: 30%;  
    text-align: center;
    float: right; 
    font-weight: bolder; 
}

.table-details .seats p {
   position: relative;
    top: 25%; 
}

</style>
